import * as jsonPath from "jsonpath";
import * as queryString from "querystring";
const PDFParser = require("pdf2json");
import {
  IHistory,
  IParseResult,
  TFileToParse,
} from "../models/cemigParse.model";
import { getAllAddress, getInstallationNumber } from "./consumerUnitInfo/consumerUnit";
import { getGenerationBalance, getTariffFlag } from "./generalInfo/generalInfo";
import { getDueDate, getNextRead } from "./invoiceDates";
import { getInvoicedItems } from "./invoiceValues/invoicedItems";
import { getTechnicalInfo } from "./technicalInfos";
import { getHolderDocument, getHolderName } from "./userInfo/userInfo";

function getPageData(data: any) {
  const productionJsonPath = jsonPath.query(data, "$.formImage.Pages[0].Texts");
  const developmentJsonPath = jsonPath.query(data, "$.Pages[0].Texts");
  return productionJsonPath.length !== 0
    ? productionJsonPath
    : developmentJsonPath;
}

export async function parsePdf(pdfPath: string): Promise<IParseResult> {
  const promise = new Promise((resolve, reject) => {
    let pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (err: any) => {
      reject(err);
    });
    pdfParser.on("pdfParser_dataReady", (data: any) => {
      console.log(`\n> Parsing ${pdfPath}`);
      try {
        const page = getPageData(data);
        const name = getHolderName(page);
        const address = getAllAddress(page).street;
        const district = getAllAddress(page).district;
        const aux = getAllAddress(page).aux;
        const postal_code = aux.slice(0, 9).replace(/([- ])/g, "");
        const city = aux.substring(10, aux.length - 4);
        const state = {
          initials: aux.substring(aux.length - 2),
          name: "",
        };
        const cpf = getHolderDocument(page);
        const consumerUnit = getInstallationNumber(page);
        const subclass = getSubClass(page);
        const unitPrice = getRate(page);
        const _class = getClass(page);
        const nextRead = getNextRead(page);
        const historyMonths = getMonthHistory(page);
        const historyConsumption = getConsumptionHistory(page);
        const historyDays = getDaysHistory(page);
        const history = makeHistoryData(
          historyDays,
          historyConsumption,
          historyMonths
        );
        const amountReg = getAmount(page);
        const hasInjection = verifyHasInjection(page);
        const competence = getCompetence(page);
        const flag = getTariffFlag(page);
        const bankSlip = getBankSlip(page);
        const automaticDebtCode = getAutomaticDebt(page);
        const totalInvoice = getTotalInvoice(page)
        const generationBalance = getGenerationBalance(page)
        const dueDate = getDueDate(page)
        const invoicedItems = getInvoicedItems(page)
        const technicalInfo = getTechnicalInfo(page)
        const consumerUnitParsed = {
          id: consumerUnit + "_" + competence,
          name,
          address,
          district,
          postal_code,
          city,
          state,
          cpf,
          unitPrice,
          _class,
          consumerUnit,
          subclass,
          history,
          nextRead,
          amountReg,
          hasInjection,
          competence,
          flag,
          bankSlip,
          automaticDebtCode,
          totalInvoice,
          generationBalance,
          dueDate,
          invoicedItems,
          technicalInfo
        };

        resolve(consumerUnitParsed);
      } catch (e: any) {
        console.log(
          `[parsePDF] Erro no processo de parser da conta ' ${pdfPath}. \n Erro encontrado: ${e}.`
        );
        reject(e);
      }
    });
    pdfParser.loadPDF(pdfPath);
  });
  return promise as Promise<IParseResult>;
}



export function getSubClass(page: TFileToParse) {
  const subclassData = getHolderData(page, 9, 14, 9, 12, 1);
  return subclassData || "";
}
export function getRate(page: TFileToParse) {
  const rateData = getHolderData(page, 15, 16, 14.5, 15.5);
  const treatedRate = rateData.length ? Number(rateData.replace(",", ".")) : 0;
  return treatedRate;
}
export function getClass(page: TFileToParse) {
  return getHolderData(page, 4, 5, 11.5, 12.5);
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

function getColumn(
  page: any,
  xInicial: number,
  xFinal: number,
  yInicial: number,
  yFinal: number
): string[] {
  let x = jsonPath.query(
    page,
    `$..[?(@.y >= ${yInicial} && @.y <= ${yFinal} && @.x >= ${xInicial} && @.x <= ${xFinal})]`
  );
  return x.map((month: any) => {
    return queryString.unescape(month.R[0].T).trim();
  });
}

export function getHolderData(
  page0: any,
  xInicial: number,
  xFinal: number,
  yInicial: number,
  yFinal: number,
  index?: number
): string {
  let x = jsonPath.query(
    page0,
    `$..[?(@.y >= ${yInicial} && @.y <= ${yFinal} && @.x >= ${xInicial} && @.x <= ${xFinal})]`
  );
  if (!x.length) {
    return "";
  }
  if (x.length > 2) {
    //Possible is subclass and contains two rows
    const one = queryString.unescape(x[1].R[0].T).trim();
    const two = queryString.unescape(x[2].R[0].T).trim();
    return `${one} ${two}`;
  }
  return queryString
    .unescape(x[index || 0].R[0].T)
    .trim()
    .replace(/\s{2,}/g, ";")
    .split(";")[0];
}

function makeHistoryData(
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

function getAmount(page: TFileToParse) {
  const amountTreated =
    Number(getHolderData(page, 18.5, 19.3, 15.3, 15.8).replace(",", "")) * -1;
  return amountTreated > 0 ? amountTreated : 0;
}

function verifyHasInjection(page: TFileToParse) {
  const amount = getAmount(page);
  return amount > 0 ? true : false;
}
export function getCompetence(page: TFileToParse) {
  return getHolderData(page, 14, 15, 3, 4, 1);
}

function getBankSlip(page: TFileToParse) {
  return getHolderData(page, 16, 17, 47, 48);
}
function getAutomaticDebt(page: TFileToParse) {
  return getHolderData(page, 7, 10, 46, 47, 1);
}
function getTotalInvoice(page: TFileToParse) {
  let x = jsonPath.query(
    page,
    `$..[?(@.y >= 3 && @.y <= 4 && @.x >= 14 && @.x <= 15)]`
  );
  return queryString
    .unescape(x[1].R[0].T)
    .trim()
    .replace(/\s{2,}/g, ";")
    .split(";")[2].replace('.', '').replace(',', '.')
}
