import { EvlTestCertificatesDAO } from "../models/EvlTestCertificatesDAO";

/**
 * Service for retrieving and creating Test Results from/into the db
 * @returns Promise
 */
export class EvlTestCertificatesService {
  public readonly evlTestCertificatesDAO: EvlTestCertificatesDAO;

  constructor(evlTestCertificatesDAO: EvlTestCertificatesDAO) {
    this.evlTestCertificatesDAO = evlTestCertificatesDAO;
  }
  public async getEvlTestCertificates() {
    return await this.evlTestCertificatesDAO.getEvlTestCertificates();
  }

}
