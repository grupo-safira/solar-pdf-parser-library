import * as jsonPath from "jsonpath";
import * as queryString from "querystring";
import { TFileToParse } from "models/cemigParse.model";
import * as generalInfoModule from "../generalInfo";
export function getTariffFlag(page: TFileToParse) {
  const generalInfo = generalInfoModule.getGeneralInfo(page);
  const flagInfo = generalInfo.split(" ").slice(-7)
  const flagArray = flagInfo.join(' ').split('-')
  if (!flagArray.length || !flagArray[0].includes("Band") || !flagArray[1].includes("Band")) {
    console.error("Não foi possivel buscar a bandeira");
    return {
      current: "",
      previous: "",
    };
  }
  const flags = {
    previous: flagArray[0].trim(),
    current: flagArray[1].trim(),
  };
  return flags;
}

export function getGeneralInfo(page: TFileToParse): string {
  let x = jsonPath.query(
    page,
    `$..[?(@.y >= 32.4 && @.y <= 39 && @.x >=  14 && @.x <= 31)]`
  );
  if (!x.length) {
     throw new Error("Não foi possivel localizar as informações gerais");
  }
  const arrayData: Array<string> = x.map((e: any) => {
    return queryString.unescape(e.R[0].T);
  });
  let text: string = "";
  for (let index = 0; index < arrayData.length; index++) {
    if (arrayData[index].substring(arrayData[index].length - 1) === "-") {
      text = text + arrayData[index] + " ";
    } else {
      text = text + arrayData[index];
    }
  }
  return text;
}

export function getGenerationBalance(page: TFileToParse) {
  const generalInfo = generalInfoModule.getGeneralInfo(page);
  if (!generalInfo.includes("kWh")) return 0;
  const balanceLine = generalInfo.split("kWh FP/Único")[0];
  const generationBalanceTreatment = parseFloat(
    balanceLine.split(":")[1].replace(".", "").replace(",", ".")
  );
  return generationBalanceTreatment;
}
