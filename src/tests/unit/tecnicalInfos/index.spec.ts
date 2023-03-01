import * as technicalInfo from "../../../cemigParse/technicalInfos";
import * as utils from "../../../cemigParse/utils";


describe("technicalInfo unit tests", () => {
  beforeEach(jest.clearAllMocks);
  
    it("should return object with field invoiced and coordinates", () => {
        const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
        getHolderDataSpy.mockReturnValueOnce("API222068552");
        getHolderDataSpy.mockReturnValueOnce("2.002");
        getHolderDataSpy.mockReturnValueOnce("2.449");
        getHolderDataSpy.mockReturnValueOnce("1");
        getHolderDataSpy.mockReturnValueOnce("447");

      const response = technicalInfo.getTechnicalInfo("page");

      expect(getHolderDataSpy).toHaveBeenCalledTimes(5);
      expect(response).toEqual({
        measurement:"API222068552",
        previousReading:2002,
        currentReading:2449,
        constantReading:1,
        consumptionReading:447,
      });
      getHolderDataSpy.mockRestore();
    });
});
