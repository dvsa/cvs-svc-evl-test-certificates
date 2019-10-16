// @ts-ignore
import yml from "node-yaml";
import {IFunctions, IParams} from "../../@Types/Configuration";
import {ERRORS} from "../assets/Enums";

class Configuration {
  private static instance: Configuration;
  private readonly config: any;

  constructor(configPath: string) {
    if (!process.env.BRANCH) {throw new Error(ERRORS.NoBranch); }

    const configFile = yml.readSync(configPath);

    // Replace environment variable references
    let stringifiedConfig: string = JSON.stringify(configFile);
    const envRegex: RegExp = /\${(\w+\b):?(\w+\b)?}/g;
    const matches: RegExpMatchArray | null = stringifiedConfig.match(envRegex);

    if (matches) {
      matches.forEach((match: string) => {
        envRegex.lastIndex = 0;
        const captureGroups: RegExpExecArray = envRegex.exec(match) as RegExpExecArray;

        // Insert the environment variable if available. If not, insert placeholder. If no placeholder, leave it as is.
        stringifiedConfig = stringifiedConfig.replace(match, (process.env[captureGroups[1]] || captureGroups[2] || captureGroups[1]));
      });
    }
    this.config = JSON.parse(stringifiedConfig);
  }

  /**
   * Retrieves the singleton instance of Configuration
   * @returns Configuration
   */
  public static getInstance(): Configuration {
    if (!this.instance) {
      this.instance = new Configuration("../config/config.yml");
    }

    return Configuration.instance;
  }

  /**
   * Retrieves the entire config as an object
   * @returns any
   */
  public getConfig() {
    return this.config;
  }

  /**
   * Retrieves the lambda functions declared in the config
   * @returns IFunctionEvent[]
   */
  public getFunctions() {
    if (!this.config.functions) {
      throw new Error("Functions were not defined in the config file.");
    }

    return this.config.functions.map((fn: IFunctions) => {
      const [name, params]: [string, IParams] = Object.entries(fn)[0];
      const path = (params.proxy) ? params.path.replace("{+proxy}", params.proxy) : params.path;

      return {
        name,
        method: params.method.toUpperCase(),
        path,
        function: require(`../functions/${params.function}`)[name]
      };
    });
  }

}

export  {Configuration};