import { getHolderDocument, getHolderName } from "../../../cemigParse/userInfo";
import * as utils from "../../../cemigParse/utils";
describe("userInfo ", () => {
  beforeEach(jest.clearAllMocks)
  describe("getHolderName", () => {
    it("should return holder name", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockImplementationOnce(() => {
        return "Gustav Test";
      });
      const name = getHolderName("page");

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(name).toEqual("Gustav Test");
    });
  });

  describe("getHolderDocument", () => {
    it("should return formatted holder document", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockImplementationOnce(() => {
        return "CPF 111-111-111-23";
      });
      const cpf = getHolderDocument("page");

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(cpf).toEqual("11111111123");
    });
  });
});
