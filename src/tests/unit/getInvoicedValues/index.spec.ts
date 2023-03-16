import * as invoicedValues from "../../../cemigParse/invoiceValues";
import * as jsonPath from "jsonpath";
import * as utils from "../../../cemigParse/utils";
jest.mock("jsonpath", () => {
  return {
    query: jest.fn(),
  };
});

describe("invoiced values unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(), jest.restoreAllMocks();
  });
  describe("getInvoicedItems", () => {
    it("should return object with field invoiced and coordinates", () => {
      const getPdfInfoSpy = jest.spyOn(jsonPath, "query");
      getPdfInfoSpy.mockReturnValue([
        { x: 12, y: 13.5, R: [{ T: "   address   " }] },
      ]);

      const response = invoicedValues.getInvoicedItems("page");

      expect(getPdfInfoSpy).toHaveBeenCalled();
      expect(response).toEqual([{ field: "address", x: 12, y: 13.5 }]);
      getPdfInfoSpy.mockRestore();
    });
  });

  describe("getAllInvoicedItems", () => {
    it("should return object with field invoiced and coordinates when have only distributor energy", () => {
      const getInvoicedItemsSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItems"
      );
      const getInvoicedItemsQuantitySpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsQuantity"
      );
      const getInvoicedItemsUnitTariffSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsUnitTariff"
      );
      const getInvoicedItemsValueSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsValue"
      );
      const getInvoicedItemsUnitSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsUnit"
      );
      const getInvoicedItemsUnitPriceSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsUnitPrice"
      );
      getInvoicedItemsSpy.mockReturnValue([
        { field: "ENERGIA ELÉTRICA", x: 12, y: 13.5 },
      ]);
      getInvoicedItemsQuantitySpy.mockReturnValue(["233", ""]);
      getInvoicedItemsValueSpy.mockReturnValue(["172.87", "172.87"]);
      getInvoicedItemsUnitSpy.mockReturnValue(["kWh", ""]);
      getInvoicedItemsUnitPriceSpy.mockReturnValue(["0.74207816", ""]);
      getInvoicedItemsUnitTariffSpy.mockReturnValue(["0,65313000", ""]);

      const response = invoicedValues.getAllInvoicedItems("page");

      expect(getInvoicedItemsUnitSpy).toHaveBeenCalled();
      expect(getInvoicedItemsUnitPriceSpy).toHaveBeenCalled();
      expect(getInvoicedItemsValueSpy).toHaveBeenCalled();
      expect(getInvoicedItemsQuantitySpy).toHaveBeenCalled();
      expect(getInvoicedItemsSpy).toHaveBeenCalled();
      expect(response).toEqual({
        availabilityCostItems: [],
        compensatedEnergyItems: [],
        energyDistributorItems: [
          {
            description: "ENERGIA ELÉTRICA",
            quantity: 233,
            unitMeasurement: "kWh",
            unitPrice: 0.74207816,
            value: 172.87,
          },
        ],
        injectedEnergyItems: [],
        invoicedItems: [
          {
            field: "ENERGIA ELÉTRICA",
            x: 12,
            y: 13.5,
          },
        ],
        invoicedItemsUnit: ["kWh", ""],
        invoicedItemsUnitTariff: ["0,65313000", ""],
        invoicedItemsValue: ["172.87", "172.87"],
      });
    });
    it("should return object with field invoiced and coordinates when have only availability cost", () => {
      const getInvoicedItemsSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItems"
      );
      const getInvoicedItemsQuantitySpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsQuantity"
      );
      const getInvoicedItemsUnitTariffSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsUnitTariff"
      );
      const getInvoicedItemsValueSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsValue"
      );
      const getInvoicedItemsUnitSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsUnit"
      );
      const getInvoicedItemsUnitPriceSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsUnitPrice"
      );
      getInvoicedItemsSpy.mockReturnValue([
        {
          field: "Custo de Disponibilidade",
          x: 1.431,
          y: 14.856,
        },
        {
          field: "Multa 2% sobre conta de 11/2022",
          x: 1.431,
          y: 15.456,
        },
        {
          field: "TOTAL",
          x: 1.431,
          y: 16.056,
        },
      ]);
      getInvoicedItemsQuantitySpy.mockReturnValue(["", "", ""]);
      getInvoicedItemsValueSpy.mockReturnValue(["22.35", "0.44", "22.79"]);
      getInvoicedItemsUnitSpy.mockReturnValue(["", "", ""]);
      getInvoicedItemsUnitPriceSpy.mockReturnValue(["", "", ""]);
      getInvoicedItemsUnitTariffSpy.mockReturnValue(["0,65313000", "", ""]);

      const response = invoicedValues.getAllInvoicedItems("page");

      expect(getInvoicedItemsUnitSpy).toHaveBeenCalled();
      expect(getInvoicedItemsUnitPriceSpy).toHaveBeenCalled();
      expect(getInvoicedItemsValueSpy).toHaveBeenCalled();
      expect(getInvoicedItemsQuantitySpy).toHaveBeenCalled();
      expect(getInvoicedItemsSpy).toHaveBeenCalled();
      expect(response).toEqual({
        availabilityCostItems: [
          {
            description: "Custo de Disponibilidade",
            quantity: 0,
            unitMeasurement: "",
            unitPrice: 0,
            value: 22.35,
          },
        ],
        compensatedEnergyItems: [],
        energyDistributorItems: [],
        injectedEnergyItems: [],
        invoicedItems: [
          { field: "Custo de Disponibilidade", x: 1.431, y: 14.856 },
          {
            field: "Multa 2% sobre conta de 11/2022",
            x: 1.431,
            y: 15.456,
          },
          {
            field: "TOTAL",
            x: 1.431,
            y: 16.056,
          },
        ],
        invoicedItemsUnit: ["", "", ""],
        invoicedItemsUnitTariff: ["0,65313000", "", ""],
        invoicedItemsValue: ["22.35", "0.44", "22.79"],
      });
      getInvoicedItemsUnitSpy.mockRestore();
      getInvoicedItemsUnitPriceSpy.mockRestore();
      getInvoicedItemsValueSpy.mockRestore();
      getInvoicedItemsQuantitySpy.mockRestore();
      getInvoicedItemsSpy.mockRestore();
    });
    it("should return object with field invoiced and coordinates when have only distributor energy", () => {
      const getInvoicedItemsSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItems"
      );
      const getInvoicedItemsQuantitySpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsQuantity"
      );
      const getInvoicedItemsUnitTariffSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsUnitTariff"
      );
      const getInvoicedItemsValueSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsValue"
      );
      const getInvoicedItemsUnitSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsUnit"
      );
      const getInvoicedItemsUnitPriceSpy = jest.spyOn(
        invoicedValues,
        "getInvoicedItemsUnitPrice"
      );
      getInvoicedItemsSpy.mockReturnValue([
        {
          field: "Energia Elétrica",
          x: 1.431,
          y: 14.856,
        },
        {
          field: "Energia injetada HFP",
          x: 1.431,
          y: 15.456,
        },
        {
          field: "En comp. s/ ICMS",
          x: 1.431,
          y: 16.056,
        },
        {
          field: "En comp. ISENTA",
          x: 1.431,
          y: 16.656,
        },
        {
          field: "Contrib Ilum Publica Municipal",
          x: 1.431,
          y: 17.256,
        },
        {
          field: "TOTAL",
          x: 1.431,
          y: 17.856,
        },
      ]);
      getInvoicedItemsQuantitySpy.mockReturnValue([
        "50",
        "221",
        "74",
        "147",
        "",
        "",
      ]);
      getInvoicedItemsValueSpy.mockReturnValue([
        "37.41",
        "-144.34",
        "50.59",
        "96.01",
        "33.87",
        "73.54",
      ]);
      getInvoicedItemsUnitSpy.mockReturnValue([
        "kWh",
        "kWh",
        "kWh",
        "kWh",
        "",
        "",
      ]);
      getInvoicedItemsUnitPriceSpy.mockReturnValue([
        "0.74860466",
        "0.65313000",
        "0.68383415",
        "0.65313000",
        "",
        "",
      ]);
      getInvoicedItemsUnitTariffSpy.mockReturnValue([
        "0,65313000",
        "0,65313000",
        "0,65313000",
        "0,65313000",
        "",
        "",
      ]);

      const response = invoicedValues.getAllInvoicedItems("page");

      expect(getInvoicedItemsUnitSpy).toHaveBeenCalled();
      expect(getInvoicedItemsUnitPriceSpy).toHaveBeenCalled();
      expect(getInvoicedItemsValueSpy).toHaveBeenCalled();
      expect(getInvoicedItemsQuantitySpy).toHaveBeenCalled();
      expect(getInvoicedItemsSpy).toHaveBeenCalled();
      expect(response).toEqual({
        availabilityCostItems: [],
        compensatedEnergyItems: [
          {
            description: "En comp. s/ ICMS",
            quantity: 74,
            unitMeasurement: "kWh",
            unitPrice: 0.68383415,
            value: 50.59,
          },
          {
            description: "En comp. ISENTA",
            quantity: 147,
            unitMeasurement: "kWh",
            unitPrice: 0.65313,
            value: 96.01,
          },
        ],
        energyDistributorItems: [
          {
            description: "Energia Elétrica",
            quantity: 50,
            unitMeasurement: "kWh",
            unitPrice: 0.74860466,
            value: 37.41,
          },
        ],
        injectedEnergyItems: [
          {
            description: "Energia injetada HFP",
            quantity: 221,
            unitMeasurement: "kWh",
            unitPrice: 0.65313,
            value: -144.34,
          },
        ],
        invoicedItems: [
          {
            field: "Energia Elétrica",
            x: 1.431,
            y: 14.856,
          },
          {
            field: "Energia injetada HFP",
            x: 1.431,
            y: 15.456,
          },
          {
            field: "En comp. s/ ICMS",
            x: 1.431,
            y: 16.056,
          },
          {
            field: "En comp. ISENTA",
            x: 1.431,
            y: 16.656,
          },
          {
            field: "Contrib Ilum Publica Municipal",
            x: 1.431,
            y: 17.256,
          },
          {
            field: "TOTAL",
            x: 1.431,
            y: 17.856,
          },
        ],
        invoicedItemsUnit: ["kWh", "kWh", "kWh", "kWh", "", ""],
        invoicedItemsUnitTariff: [
          "0,65313000",
          "0,65313000",
          "0,65313000",
          "0,65313000",
          "",
          "",
        ],
        invoicedItemsValue: [
          "37.41",
          "-144.34",
          "50.59",
          "96.01",
          "33.87",
          "73.54",
        ],
      });
      getInvoicedItemsUnitSpy.mockRestore();
      getInvoicedItemsUnitPriceSpy.mockRestore();
      getInvoicedItemsValueSpy.mockRestore();
      getInvoicedItemsQuantitySpy.mockRestore();
      getInvoicedItemsSpy.mockRestore();
      getInvoicedItemsUnitTariffSpy.mockRestore();
    });
  });
  describe("getInvoicedItemsValue", () => {
    it("should return object with field invoiced and coordinates", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockReturnValueOnce("20.000,12");
      getHolderDataSpy.mockReturnValueOnce("200");

      const response = invoicedValues.getInvoicedItemsValue(
        [
          {
            field: "Energia Elétrica",
            x: 1.431,
            y: 14.856,
          },
          {
            field: "Energia injetada HFP",
            x: 1.431,
            y: 15.456,
          },
        ],
        "page"
      );

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual(["20000.12", "200"]);
      getHolderDataSpy.mockRestore();
    });
  });
  describe("getInvoicedItemsUnitTariff", () => {
    it("should return object with field invoiced and coordinates", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockReturnValueOnce("0.7");

      const response = invoicedValues.getInvoicedItemsUnitTariff(
        [
          {
            field: "Energia Elétrica",
            x: 1.431,
            y: 14.856,
          },
        ],
        "page"
      );

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual(["0.7"]);
    });
  });
  describe("getInvoicedItemsUnit", () => {
    it("should return object with field invoiced and coordinates", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockReturnValueOnce("0.7");

      const response = invoicedValues.getInvoicedItemsUnit(
        [
          {
            field: "Energia Elétrica",
            x: 1.431,
            y: 14.856,
          },
        ],
        "page"
      );

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual(["0.7"]);
    });
  });
  describe("getInvoicedItemsQuantity", () => {
    it("should return object with field invoiced and coordinates", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockReturnValue("0.7");

      const response = invoicedValues.getInvoicedItemsQuantity(
        [
          {
            field: "Energia Elétrica",
            x: 1.431,
            y: 14.856,
          },
        ],
        "page"
      );

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual(["0.7"]);
    });
  });
  describe("getInvoicedItemsUnitPrice", () => {
    it("should return object with field invoiced and coordinates", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockReturnValue("0.7");

      const response = invoicedValues.getInvoicedItemsUnitPrice(
        [
          {
            field: "Energia Elétrica",
            x: 1.431,
            y: 14.856,
          },
        ],
        "page"
      );

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual(["07"]);
    });
  });
  describe("getAmount", () => {
    it("should return zero when not has injection", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockReturnValueOnce("1000");

      const response = invoicedValues.getAmount("page");

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual(0);
      getHolderDataSpy.mockRestore();
    });

    it("should return injection when is valid", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockReturnValueOnce("-1.000,00");

      const response = invoicedValues.getAmount("page");

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual(1000);
    });
    it("should return zero when not found amount", () => {
      const getHolderDataSpy = jest.spyOn(utils, "getHolderData");
      getHolderDataSpy.mockReturnValueOnce("");

      const response = invoicedValues.getAmount("page");

      expect(getHolderDataSpy).toHaveBeenCalled();
      expect(response).toEqual(0);
    });
  });
  describe("verifyHasInjection", () => {
    it("should return false when amount is zero (haven't energy injection)", () => {
      const getAmountSpy = jest.spyOn(invoicedValues, "getAmount");
      getAmountSpy.mockReturnValueOnce(0);

      const response = invoicedValues.verifyHasInjection("page");

      expect(getAmountSpy).toHaveBeenCalled();
      expect(response).toEqual(false);
      getAmountSpy.mockRestore();
    });
    it("should return true when amount is negative (have energy injection)", () => {
      const getAmountSpy = jest.spyOn(invoicedValues, "getAmount");
      getAmountSpy.mockReturnValueOnce(100);

      const response = invoicedValues.verifyHasInjection("page");

      expect(getAmountSpy).toHaveBeenCalled();
      expect(response).toEqual(true);
      getAmountSpy.mockRestore();
    });
  });
  describe("getTotalInvoice", () => {
    it("should return false when amount is zero (haven't energy injection)", () => {
      const jsonPathSpy = jest.spyOn(jsonPath, "query");
      jsonPathSpy.mockReturnValue([
        { x: 12, y: 13.5, R: [{ T: "   TOTAL:   " }] },
        {
          x: 12,
          y: 13.5,
          R: [
            {
              T: "%20%20%20%20JAN%2F2023%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2027%2F02%2F2023%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2018.697%2C62%20",
            },
          ],
        },
      ]);

      const response = invoicedValues.getTotalInvoice("page");

      expect(jsonPathSpy).toHaveBeenCalled();
      expect(response).toEqual(18697.62);
      jsonPathSpy.mockRestore();
    });
  });
});
