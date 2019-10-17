import {defineFeature, loadFeature} from "jest-cucumber";
import supertest from "supertest";
import path from "path";

const url = "http://localhost:3006/";
const request = supertest(url);

import mockData from "../../resources/evl-test-certificates.json";
import * as _ from "lodash";

const feature = loadFeature(path.resolve(__dirname, "../8179.ACs.feature"));

defineFeature(feature, (test) => {
  test("AC1.1 Fetch all valid test certificates for today", ({given, when, then, and}) => {
    let requestUrl: string;
    let response: any;
    let expectedResponse: any;
    given("I am an API Consumer", () => {
      requestUrl = "evl-test-certificates";
    });
    when("I send a GET request to AWS_CVS_DOMAIN/evl-test-certificates", async () => {
      response = await request.get(requestUrl);
    });
    then("the the system returns array of EvlTestCertificate stub data for today", () => {
      expectedResponse = _.cloneDeep(mockData);
      expect(expectedResponse).toEqual(response.body);
    });
    and("the system returns an HTTP status code 200 OK", () => {
      expect(response.status).toEqual(200);
    });
  });
});
