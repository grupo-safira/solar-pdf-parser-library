import { TClass, TFileToParse } from "models/cemigParse.model";
import * as jsonPath from "jsonpath";
import * as queryString from "querystring";
import { getHolderData } from "../utils/index";
import * as consumerUnitInfo from "../consumerUnitInfo"
export function getAddress(
  page0: TFileToParse,
  xInicial: number,
  xFinal: number,
  yInicial: number,
  yFinal: number
): string {
  const coordinate = jsonPath.query(
    page0,
    `$..[?(@.y >= ${yInicial} && @.y <= ${yFinal} && @.x >= ${xInicial} && @.x <= ${xFinal})]`
  );
  return queryString.unescape(coordinate[0].R[0].T).trim();
}

export function getAllAddress(page: TFileToParse) {
  const street = consumerUnitInfo.getAddress(page, 0, 2, 3.6, 8);
  const aux = consumerUnitInfo.getAddress(page, 0, 2, 4.5, 5);
  const district = consumerUnitInfo.getAddress(page, 0, 1, 4, 5);
  return { street, aux, district };
}

export function getInstallationNumber(page: TFileToParse) {
  return getHolderData(page, 16, 17, 46, 47, 1);
}

export function getSubClass(page: TFileToParse) {
  const subclassData = getHolderData(page, 9, 14, 9, 12, 1);
  return subclassData;
}
export function getClass(page: TFileToParse): TClass {
  return getHolderData(page, 4, 5, 11.5, 12.5) as TClass;
}