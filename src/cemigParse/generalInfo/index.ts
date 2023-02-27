import * as jsonPath from "jsonpath";
import * as queryString from "querystring";
import { TFileToParse } from "models/cemigParse.model";

export function getTariffFlag(page: TFileToParse) {
  const generalInfo = getGeneralInfo(page);
  const flagLine =
    generalInfo.split(".br.")[1] ||
    generalInfo.split("c/c.")[1] ||
    generalInfo.split("faturamento.")[1] ||
    generalInfo.split("local.")[1] ||
    generalInfo.split("energia.")[1];
    if(!flagLine.includes('Band') || !flagLine){
      console.error('Não doi possivel buscar a bandeira')
      return {
        current: '',
        previous: '',
      }
    }
  const flags = {
    current: flagLine.split("-")[0].trim(),
    previous: flagLine.split("-")[1].trim(),
  };
  return flags;
}

function getGeneralInfo(page: TFileToParse): string {
  let x = jsonPath.query(
    page,
    `$..[?(@.y >= 32.4 && @.y <= 39 && @.x >=  14 && @.x <= 31)]`
  );
  const arrayData: Array<string> = x.map((e: any) => {
    return queryString.unescape(e.R[0].T).trim();
  });
  let text: string = "";
  for (let index = 0; index < arrayData.length; index++) {
    if (
      arrayData[index].substring(0, 4) === "SALDO" ||
      arrayData[index].substring(0, 4) === "ATUAL" ||
      arrayData[index].substring(0, 1) === "DE" ||
      arrayData[index].substring(0, 7) === "GERAÇÃO"
    ) {
      text = text + " " + arrayData[index];
    } else {
      if (arrayData[index].substring(arrayData[index].length - 1) === "-") {
        text = text + arrayData[index] + " ";
      } else {
        text = text + arrayData[index];
      }
    }
  }
  return text;
}

export function getGenerationBalance(page: TFileToParse) {
  const generalInfo = getGeneralInfo(page);
  const balanceLine = generalInfo.split("kWh")[0];
  if (balanceLine) return 0;
  const generationBalanceTreatment = parseFloat(
    balanceLine.split(":")[1].replace(".", "").replace(",", ".")
  );
  return generationBalanceTreatment;
}
