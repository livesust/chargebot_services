export interface BotStateMetadata {
  connected: {timestamp: number};
}

export interface BotState {
  connected: string;
  cpu: string;
  memory: string;
  disk: string;
  p_memory: string;
  p_cpu: string;
  threads: number;
  open_files: number;
  open_connections: number;
}

export interface IoTShadow {
  state: {reported: BotState};
  metadata: {reported: BotStateMetadata};
  version: string;
  timestamp: number;
}
