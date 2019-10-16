import fs from "fs";
import path from "path";
/* tslint:enable */

export class EvlTestCertificatesDAO {
  // tslint:disable-next-line: no-empty
  constructor() {
  }

  public getEvlTestCertificates() {
    return Promise.resolve(JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/evl-test-certificates.json"), "utf8")));
  }
}
