const PDFParser = require("pdf2json");
import * as jsonPath from "jsonpath";
import { IParseResult } from "../models/cemigParse.model";
import {
  getAllAddress,
  getClass,
  getInstallationNumber,
  getSubClass,
} from "./consumerUnitInfo";
import {
  makeHistoryData,
} from "./consumptionHistory";
import { getGenerationBalance, getTariffFlag } from "./generalInfo";
import { getCompetence, getDueDate, getNextRead } from "./invoiceDates";
import {
  getAmount,
  getAutomaticDebt,
  getBankSlip,
  getAllInvoicedItems,
  getTotalInvoice,
  verifyHasInjection,
} from "./invoiceValues";
import { getTechnicalInfo } from "./technicalInfos";
import { getCustomerNumber, getHolderDocument, getHolderName } from "./userInfo";

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
        const postalCode = aux.slice(0, 9).replace(/([- ])/g, "");
        const city = aux.substring(10, aux.length - 4);
        const state = {
          initials: aux.substring(aux.length - 2),
          name: "",
        };
        const cpf = getHolderDocument(page);
        const consumerUnit = getInstallationNumber(page);
        const subclass = getSubClass(page);
        const customerNumber = getCustomerNumber(page);
        const _class = getClass(page);
        const nextRead = getNextRead(page);
        const history = makeHistoryData(page);
        const amountReg = getAmount(page);
        const hasInjection = verifyHasInjection(page);
        const competence = getCompetence(page);
        const flag = getTariffFlag(page);
        const bankSlip = getBankSlip(page);
        const automaticDebtCode = getAutomaticDebt(page);
        const totalInvoice = getTotalInvoice(page);
        const generationBalance = getGenerationBalance(page);
        const dueDate = getDueDate(page);
        const invoicedItems = getAllInvoicedItems(page);
        const technicalInfo = getTechnicalInfo(page);
        const consumerUnitParsed: IParseResult = {
          id: consumerUnit + "_" + competence.replace("/", "-"),
          name,
          address,
          district,
          postalCode,
          city,
          state,
          cpf,
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
          technicalInfo,
          customerNumber
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
