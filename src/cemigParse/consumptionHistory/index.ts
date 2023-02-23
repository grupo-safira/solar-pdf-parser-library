import { getColumn } from "../utils";
import { IHistory, TFileToParse } from "models/cemigParse.model";

export function makeHistoryData(
    historyDays: string[],
    historyConsumption: string[],
    historyMonths: string[]
  ): IHistory[] {
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
        mes_ano: historyMonths[index],
        consumo: Number(historyConsumption[index].replace(".", "")),
        dias: historyDays[index],
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