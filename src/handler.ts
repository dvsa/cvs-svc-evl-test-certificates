import Path from "path-parser";
import {Configuration} from "./utils/Configuration";
import {HTTPResponse} from "./models/HTTPResponse";
import { Context, APIGatewayProxyResult, Callback } from "aws-lambda";
import {IFunctions, IFunctionEvent} from "../@Types/Configuration";
import { HTTPRESPONSE } from "./assets/Enums";

const handler = async (event: any, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {
  // Request integrity checks
  if (!event) {
    return new HTTPResponse(400, HTTPRESPONSE.AWS_EVENT_EMPTY);
  }

  if (event.body) {
    let payload = {};

    try {
      payload = JSON.parse(event.body);
    } catch (e) {
      return new HTTPResponse(400, HTTPRESPONSE.NOT_VALID_JSON);
    }

    Object.assign(event, { body: payload });
  }

  // Finding an appropriate λ matching the request
  const config: Configuration = Configuration.getInstance();
  const functions: IFunctionEvent[] = config.getFunctions();
  const serverlessConfig = config.getConfig().serverless;

  const matchingLambdaEvents = functions.filter((fn: IFunctionEvent) => {
    // Find λ with matching httpMethod
    return event.httpMethod === fn.method;
  })
    .filter((fn: IFunctionEvent) => {
      // Find λ with matching path
      const localPath = new Path(fn.path)
      const remotePath = new Path(`${serverlessConfig.basePath}${fn.path}`); // Remote paths also have environment

      return (localPath.test(event.path) || remotePath.test(event.path));
    })

  // Exactly one λ should match the above filtering.
  if (matchingLambdaEvents.length === 1) {
    const lambdaEvent = matchingLambdaEvents[0];
    const lambdaFn = lambdaEvent.function;

    const localPath = new Path(lambdaEvent.path);
    const remotePath = new Path(`${serverlessConfig.basePath}${lambdaEvent.path}`); // Remote paths also have environment

    const lambdaPathParams = (localPath.test(event.path) || remotePath.test(event.path));

    Object.assign(event, { pathParameters: lambdaPathParams });

    console.log(`HTTP ${event.httpMethod} ${event.path} -> λ ${lambdaEvent.name}`);

    // Explicit conversion because typescript can't figure it out
    return lambdaFn(event, context, callback);
  }

  // If filtering results in less or more λ functions than expected, we return an error.
  console.error(`Error: Route ${event.httpMethod} ${event.path} was not found.
    Dumping event:
    ${JSON.stringify(event)}
    Dumping context:
    ${JSON.stringify(context)}`);

  return new HTTPResponse(400, { error: `Route ${event.httpMethod} ${event.path} was not found.` })
}

export {handler};
