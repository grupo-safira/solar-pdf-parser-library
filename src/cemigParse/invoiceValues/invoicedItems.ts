import { getHolderData } from "../index";
import * as jsonPath from "jsonpath";
import { IItemEnergia, TFileToParse } from "models/cemigParse.model";
import * as queryString from "querystring";

function getItensFaturados(
  page: TFileToParse
): Array<{ field: string; x: number; y: number }> {
  let x = jsonPath.query(
    page,
    `$..[?(@.y >= 14.5 && @.y <= 26 && @.x >= 1 && @.x <= 2)]`
  );
  let arrDados = x.map((e: any) => {
    return {
      field: queryString.unescape(e.R[0].T).trim(),
      x: e.x,
      y: e.y,
    };
  });
  return arrDados;
}

export function getInvoicedItems(page: TFileToParse) {
  //TODO: find a more performant and less coupled way for this type of search
  let invoicedItems = getItensFaturados(page);
  let energyDistributorItems: IItemEnergia[] = [];
  let compensatedEnergyItems: IItemEnergia[] = [];
  let injectedEnergyItems: IItemEnergia[] = [];
  let availabilityCostItems: IItemEnergia[] = [];
  const invoicedItemsUnitTariff = getInvoicedItemsUnitTariff(
    invoicedItems,
    page
  );
  const invoicedItemsValue = getInvoicedItemsValue(invoicedItems, page);
  const invoicedItemsUnit = getInvoicedItemsUnit(invoicedItems, page);
  const invoicedItemsQuant = getInvoicedItemsQuantity(invoicedItems, page);
  const invoicedItemsUnitPrice = getInvoicedItemsUnitPrice(invoicedItems, page);

  for (let i = 0; i < invoicedItems.length; i++) {
    const energyDefaultValues: IItemEnergia = {
      value: parseFloat(invoicedItemsValue[i]),
      description: invoicedItems[i].field,
      unitMeasurement: invoicedItemsUnit[i],
      quantity: parseInt(invoicedItemsQuant[i].replace(".", ""), 10),
      unitPrice: parseFloat(invoicedItemsUnitPrice[i]),
    };
    switch (invoicedItems[i].field.toUpperCase()) {
      case "TOTAL":
        continue;

      case "ENERGIA ELÉTRICA":
        const energy = {
          ...energyDefaultValues,
          unitPrice: parseFloat(invoicedItemsUnitPrice[i])
            ? parseFloat(invoicedItemsUnitPrice[i])
            : 0,
        };
        energyDistributorItems.push(energy);
        continue;

      case "EN COMP.":
        compensatedEnergyItems.push(energyDefaultValues);
        continue;

      case "ENERGIA INJETADA":
        injectedEnergyItems.push(energyDefaultValues);
        continue;

      case "CUSTO DE DISPONIBILIDADE":
        availabilityCostItems.push({
          ...energyDefaultValues,
          unitMeasurement: "",
          quantity: 0,
          unitPrice: 0,
        });
        continue;

      default:
        break;
    }
  }
  return {
    invoicedItems,
    invoicedItemsUnit,
    invoicedItemsValue,
    energyDistributorItems,
    compensatedEnergyItems,
    injectedEnergyItems,
    availabilityCostItems,
    invoicedItemsUnitTariff,
  };
}

function getInvoicedItemsUnit(invoicedItems: any, page: TFileToParse) {
  let unitInvoicedItems = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 10, 11, i.y - 0.3, i.y + 0.3);
    unitInvoicedItems.push(fieldValue);
  }
  return unitInvoicedItems;
}
function getInvoicedItemsQuantity(invoicedItems: any, page: TFileToParse) {
  let invoicedItemsQuant = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 12, 13, i.y - 0.3, i.y + 0.3);
    invoicedItemsQuant.push(fieldValue);
  }
  return invoicedItemsQuant;
}
function getInvoicedItemsUnitPrice(invoicedItems: any, page: TFileToParse) {
  let invoicedItemsUnitPrice = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 15, 16, i.y - 0.3, i.y + 0.3);
    invoicedItemsUnitPrice.push(fieldValue.replace(".", "").replace(",", "."));
  }
  return invoicedItemsUnitPrice;
}
function getInvoicedItemsValue(invoicedItems: any, page: TFileToParse) {
  let invoicedItemsValue = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 18, 20, i.y - 0.3, i.y + 0.3);
    invoicedItemsValue.push(fieldValue.replace(".", "").replace(",", "."));
  }
  return invoicedItemsValue;
}
function getInvoicedItemsUnitTariff(invoicedItems: any, page: TFileToParse) {
  let invoicedItemsUnitTariff = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 32, 33, i.y - 0.3, i.y + 0.3);
    invoicedItemsUnitTariff.push(fieldValue);
  }
  return invoicedItemsUnitTariff;
}
