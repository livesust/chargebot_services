import { StackContext, Config } from "sst/constructs";

export function TimescaleStack({ stack }: StackContext) {

  // TimescaleDB Secret Keys
  const TIMESCALE_HOST = new Config.Secret(stack, "TIMESCALE_HOST");
  const TIMESCALE_USER = new Config.Secret(stack, "TIMESCALE_USER");
  const TIMESCALE_PASSWORD = new Config.Secret(stack, "TIMESCALE_PASSWORD");
  const TIMESCALE_PORT = new Config.Secret(stack, "TIMESCALE_PORT");
  const TIMESCALE_DATABASE = new Config.Secret(stack, "TIMESCALE_DATABASE");

  return {
    timescaleConfigs: {
      TIMESCALE_HOST,
      TIMESCALE_USER,
      TIMESCALE_PASSWORD,
      TIMESCALE_PORT,
      TIMESCALE_DATABASE
    }
  };
}
