import { logger } from "@/utils/logger";
import { shiftChars } from "@/utils/shiftChar";
import { WritableObservable, observable } from "micro-observables";
import { StreamApi } from "./stream.api";
import {
  ContentType,
  DataType,
  LoadingState,
  MessageEvent,
  NodeChunkContent,
  ParsedMessageType,
  SearchProgressResult,
  SearchStep,
} from "./stream.type";
// Constants
const BUFFER_THRESHOLD = 30;
const CLOSING_TAG_REGEX = /<\/[^>]+>/;
const OPENING_TAG_REGEX = /<[^>]+>/;

/**
 * Service for managing streaming data from the API
 * Handles parsing, state management, and content organization
 */
export class StreamService {
  private lastMessageDate: Date = new Date();
  public readonly messageContent: WritableObservable<DataType[]> = observable(
    []
  );
  public readonly searchSteps: WritableObservable<SearchStep[]> = observable(
    []
  );
  public readonly searchProgress: WritableObservable<SearchProgressResult[]> =
    observable([]);
  public readonly loading: WritableObservable<LoadingState> =
    observable("SUCCESS");

  private buffer: string = "";

  constructor(private readonly streamApi: StreamApi) {}

  /**
   * Starts streaming data for the given prompt
   * @param prompt - The user's prompt/question to stream
   * @throws {Error} If prompt is empty or invalid
   */
  stream(prompt: string): void {
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new Error("Prompt must be a non-empty string");
    }

