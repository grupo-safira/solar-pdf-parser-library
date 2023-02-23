import * as jsonPath from "jsonpath";
import * as queryString from "querystring";
import { TFileToParse } from "models/cemigParse.model";

export function getTariffFlag(page: TFileToParse) {
  const generalInfo = getGeneralInfo(page);
  const flagLine = generalInfo.split(".br.")[1] || generalInfo.split("c/c.")[1] || generalInfo.split("local.")[1];
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
  let arrDados: Array<string> = x.map((e: any) => {
    return queryString.unescape(e.R[0].T).trim();
  });
  let texto: string = "";
  for (let index = 0; index < arrDados.length; index++) {
    if (
      arrDados[index].substring(0, 4) === "SALDO" ||
      arrDados[index].substring(0, 4) === "ATUAL" ||
      arrDados[index].substring(0, 1) === "DE" ||
      arrDados[index].substring(0, 7) === "GERAÇÃO"
    ) {
      texto = texto + " " + arrDados[index];
    } else {
      if (arrDados[index].substring(arrDados[index].length - 1) === "-") {
        texto = texto + arrDados[index] + " ";
      } else {
        texto = texto + arrDados[index];
      }
    }
  }
  return texto;
}

export function getGenerationBalance(page: TFileToParse) {
  const generalInfo = getGeneralInfo(page);
  const balanceLine = generalInfo.split("kWh")[0];
  const generationBalanceTreatment = parseFloat(
    balanceLine.split(":")[1].replace(".", "").replace(",", ".")
  );
  return generationBalanceTreatment;
}
