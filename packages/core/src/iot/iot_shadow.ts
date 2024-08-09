/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IoTShadow {
  state: {reported: any, desired: any};
  metadata: {reported: any};
  version: string;
  timestamp: number;
}
