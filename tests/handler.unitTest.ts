import { handler } from "../src/handler";
import {Configuration} from "../src/utils/Configuration";
import {HTTPResponse} from "../src/models/HTTPResponse";
import mockContext from "aws-lambda-mock-context";
import {EvlTestCertificatesService} from "../src/services/EvlTestCertificatesService";
jest.mock("../src/services/EvlTestCertificatesService");
const opts = Object.assign({
    timeout: 0.2
});

describe("The lambda function handler", () => {
    context("With correct Config", () => {
        context("should correctly handle incoming events", () => {
            it("should call functions with correct event payload", async () => {
                // Specify your event, with correct path, payload etc
                const lecTestResultsEvent = {
                    path: "/evl-test-certificates",
                    pathParameters: null,
                    resource: "/evl-test-certificates",
                    httpMethod: "GET",
                    queryStringParameters: null
                };

                const ctx: any = mockContext(opts);
                const clbck: any  = mockContext();

                // Stub out the actual functions
                EvlTestCertificatesService.prototype.getEvlTestCertificates = jest.fn().mockImplementation(() => {
                    return Promise.resolve(new HTTPResponse(200, {}));
                });

                const result = await handler(lecTestResultsEvent, ctx, clbck);
                ctx.succeed(result);
                expect(result.statusCode).toEqual(200);
                expect(EvlTestCertificatesService.prototype.getEvlTestCertificates).toHaveBeenCalled();
            });

            it("should return error on empty event", async () => {
                let ctx: any = mockContext(opts);
                const clbck: any  = mockContext();

                const result = await handler(null, ctx, clbck);
                ctx.succeed(result);
                ctx = null;

                expect(result).toBeInstanceOf(HTTPResponse);
                expect(result.statusCode).toEqual(400);
                expect(result.body).toEqual(JSON.stringify("AWS event is empty. Check your test event."));
            });
        });
    });

    context("With no routes defined in config", () => {
        it("should return a Route Not Found error", async () => {

            const getFunctions = Configuration.prototype.getFunctions;
            Configuration.prototype.getFunctions = jest.fn().mockImplementation(() => []);
            const eventNoRoute = { httpMethod: "GET", path: "" };
            let ctx: any = mockContext(opts);
            const clbck: any  = mockContext();
            const result = await handler(eventNoRoute, ctx, clbck);
            ctx.succeed(result);
            ctx = null;
            expect(result.statusCode).toEqual(400);
            expect(result.body).toEqual(JSON.stringify({ error: `Route ${eventNoRoute.httpMethod} ${eventNoRoute.path} was not found.` }));
            Configuration.prototype.getFunctions = getFunctions;
        });
    });
});
