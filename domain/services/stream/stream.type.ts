/**
 * Content types that can be displayed in collapsible sections
 */
export type ContentType = "<guideline>" | "<drug>" | "<think>" | "TEXT";

/**
 * Data structure for message content items
 */
export type DataType = {
  id: number;
  type: ContentType;
  content: string;
  collapsed: boolean;
};

/**
 * Search step information
 */
export type SearchStep = {
  text: string;
  isCompleted?: boolean;
  isActive?: boolean;
  info?: string;
};

/**
 * Search progress result from API
 */
export type SearchProgressResult = {
  title: string;
  journal: string;
  year: string;
  is_guideline: string;
  publication_types: string[];
  content: string;
};

/**
 * Loading state for the stream service
 */
export type LoadingState = "STREAMING" | "LOADING" | "ERROR" | "SUCCESS";

/**
 * Parsed message type result
 */
export type ParsedMessageType =
  | { type: "STREAM"; content: string }
  | { type: "SEARCH_STEPS"; content: SearchStep[] }
  | { type: "SEARCH_PROGRESS"; content: SearchProgressResult[] }
  | { type: "ERROR"; content: string };

/**
 * Node chunk content for SEARCH_STEPS
 */
export type SearchStepsNodeContent = {
  nodeName: "SEARCH_STEPS";
  content: Array<{
    text: string;
    isCompleted?: boolean;
    isActive?: boolean;
    info?: string;
  }>;
};

/**
 * Node chunk content for SEARCH_PROGRESS
 */
export type SearchProgressNodeContent = {
  nodeName: "SEARCH_PROGRESS";
  content: {
    category: string;
    total: number;
    results: Array<{
      title: string;
      journal: string;
      year: string;
      is_guideline: string;
      publication_types: string[];
      content: string;
    }>;
  };
};

/**
 * Discriminated union for NodeChunk content
 */
export type NodeChunkContent =
  | SearchStepsNodeContent
  | SearchProgressNodeContent;

/**
 * Stream message with string content
 */
export type StreamMessageEvent = {
  type: "STREAM";
  content: string;
};

/**
 * Node chunk message with structured content
 */
export type NodeChunkMessageEvent = {
  type: "NodeChunk";
  content: NodeChunkContent;
};

/**
 * Discriminated union for all message event types
 */
export type MessageEvent = StreamMessageEvent | NodeChunkMessageEvent;
