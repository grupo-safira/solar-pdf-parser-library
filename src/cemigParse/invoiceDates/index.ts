import { getHolderData } from "../index";
import * as jsonPath from "jsonpath";
import { TFileToParse } from "models/cemigParse.model";
import * as queryString from "querystring";

export function getEmissionDate(
  page0: any,
  xInicial: number,
  xFinal: number,
  yInicial: number,
  yFinal: number
): string {
  let x = jsonPath
    .query(
      page0,
      `$..[?(@.y >= ${yInicial} && @.y <= ${yFinal} && @.x >= ${xInicial} && @.x <= ${xFinal})]`
    )
    .sort((a: any, b: any) => {
      if (parseFloat(a.y) < parseFloat(b.y)) return -1;
      if (parseFloat(a.y) > parseFloat(b.y)) return 1;
      if (parseFloat(a.y) == parseFloat(b.y)) return 0;
      return 0;
    });
  let arrDados = x.map((e: any) => {
    return queryString.unescape(e.R[0].T).trim();
  });
  let dataEmissao = "";
  for (let dado of arrDados) {
    if (dado.toUpperCase().indexOf("DATA DE EMISSÃO") === -1) {
      continue;
    } else {
      let linhaDataEmissao = dado.toUpperCase();
      dataEmissao = linhaDataEmissao.replace("DATA DE EMISSÃO:", "").trim();
    }
  }
  return dataEmissao;
}

export function getNextRead(page: TFileToParse) {
  const nextRead = getHolderData(page, 33, 34, 11.5, 12);
  const emissionDate = getEmissionDate(page, 20, 21, 5, 9);

  return nextReadTreatment(nextRead, emissionDate);
}

function nextReadTreatment(nextRead: string, emissionDate: string) {
  let emissionYear = Number(emissionDate.split("/")[2]);
  const emissionMonth = Number(emissionDate.split("/")[1]);
  const nextMonth = Number(nextRead.split("/")[1]);

  if (nextMonth < emissionMonth) emissionYear++;
  return nextRead + "/" + emissionYear.toString();
}

export function getDueDate(
  page: TFileToParse,
) {
  let x = jsonPath.query(
    page,
    `$..[?(@.y >= 3 && @.y <= 4 && @.x >= 14 && @.x <= 15)]`
  );
  let arrDados = x.map((e: any) => {
    return queryString
      .unescape(e.R[0].T)
      .trim()
      .replace(/\s{2,}/g, ";");
  });
  let colPos = 0;
  for (let title of arrDados[0].split(";")) {
    if (title.toUpperCase().indexOf("VENCIMENTO") === 0) {
      break;
    }
    colPos++;
  }
  const dueDateTreated = dueDateTreatment(arrDados[1].split(";")[colPos]);
  return dueDateTreated;
}

function dueDateTreatment(dueDate: string) {
  const dueYear = Number(dueDate.split("/")[2]);
  const dueMonth = Number(dueDate.split("/")[1]);
  const dueDay = Number(dueDate.split("/")[0]);
  const dueDateTreated = new Date(dueYear, dueMonth - 1, dueDay, 0, 0, 0);
  return dueDateTreated;
}
