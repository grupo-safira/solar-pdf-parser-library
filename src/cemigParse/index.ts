import * as jsonPath from "jsonpath";
import * as queryString from "querystring";
const PDFParser = require("pdf2json");
import {
  IHistory,
  IParseResult,
  TFileToParse,
} from "../models/cemigParse.model";

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
        const consumer_unit = getInstallationNumber(page);
        const installation_number = consumer_unit;
        const subclasse = getSubClass(page);
        const tarifa = getRate(page);
        const classe = getClass(page);
        const next_read = getNextRead(page);

        const historyMonths = getMonthHistory(page);

        const historyConsumption = getConsumptionHistory(page);

        const historyDays = getDaysHistory(page);

        const history = makeHistoryData(
          historyDays,
          historyConsumption,
          historyMonths
        );
        const amountReg = getAmount(page)
        const hasInjection = verifyHasInjection(page)

        const ConsumerUnit = {
          name,
          address,
          district,
          postal_code,
          city,
          state,
          cpf,
          tarifa,
          classe,
          consumer_unit,
          installation_number,
          subclasse,
          history,
          next_read,
          amountReg,
          hasInjection,
        };
        
        resolve(ConsumerUnit);
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

export function getHolderName(page: TFileToParse) {
  return getHolderData(page, 0, 1, 3, 3.5);
}

export function getAllAddress(page: TFileToParse) {
  const street = getAddress(page, 0, 2, 3.6, 8);
  const aux = getAddress(page, 0, 2, 4.5, 5);
  const district = getAddress(page, 0, 1, 4, 5);
  return { street, aux, district };
}

export function getHolderDocument(page: TFileToParse) {
  return getHolderData(page, 0, 1, 5, 6)
    .replace("CPF ", "")
    .replace("CNPJ ", "")
    .normalize("NFD")
    .replace(/[^0-9]/g, "");
}

export function getInstallationNumber(page: TFileToParse) {
  return getHolderData(page, 16, 17, 46, 47, 1);
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

function getAddress(
  page0: TFileToParse,
  xInicial: number,
  xFinal: number,
  yInicial: number,
  yFinal: number
): string {
  let x = jsonPath.query(
    page0,
    `$..[?(@.y >= ${yInicial} && @.y <= ${yFinal} && @.x >= ${xInicial} && @.x <= ${xFinal})]`
  );
  return queryString.unescape(x[0].R[0].T).trim();
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

function getHolderData(
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
  return queryString.unescape(x[index || 0].R[0].T).trim();
}

function getDataEmissao(
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

function getNextRead(page: TFileToParse) {
  const nextRead = getHolderData(page, 33, 34, 11.5, 12);
  const emissionDate = getDataEmissao(page, 20, 21, 5, 9);

  return nextReadTreatment(nextRead, emissionDate);
}

function nextReadTreatment(nextRead: string, emissionDate: string) {
  let emissionYear = Number(emissionDate.split("/")[2]);
  const emissionMonth = Number(emissionDate.split("/")[1]);
  const nextMonth = Number(nextRead.split("/")[1]);

  if (nextMonth < emissionMonth) emissionYear++;
  return nextRead + "/" + emissionYear.toString();
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
  return historyArray
}

function getAmount(page: TFileToParse){
  const amountTreated = Number(getHolderData(page, 18.5, 19.3, 15.3, 15.8).replace(",", "")) *
  -1;
  return amountTreated > 0 ? amountTreated: 0
}

function verifyHasInjection(page: TFileToParse){
  const amount = getAmount(page)
  return amount > 0 ? true : false;
}