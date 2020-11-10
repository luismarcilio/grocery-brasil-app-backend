import { Logging } from "./Logging";
export interface LoggerFactory {
  getLogger(): Logging;
}
