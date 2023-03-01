import * as consumerUnitInfo from "../../../cemigParse/consumerUnitInfo";
import * as jsonPath from "jsonpath";
import * as utils from "../../../cemigParse/utils"
jest.mock("jsonpath", () => {
  return {
    query: jest.fn(),
  };
});

describe('consumerUnitInfo', ()=>{
beforeEach(jest.clearAllMocks)
  describe("getAddress", () => {
    it("should return address formatted with no spaces", () => {
      const getPdfInfoSpy = jest.spyOn(jsonPath, "query");
      getPdfInfoSpy.mockReturnValue([{ R: [{ T: "   address   " }] }]);
  
      const response = consumerUnitInfo.getAddress("page", 1, 2, 3, 4);
  
      expect(getPdfInfoSpy).toHaveBeenCalled();
      expect(response).toEqual("address");
    });
  });
  
  describe("getAllAddress", () => {
    it("should return full address and call getAddress three times", () => {
      const expectedReturn = {
        street:'street example',
         aux: 'aux example',
         district: 'district example'
      }
      const getAddressSpy = jest.spyOn(consumerUnitInfo, "getAddress")
      getAddressSpy.mockImplementationOnce(()=>  {return expectedReturn.street});
      getAddressSpy.mockImplementationOnce(()=> {return expectedReturn.aux});
      getAddressSpy.mockImplementationOnce(()=> {return expectedReturn.district});
  
      const response = consumerUnitInfo.getAllAddress("page");
  
      expect(getAddressSpy).toHaveBeenCalledTimes(3);
      expect(response).toEqual(expectedReturn);
    });
  });
  describe("getInstallationNumber", () => {
    it("should return installation number", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData")
      getHolderDataSpy.mockImplementationOnce(()=>  {return '1234567891'});
  
      const response = consumerUnitInfo.getInstallationNumber("page");
  
      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual('1234567891');
    });
  });

  describe("getSubClass", () => {
    it("should return subclass data", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData")
      getHolderDataSpy.mockImplementationOnce(()=>  {return 'Residencial'})
  
      const response = consumerUnitInfo.getSubClass("page");
  
      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual("Residencial");
    });
    it("should return undefined subclass data", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData")
      getHolderDataSpy.mockImplementationOnce(()=>  {return ''})
  
      const response = consumerUnitInfo.getSubClass("page");
  
      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual("");
    });
  });

  describe("getClass", () => {
    it("should return class of installation number", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData")
      getHolderDataSpy.mockImplementationOnce(()=>  {return 'Monofásico'});
  
      const response = consumerUnitInfo.getClass("page");
  
      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual('Monofásico');
    });
  });
})
