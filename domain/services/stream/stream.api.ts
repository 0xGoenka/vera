import { getApiUrl } from "@/config/api";
import { logger } from "@/utils/logger";
import EventSource from "react-native-sse";
import { MessageEvent } from "./stream.type";

export class StreamApi {
  private eventSource: EventSource | null = null;

  constructor() {}

  async stream(
    prompt: string,
    messageCallback: (message: MessageEvent) => void
  ) {
    // Close existing connection if any
    this.close();

    const url = `${getApiUrl("/api/stream")}?prompt=${encodeURIComponent(
      prompt
    )}`;
    this.eventSource = new EventSource(url);

    this.eventSource.addEventListener("open", () => {
      logger.info("SSE connection opened");
    });

    this.eventSource.addEventListener("message", (event) => {
      if (event.data && typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          messageCallback({
            type: data.type,
            content: data.content,
          } as MessageEvent);
        } catch (error) {
          logger.error("Failed to parse message data:", error, event.data);
        }
      }
    });

    this.eventSource.addEventListener("error", (event) => {
      if (event.type === "error") {
        logger.error("SSE connection error:", event.message);
      } else if (event.type === "exception") {
        logger.error("SSE exception:", event.message, event.error);
      }
      this.close();
    });

    this.eventSource.addEventListener("close", () => {
      logger.info("SSE connection closed by server");
      this.eventSource = null;
      this.close();
    });
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      logger.info("SSE connection closed");
    }
  }
}
