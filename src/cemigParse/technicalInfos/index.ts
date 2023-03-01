import { ITechnicalInfo, TFileToParse } from "models/cemigParse.model";
import { getHolderData } from "../utils";

export function getTechnicalInfo(page0: TFileToParse): ITechnicalInfo {
  const measurement = getHolderData(page0, 19, 21, 27.744, 28.344);
  const previousReading = Number(getHolderData(page0, 24, 25, 27.744, 28.344).replace(".", ""));
  const currentReading = Number(getHolderData(page0, 25.5, 27.5, 27.744, 28.344).replace(".", ""));
  const constantReading = Number(getHolderData(page0, 30, 31, 27.744, 28.344).replace(".", ""));
  const consumptionReading = Number(getHolderData(page0, 33, 34, 27.744, 28.344).replace(".", ""));

  return {
    measurement,
    previousReading,
    currentReading,
    constantReading,
    consumptionReading,
  };
}
