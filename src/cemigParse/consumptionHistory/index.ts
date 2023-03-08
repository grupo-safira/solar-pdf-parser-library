import { getColumn } from "../utils";
import { IHistory, TFileToParse } from "../../models/cemigParse.model";
import * as consumptionHistory from "../consumptionHistory"
export function makeHistoryData(page: TFileToParse): IHistory[] {
  const historyMonths = consumptionHistory.getMonthHistory(page);
  const historyConsumption = consumptionHistory.getConsumptionHistory(page);
  const historyDays = consumptionHistory.getDaysHistory(page);
  if (
    !historyConsumption.length &&
    !historyDays.length &&
    !historyMonths.length
  ) {
    return [];
  }

  let historyArray = [];
  for (let index = 0; index <= 12; index++) {
    const hist = {
      monthAndYear: historyMonths[index],
      consumption: Number(historyConsumption[index].replace(".", "")),
      days: Number(historyDays[index]) ?? 0,
    };
    historyArray.push(hist);
  }
  return historyArray;
}

export function getMonthHistory(page: TFileToParse) {
  return getColumn(page, 0.5, 1.5, 36, 44);
}

export function getConsumptionHistory(page: TFileToParse) {
  return getColumn(page, 2, 6, 36, 44);
}

export function getDaysHistory(page: TFileToParse) {
  return getColumn(page, 10.8, 11.3, 36, 44);
}
