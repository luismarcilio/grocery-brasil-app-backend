import { loggerLevel, withLog } from "../../../core/Logging";
import { MinifierAdapter } from "./MinifierAdapter";


export class MinifierAdapterBypass implements MinifierAdapter {
  @withLog(loggerLevel.DEBUG)
  minify(javascript: string): Promise<string> {
    return Promise.resolve(javascript);
  }

}
