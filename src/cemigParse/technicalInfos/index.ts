import { ITechnicalInfo, TFileToParse } from "models/cemigParse.model";
import { getHolderData } from "../utils";

export function getTechnicalInfo(page0: TFileToParse): ITechnicalInfo {
  const measurement = getHolderData(page0, 19, 21, 27.744, 28.344);
  const previousReading = getHolderData(page0, 24, 25, 27.744, 28.344);
  const currentReading = getHolderData(page0, 26, 27, 27.744, 28.344);
  const constantReading = getHolderData(page0, 30, 31, 27.744, 28.344);
  const consumptionReading = getHolderData(page0, 33, 34, 27.744, 28.344);

  return {
    measurement,
    previousReading,
    currentReading,
    constantReading,
    consumptionReading,
  };
}
