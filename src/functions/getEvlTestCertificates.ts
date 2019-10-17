import {EvlTestCertificatesDAO} from "../models/EvlTestCertificatesDAO";
import {EvlTestCertificatesService} from "../services/EvlTestCertificatesService";
import { HTTPResponse } from "../models/HTTPResponse";

export const getEvlTestCertificates = () => {
  const evlTestCertificatesDAO = new EvlTestCertificatesDAO();
  const evlTestCertificatesService = new EvlTestCertificatesService(evlTestCertificatesDAO);

  return evlTestCertificatesService.getEvlTestCertificates().then((data) => {
      return new HTTPResponse(200, data);
    }).catch((error: any) => {
      return new HTTPResponse(error.statusCode, error.body);
    });

};
