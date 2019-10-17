import {Configuration} from "../src/utils/Configuration";

describe("The configuration service", () => {
    context("with good config file", () => {
      it("should return local versions of the config if specified", () => {
        process.env.BRANCH = "local";
        const configService = Configuration.getInstance();
        const functions = configService.getFunctions();
        expect(functions.length).toEqual(1);
        expect(functions[0].name).toEqual("getEvlTestCertificates");

        // No Endpoints for this service
      });

      it("should return local-global versions of the config if specified", () => {
        process.env.BRANCH = "local-global";
        const configService = Configuration.getInstance();
        const functions = configService.getFunctions();
        expect(functions.length).toEqual(1);
        expect(functions[0].name).toEqual("getEvlTestCertificates");
        // No Endpoints for this service
      });

      it("should return remote versions of the config by default", () => {
        process.env.BRANCH = "CVSB-XXX";
        const configService = Configuration.getInstance();
        const functions = configService.getFunctions();
        expect(functions.length).toEqual(1);
        expect(functions[0].name).toEqual("getEvlTestCertificates");

        // No Endpoints for this service
      });
    });

    context("with bad config file", () => {
      it("should return an error for missing functions from getFunctions", () => {
        const config = new Configuration("../../tests/resources/badConfig.yml");
        try {
          config.getFunctions();
        } catch (e) {
          expect(e.message).toEqual("Functions were not defined in the config file.");
        }
      });
    });
  });
