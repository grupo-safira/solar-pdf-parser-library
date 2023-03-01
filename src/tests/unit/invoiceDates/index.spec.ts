import * as invoiceDates from "../../../cemigParse/invoiceDates";
import * as jsonPath from "jsonpath";
import * as utils from "../../../cemigParse/utils";

jest.mock("jsonpath", () => {
  return {
    query: jest.fn(),
  };
});

describe("invoiceDates unit tests", () => {
  beforeEach(jest.clearAllMocks);
  describe("getEmissionDate", () => {
    it("should return emission date and test ordination data", () => {
      const jsonPathSpy = jest.spyOn(jsonPath, "query");
      jsonPathSpy.mockReturnValue([
        { y: 12.3, R: [{ T: "   foo   " }] },
        { y: 12.1, R: [{ T: "   foo2   " }] },
        { y: 12.1, R: [{ T: "   foo3   " }] },
        { y: 12.2, R: [{ T: "   DATA DE EMISSÃO: 12/11/2021   " }] },
      ]);

      const response = invoiceDates.getEmissionDate("page", 0, 0, 0, 0);

      expect(jsonPathSpy).toHaveBeenCalled();
      expect(response).toEqual("12/11/2021");
    });
  });
  describe("getNextRead", () => {
    it("should return next read date", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      const getEmissionDateSpy = jest.spyOn(invoiceDates, "getEmissionDate");
      const nextReadTreatmentSpy = jest.spyOn(
        invoiceDates,
        "nextReadTreatment"
      );
      getHolderDataSpy.mockReturnValue("11/02");
      getEmissionDateSpy.mockReturnValue("11/01/2021");
      nextReadTreatmentSpy.mockReturnValue(new Date(2021, 2 - 1, 11));

      const response = invoiceDates.getNextRead("page");

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(getEmissionDateSpy).toHaveBeenCalled();
      expect(nextReadTreatmentSpy).toHaveBeenCalled();
      expect(response).toEqual(new Date(2021, 2 - 1, 11));
      nextReadTreatmentSpy.mockRestore();
    });
  });
  describe("nextReadTreatment", () => {
    it("should return treated next read date", () => {
      const response = invoiceDates.nextReadTreatment("11/02", "11/01/2021");

      expect(response).toEqual(new Date(2021, 2 - 1, 11));
    });
    it("should return treated next read date when next read in next year", () => {
      const response = invoiceDates.nextReadTreatment("11/01", "11/12/2021");

      expect(response).toEqual(new Date(2022, 1 - 1, 11));
    });
  });
  describe("getDueDate", () => {
    it("should return due date", () => {
      const jsonPathSpy = jest.spyOn(jsonPath, "query");
      const dateTreatmentSpy = jest.spyOn(invoiceDates, "dateTreatment");
      dateTreatmentSpy.mockReturnValue(new Date(2022, 12 - 1, 17))
      jsonPathSpy.mockReturnValue([
        {
          y: 12.3,
          R: [
            {
              T: "%20%20%20%20%20%20%20%20%20Referente%20a%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20Vencimento%20",
            },
          ],
        },
        {
          y: 12.1,
          R: [
            {
              T: "%20%20%20%20NOV%2F2022%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2017%2F12%2F2022%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20172%2C87%20",
            },
          ],
        },
      ]);
      const response = invoiceDates.getDueDate("page");

      expect(response).toEqual(new Date(2022, 12 - 1, 17));
      dateTreatmentSpy.mockRestore()
    });
  });
  describe("dateTreatment", () => {
    it("should return treated date", () => {
      expect(invoiceDates.dateTreatment('11/11/2011')).toEqual(new Date(2011, 11-1, 11))
    });
  });
});
