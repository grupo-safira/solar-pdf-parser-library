import * as consumptionHistory from "../../../cemigParse/consumptionHistory";
import * as utils from "../../../cemigParse/utils";

describe("consumerUnitInfo", () => {
  beforeEach(jest.clearAllMocks);

  describe("getMonthHistory", () => {
    it("should return month history", () => {
      const getColumnSpy = jest.spyOn(utils, "getColumn");
      getColumnSpy.mockImplementationOnce(() => {
        return ["JAN/23"];
      });

      const response = consumptionHistory.getMonthHistory("page");

      expect(getColumnSpy).toHaveBeenCalled();
      expect(response).toEqual(["JAN/23"]);
    });
  });

  describe("getConsumptionHistory", () => {
    it("should return all consumption history", () => {
      const getColumnSpy = jest.spyOn(utils, "getColumn");
      getColumnSpy.mockImplementationOnce(() => {
        return ["JAN/23"];
      });

      const response = consumptionHistory.getConsumptionHistory("page");

      expect(getColumnSpy).toHaveBeenCalled();
      expect(response).toEqual(["JAN/23"]);
    });
  });

  describe("getDaysHistory", () => {
    it("should return all days history", () => {
      const getColumnSpy = jest.spyOn(utils, "getColumn");
      getColumnSpy.mockImplementationOnce(() => {
        return ["JAN/23"];
      });

      const response = consumptionHistory.getDaysHistory("page");

      expect(getColumnSpy).toHaveBeenCalled();
      expect(response).toEqual(["JAN/23"]);
    });
  });
  describe("makeHistoryData", () => {
    it("should return array of objects with all data: (month, consumption and history)", () => {
      const expectedMonth = [
        "DEZ/22",
        "JAN/23",
        "FEV/23",
        "MAR/23",
        "ABR/23",
        "MAI/23",
        "JUN/23",
        "JUL/23",
        "AGO/23",
        "SET/23",
        "OUT/23",
        "NOV/23",
        "DEZ/23",
      ];
      const expectedConsumption = [
        "100",
        "11",
        "1.111",
        "123",
        "123",
        "123",
        "123",
        "123",
        "123",
        "123",
        "123",
        "123",
        "123",
      ];
      const expectedDays = [
        "23",
        "27",
        "28",
        "30",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
      ];
      const getMonthHistorySpy = jest.spyOn(
        consumptionHistory,
        "getMonthHistory"
      );
      const getConsumptionHistorySpy = jest.spyOn(
        consumptionHistory,
        "getConsumptionHistory"
      );
      const getDaysHistorySpy = jest.spyOn(
        consumptionHistory,
        "getDaysHistory"
      );
      const makeExpectedHistory = () => {
        let historyArray = [];
        for (let index = 0; index <= 12; index++) {
          const hist = {
            monthAndYear: expectedMonth[index],
            consumption: Number(expectedConsumption[index].replace(".", "")),
            days: expectedDays[index],
          };
          historyArray.push(hist);
        }
        return historyArray;
      };

      getMonthHistorySpy.mockReturnValue(expectedMonth);
      getConsumptionHistorySpy.mockReturnValue(expectedConsumption);
      getDaysHistorySpy.mockReturnValue(expectedDays);

      const response = consumptionHistory.makeHistoryData("page");

      expect(getMonthHistorySpy).toHaveBeenCalledWith("page");
      expect(getConsumptionHistorySpy).toHaveBeenCalledWith("page");
      expect(getDaysHistorySpy).toHaveBeenCalledWith("page");
      expect(response).toStrictEqual(makeExpectedHistory());
    });
    it("should return empty array when failed to get all history", () => {
      const expectedMonth: string[] = [];
      const expectedConsumption: string[] = [];
      const expectedDays: string[] = [];
      const getMonthHistorySpy = jest.spyOn(
        consumptionHistory,
        "getMonthHistory"
      );
      const getConsumptionHistorySpy = jest.spyOn(
        consumptionHistory,
        "getConsumptionHistory"
      );
      const getDaysHistorySpy = jest.spyOn(
        consumptionHistory,
        "getDaysHistory"
      );

      getMonthHistorySpy.mockReturnValue(expectedMonth);
      getConsumptionHistorySpy.mockReturnValue(expectedConsumption);
      getDaysHistorySpy.mockReturnValue(expectedDays);

      const response = consumptionHistory.makeHistoryData("page");

      expect(getMonthHistorySpy).toHaveBeenCalledWith("page");
      expect(getConsumptionHistorySpy).toHaveBeenCalledWith("page");
      expect(getDaysHistorySpy).toHaveBeenCalledWith("page");
      expect(response).toStrictEqual([]);
    });
  });
});
