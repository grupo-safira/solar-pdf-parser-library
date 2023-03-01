import * as utils from "../../../cemigParse/utils"
import * as jsonPath from "jsonpath";

jest.mock("jsonpath", () => {
    return {
      query: jest.fn(),
    };
  });

describe('utils unit tests', ()=>{
    beforeEach(jest.clearAllMocks)
      describe("getColumn", () => {
        it("should return all data of specified column", () => {
          const jsonPathSpy = jest.spyOn(jsonPath, "query")
          jsonPathSpy.mockImplementationOnce(()=>  {return [{ R: [{ T: "   JAN/23   " }] }]})
      
          const response = utils.getColumn("page", 0,0,0,0);
      
          expect(jsonPathSpy).toHaveBeenCalled();
          expect(response).toEqual(["JAN/23"]);
        });
        it("should return empty array and return message when not found column data", () => {
          const jsonPathSpy = jest.spyOn(jsonPath, "query")
          const consoleErrorSpy = jest.spyOn(console, "error")
          jsonPathSpy.mockImplementationOnce(()=>  {return []})
      
          const response = utils.getColumn("page", 0,0,0,0);
      
          expect(jsonPathSpy).toHaveBeenCalled();
          expect(consoleErrorSpy).toHaveBeenCalled();
          expect(consoleErrorSpy).toBeCalledWith(`Houve um erro ao realizar o parse da coluna com as seguintes coordenadas 0, 0, 0, 0`);
          expect(response).toEqual([]);
        });
      });
      describe("getHolderData", () => {
        it("should return empty array and return message when not found column data", () => {
          const jsonPathSpy = jest.spyOn(jsonPath, "query")
          jsonPathSpy.mockImplementationOnce(()=>  {return []})
      
          const response = utils.getHolderData("page", 0,0,0,0);
      
          expect(jsonPathSpy).toHaveBeenCalled();
          expect(response).toEqual("");
        });
        it("should return concated values when result is greater than two", () => {
          const jsonPathSpy = jest.spyOn(jsonPath, "query")
          jsonPathSpy.mockImplementationOnce(()=>  {return [{ R: [{ T: "Subclasse" }] }, { R: [{ T: "duas" }] }, { R: [{ T: "linhas" }] }]})
      
          const response = utils.getHolderData("page", 0,0,0,0);
      
          expect(jsonPathSpy).toHaveBeenCalled();
          expect(response).toEqual(`duas linhas`);
        });
        it("should return value when set default user", () => {
          const jsonPathSpy = jest.spyOn(jsonPath, "query")
          jsonPathSpy.mockImplementationOnce(()=>  {return [{ R: [{ T: "Subclasse" }] }]})
      
          const response = utils.getHolderData("page", 0,0,0,0);
      
          expect(jsonPathSpy).toHaveBeenCalled();
          expect(response).toEqual(`Subclasse`);
        });
        it("should return value when set default user", () => {
          const jsonPathSpy = jest.spyOn(jsonPath, "query")
          jsonPathSpy.mockImplementationOnce(()=>  {return [{ R: [{ T: "Subclasse" }] }, { R: [{ T: "classe" }] }]})
      
          const response = utils.getHolderData("page", 0,0,0,0, 1);
      
          expect(jsonPathSpy).toHaveBeenCalled();
          expect(response).toEqual(`classe`);
        });
      });
    })
    