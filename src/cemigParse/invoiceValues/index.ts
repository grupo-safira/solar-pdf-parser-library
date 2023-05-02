import { getHolderData } from "../utils/index";
import * as invoicedValuesModule from "../invoiceValues";
import * as jsonPath from "jsonpath";
import {
  IEnergyItem,
  IInvoicedItems,
  TFileToParse,
} from "../../models/cemigParse.model";
import * as queryString from "querystring";

export function getInvoicedItems(
  page: TFileToParse
): Array<{ field: string; x: number; y: number }> {
  let x = jsonPath.query(
    page,
    `$..[?(@.y >= 14.5 && @.y <= 26 && @.x >= 1 && @.x <= 2)]`
  );
  const data = x.map((e: any) => {
    return {
      field: queryString.unescape(e.R[0].T).trim(),
      x: e.x,
      y: e.y,
    };
  });
  return data;
}

export function getAllInvoicedItems(page: TFileToParse): IInvoicedItems {
  //TODO: find a more performant and less coupled way for this type of search
  let energyDistributorItems: IEnergyItem[] = [];
  let compensatedEnergyItems: IEnergyItem[] = [];
  let injectedEnergyItems: IEnergyItem[] = [];
  let availabilityCostItems: IEnergyItem[] = [];
  const invoicedItems = invoicedValuesModule.getInvoicedItems(page);
  const invoicedItemsUnitTariff =
    invoicedValuesModule.getInvoicedItemsUnitTariff(invoicedItems, page);
  const invoicedItemsValue = invoicedValuesModule.getInvoicedItemsValue(
    invoicedItems,
    page
  );
  const invoicedItemsUnit = invoicedValuesModule.getInvoicedItemsUnit(
    invoicedItems,
    page
  );
  const invoicedItemsQuant = invoicedValuesModule.getInvoicedItemsQuantity(
    invoicedItems,
    page
  );
  const invoicedItemsUnitPrice = invoicedValuesModule.getInvoicedItemsUnitPrice(
    invoicedItems,
    page
  );

  for (let i = 0; i < invoicedItems.length; i++) {
    const energyDefaultValues: IEnergyItem = {
      value: parseFloat(invoicedItemsValue[i]),
      description: invoicedItems[i].field,
      unitMeasurement: invoicedItemsUnit[i],
      quantity: parseInt(invoicedItemsQuant[i].replace(".", ""), 10),
      unitPrice: parseFloat(invoicedItemsUnitPrice[i]) || 0,
    };
    const invoiceItem = invoicedItems[i].field.toUpperCase();
    switch (true) {
      case invoiceItem === "TOTAL":
        continue;

      case invoiceItem === "ENERGIA ELÉTRICA":
        const energy = {
          ...energyDefaultValues,
          unitPrice: parseFloat(invoicedItemsUnitPrice[i])
            ? parseFloat(invoicedItemsUnitPrice[i])
            : 0,
        };
        energyDistributorItems.push(energy);
        continue;

      case invoiceItem === "EN COMP. S/ ICMS" ||
        invoiceItem === "EN COMP. ISENTA":
        compensatedEnergyItems.push(energyDefaultValues);
        continue;

      case invoiceItem === "ENERGIA INJETADA HFP":
        injectedEnergyItems.push(energyDefaultValues);
        continue;

      case invoiceItem === "CUSTO DE DISPONIBILIDADE":
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

export function getInvoicedItemsUnit(invoicedItems: any, page: TFileToParse) {
  let unitInvoicedItems = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 10, 11, i.y - 0.3, i.y + 0.3);
    unitInvoicedItems.push(fieldValue);
  }
  return unitInvoicedItems;
}
export function getInvoicedItemsQuantity(
  invoicedItems: any,
  page: TFileToParse
) {
  let invoicedItemsQuant = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 12, 13, i.y - 0.3, i.y + 0.3);
    invoicedItemsQuant.push(fieldValue);
  }
  return invoicedItemsQuant;
}
export function getInvoicedItemsUnitPrice(
  invoicedItems: any,
  page: TFileToParse
) {
  let invoicedItemsUnitPrice = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 15, 16, i.y - 0.3, i.y + 0.3);
    invoicedItemsUnitPrice.push(fieldValue.replace(".", "").replace(",", "."));
  }
  return invoicedItemsUnitPrice;
}
export function getInvoicedItemsValue(invoicedItems: any, page: TFileToParse) {
  let invoicedItemsValue = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 18, 20, i.y - 0.3, i.y + 0.3);
    invoicedItemsValue.push(fieldValue.replace(".", "").replace(",", "."));
  }
  return invoicedItemsValue;
}
export function getInvoicedItemsUnitTariff(
  invoicedItems: any,
  page: TFileToParse
) {
  let invoicedItemsUnitTariff = [];
  for (let i of invoicedItems) {
    let fieldValue = getHolderData(page, 32, 33, i.y - 0.3, i.y + 0.3);
    invoicedItemsUnitTariff.push(fieldValue);
  }
  return invoicedItemsUnitTariff;
}
export function getAmount(page: TFileToParse) {
  const amount = getAllInvoicedItems(page).injectedEnergyItems[0]?.value || "0";
  const amountTreated = Number(amount) * -1;
  return amountTreated > 0 ? amountTreated : 0;
}

export function verifyHasInjection(page: TFileToParse) {
  const amount = invoicedValuesModule.getAmount(page);
  return amount > 0 ? true : false;
}

export function getTotalInvoice(page: TFileToParse) {
  let x = jsonPath.query(
    page,
    `$..[?(@.y >= 3 && @.y <= 4 && @.x >= 14 && @.x <= 15)]`
  );
  if (!x.length) return "";

  const totalInvoice = Number(
    queryString
      .unescape(x[1].R[0].T)
      .trim()
      .replace(/\s{2,}/g, ";")
      .split(";")[2]
      .replace(".", "")
      .replace(",", ".")
  );
  return totalInvoice;
}

export function getBankSlip(page: TFileToParse) {
  return getHolderData(page, 16, 17, 47, 48);
}
export function getAutomaticDebt(page: TFileToParse) {
  return getHolderData(page, 7, 10, 46, 47, 1);
}
