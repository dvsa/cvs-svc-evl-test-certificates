import { expect } from "chai";
import {EvlTestCertificatesService} from "../src/services/EvlTestCertificatesService";
import fs from "fs";
import path from "path";
import { IEvlTestCertificate } from "../@Types/IEvlTestCertificate";

describe("getEvlTestCertificates", () => {
  let evlTestCertificatesService: EvlTestCertificatesService | any;
  let MockTestResultsDAO: jest.Mock;
  let evlTestCertificatesMockDB: any;
  beforeEach(() => {
    evlTestCertificatesMockDB = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./resources/evl-test-certificates.json"), "utf8"));
    MockTestResultsDAO = jest.fn().mockImplementation(() => {
      return {};
    });
    evlTestCertificatesService = new EvlTestCertificatesService(new MockTestResultsDAO());
  });
  afterEach(() => {
    evlTestCertificatesMockDB = null;
    evlTestCertificatesService = null;
    MockTestResultsDAO.mockReset();
  });

  context("when records are found", () => {
    it("should return a populated response and status code 200", async () => {
      MockTestResultsDAO = jest.fn().mockImplementation(() => {
        return {
          getEvlTestCertificates: () => {
            return Promise.resolve(evlTestCertificatesMockDB);
          }
        };
      });

      evlTestCertificatesService = new EvlTestCertificatesService(new MockTestResultsDAO());
      const returnedRecords: IEvlTestCertificate[] = await evlTestCertificatesService.getEvlTestCertificates();
      expect(returnedRecords).to.not.equal(undefined);
      expect(returnedRecords).to.not.equal({});
      expect(JSON.stringify(returnedRecords)).to.equal(JSON.stringify(evlTestCertificatesMockDB));
    });
  });
});