    this.close();
    this.loading.set("LOADING");
    this.streamApi.stream(prompt, (message) => this.onMessage(message));
  }

  /**
   * Handles incoming messages from the stream
   * @param message - The message event from the API
   */
  private onMessage(message: MessageEvent): void {
    if (__DEV__) {
      console.log(
        "token latency",
        new Date().getTime() - this.lastMessageDate.getTime(),
        "ms"
      );
    }
    this.lastMessageDate = new Date();
    try {
      const parsed = this.parseMessageType(message);

      switch (parsed.type) {
        case "STREAM":
          if (this.loading.get() === "LOADING") {
            this.loading.set("STREAMING");
          }
          this.parseCollapsibleContent(parsed.content);
          break;

        case "SEARCH_STEPS":
          this.searchSteps.set(parsed.content);
          break;

        case "SEARCH_PROGRESS":
          this.searchProgress.set(parsed.content);
          break;
        case "ERROR":
          logger.warn("Message type parsing error:", parsed.content);
          break;
      }
    } catch (error) {
      logger.error("Error processing message:", error, message);
      this.loading.set("ERROR");
    }
  }

  /**
   * Parses the message type and extracts content
   * @param message - The message event to parse
   * @returns Parsed message with type and content
   */
  private parseMessageType(message: MessageEvent): ParsedMessageType {
    if (message.type === "STREAM") {
      return {
        type: "STREAM",
        content: typeof message.content === "string" ? message.content : "",
      };
    }

    if (message.type === "NodeChunk") {
      const nodeContent = message.content as NodeChunkContent;

      if (nodeContent.nodeName === "SEARCH_STEPS") {
        return {
          type: "SEARCH_STEPS",
          content: nodeContent.content,
        };
      }

      if (nodeContent.nodeName === "SEARCH_PROGRESS") {
        return {
          type: "SEARCH_PROGRESS",
          content: nodeContent.content.results,
        };
      }

      return {
        type: "ERROR",
        content: `Unknown node chunk type: ${(nodeContent as any).nodeName}`,
      };
    }

    return {
      type: "ERROR",
      content: `Unknown message type: ${(message as any).type}`,
    };
  }

  /**
   * Closes the stream and resets all state
   */
  close(): void {
    this.streamApi.close();
    this.loading.set("SUCCESS");
    this.messageContent.set([]);
    this.searchSteps.set([]);
    this.searchProgress.set([]);
    this.buffer = "";
  }

  /**
   * Toggles the collapsed state of a collapsible content item
   * @param index - The 1-based index of the item to toggle
   * @throws {Error} If index is out of bounds
   */
  setCollapsibleContent(index: number): void {
    const messageContent = this.messageContent.get();

    if (index < 1 || index > messageContent.length) {
      throw new Error(
        `Index ${index} is out of bounds. Valid range: 1-${messageContent.length}`
      );
    }

    const updatedContent = [...messageContent];
    updatedContent[index - 1].collapsed = !updatedContent[index - 1].collapsed;
    this.messageContent.set(updatedContent);
  }

  /**
   * Parses collapsible content from stream chunks
   * Handles opening/closing tags and text accumulation
   * @param content - The content chunk to parse
   */
  private parseCollapsibleContent(content: string): void {
    try {
      this.buffer += content;

      if (this.buffer.length <= BUFFER_THRESHOLD) {
        return;
      }

      // Check for closing tag first
      const closingTagMatch = this.buffer.match(CLOSING_TAG_REGEX);
      if (closingTagMatch) {
        this.handleClosingTag(closingTagMatch[0]);
        return;
      }

      // Check for opening tag
      const openingTagMatch = this.buffer.match(OPENING_TAG_REGEX);
      if (openingTagMatch) {
        this.handleOpeningTag(openingTagMatch[0]);
        return;
      }

      // Process regular content
      this.handleRegularContent(content);
    } catch (error) {
      logger.error("Error parsing collapsible content:", error, {
        content,
        buffer: this.buffer,
      });
      // Continue processing - don't break the stream on parsing errors
    }
  }

  /**
   * Handles closing tag parsing
   * @param closingTag - The matched closing tag
   */
  private handleClosingTag(closingTag: string): void {
    const split = this.buffer.split(closingTag);

    if (split.length < 2) {
      logger.warn("Invalid closing tag structure:", closingTag);
      this.buffer = "";
      return;
    }

    const [contentBeforeTag, ...rest] = split;
    this.appendOrPush(contentBeforeTag);
    this.buffer = rest.join(closingTag);
  }

  /**
   * Handles opening tag parsing
   * @param openingTag - The matched opening tag
   */
  private handleOpeningTag(openingTag: string): void {
    const split = this.buffer.split(openingTag);

    if (split.length < 2) {
      logger.warn("Invalid opening tag structure:", openingTag);
      this.buffer = "";
      return;
    }

    const [contentBeforeTag, contentAfterTag] = split;

    // Add any content before the tag
    if (contentBeforeTag) {
      this.appendOrPush(contentBeforeTag);
    }

    // Create new collapsible item
    const messageContent = this.messageContent.get();
    const newItem: DataType = {
      type: this.parseContentType(openingTag),
      content: contentAfterTag || "",
      collapsed: true,
      id: messageContent.length + 1,
    };

    this.messageContent.set([...messageContent, newItem]);
    this.buffer = "";
  }

  /**
   * Handles regular content (no tags)
   * @param content - The content chunk to process
   */
  private handleRegularContent(content: string): void {
    const { shifted, remaining } = shiftChars(content.length, this.buffer);
    this.appendOrPush(shifted);
    this.buffer = remaining;
  }

  /**
   * Parses content type from opening tag
   * @param tag - The opening tag string
   * @returns The content type
   */
  private parseContentType(tag: string): ContentType {
    const validTypes: ContentType[] = ["<guideline>", "<drug>", "<think>"];

    if (validTypes.includes(tag as ContentType)) {
      return tag as ContentType;
    }

    return "TEXT";
  }

  /**
   * Appends content to the last message or creates a new TEXT message
   * @param content - The content to append or push
   */
  private appendOrPush(content: string): void {
    if (!content || content.length === 0) {
      return;
    }

    const messageContent = this.messageContent.get();

    if (messageContent.length > 0) {
      const updatedContent = [...messageContent];
      const lastItem = updatedContent[updatedContent.length - 1];
      lastItem.content += content;
      this.messageContent.set(updatedContent);
    } else {
      this.messageContent.set([
        {
          type: "TEXT",
          content,
          collapsed: true,
          id: 1,
        },
      ]);
    }
  }
}
