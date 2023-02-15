import * as jsonPath from "jsonpath";
import *  as queryString from "querystring";
const PDFParser = require("pdf2json")
import { IHistory } from "../models/cemigParse.model";

export function getHolderName(page: any) {
  return getHolderData(page, 0, 1, 3, 3.5);
}

export function getAllAddress(page: any) {
  const street = getAddress(page, 0, 2, 3.6, 8);
  const aux = getAddress(page, 0, 2, 4.5, 5);
  const district = getAddress(page, 0, 1, 4, 5);
  return { street, aux, district };
}

export function getHolderDocument(page: any) {
  return getHolderData(page, 0, 1, 5, 6)
    .replace("CPF ", "")
    .replace("CNPJ ", "")
    .normalize("NFD")
    .replace(/[^0-9]/g, "");
}

export function getInstallationNumber(page: any) {
  return getDataOfCoordinate(page, 16, 17, 46, 47, "INSTALAÇÃO");
}

export function getSubClass(page:any){
    return getHolderData(page, 9, 14, 9, 12)
}

export function getMonthHistory(page: any) {
  return getColumn(page, 0.5, 1.5, 36, 44);
}

export function getConsumptionHistory(page: any) {
  return getColumn(page, 2, 6, 36, 44);
}

export function getDaysHistory(page: any) {
  return getColumn(page, 0.5, 1.5, 36, 44);
}

function getAddress(
  page0: any,
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
function getDataOfCoordinate(
  page0: any,
  xInicial: number,
  xFinal: number,
  yInicial: number,
  yFinal: number,
  title: string
): any {
  let x = jsonPath
    .query(
      page0,
      `$..[?(@.y >= ${yInicial} && @.y <= ${yFinal} && @.x >= ${xInicial} && @.x <= ${xFinal})]`
    )
    .sort((a: any, b: any) => {
      if (parseFloat(a.y) < parseFloat(b.y)) return -1;
      if (parseFloat(a.y) > parseFloat(b.y)) return 1;
      if (parseFloat(a.y) == parseFloat(b.y)) return 0
      return 0
    });
  let arrData = x.map((e: any) => {
    return queryString
      .unescape(e.R[0].T)
      .trim()
      .replace(/\s{2,}/, ";");
  });
  let colPos = 0;
  for (let title of arrData[0].split(";")) {
    if (title.toUpperCase().indexOf(title) === 0) {
      break;
    }
    colPos++;
  }
  return arrData[1].split(";")[colPos];
}

function getColumn(
  page: any,
  xInicial: number,
  xFinal: number,
  yInicial: number,
  yFinal: number
): string[] {
  let page0 = jsonPath.query(page, "$.Pages[0].Texts");
  let x = jsonPath.query(
    page0,
    `$..[?(@.y >= ${yInicial} && @.y <= ${yFinal} && @.x >= ${xInicial} && @.x <= ${xFinal})]`
  );
  return x.map((month: any) => {
    return decodeURI(month.R[0].T).trim();
  });
}

function getHolderData(
  page0: any,
  xInicial: number,
  xFinal: number,
  yInicial: number,
  yFinal: number
): string {
  let x = jsonPath.query(
    page0,
    `$..[?(@.y >= ${yInicial} && @.y <= ${yFinal} && @.x >= ${xInicial} && @.x <= ${xFinal})]`
  );
  if (!x.length) {
    return "";
  }

  return queryString.unescape(x[0].R[0].T).trim();
}

export function parsePdf(pdfPath: string): any {
  const promise = new Promise((resolve, reject) => {
    let pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (err: any) => {
      console.log(err.parserError);
      reject(err);
    });
    pdfParser.on("pdfParser_dataReady", (data: any) => {
      console.log(`\n> Parsing ${pdfPath}`);
      try {
        let page0 = jsonPath.query(data, "$.Pages[0].Texts");

        const name = getHolderName(page0);
        const address = getAllAddress(page0).street;
        const district = getAllAddress(page0).district;
        const aux = getAllAddress(page0).aux;
        const postal_code = aux.slice(0, 9).replace(/([- ])/g, "");
        const city = aux.substring(10, aux.length - 4);
        const state = {
          initials: aux.substring(aux.length - 2),
          name: "",
        };
        const cpf = getHolderDocument(page0)
          .replace("CPF ", "")
          .replace("CNPJ ", "")
          .normalize("NFD")
          .replace(/[^0-9]/g, "");
        const consumer_unit = getInstallationNumber(page0);
        const installation_number = consumer_unit;
        const subclassTemp = getSubClass(page0);
        const subclass = subclassTemp ? subclassTemp : "";

        const rateTemp = getHolderData(page0, 15, 16, 14.5, 15.5);
        const rate =
        rateTemp.length > 0 ? Number(rateTemp.replace(",", ".")) : 0;

        const consumerUnitClass = getHolderData(page0, 4, 5, 11.5, 12.5);
        const nextReadTemp = getHolderData(page0, 33, 34, 11.5, 12);
        const emissionDate = getHolderData(page0, 20, 21, 5.5, 6.5).replace(
          "Data de emissão: ",
          ""
        );

        let emissionYear = Number(emissionDate.split("/")[2]);
        const emissionMonth = Number(emissionDate.split("/")[1]);
        const nextMonth = Number(nextReadTemp.split("/")[1]);

        if (nextMonth < emissionMonth) emissionYear++;
        const nextRead = nextReadTemp + "/" + emissionYear.toString();

        const historyMonths = getMonthHistory(page0);

        const historyConsumption = getConsumptionHistory(page0);

        const dias = getDaysHistory(page0);

        const history: IHistory[] = [];

        if (historyMonths.length > 0 && historyConsumption.length > 0 && dias.length > 0) {
          for (let index = 0; index <= 12; index++) {
            const hist = {
              month: historyMonths[index],
              consumption: Number(historyConsumption[index].replace(".", "")),
              days: dias[index],
            };
            history.push(hist);
          }
        }

        // Verify if has energy injection
        const tempAmount =
          Number(
            getHolderData(page0, 18.5, 19.3, 15.3, 15.8).replace(",", "")
          ) * -1;
        let amountReg = tempAmount > 0 ? tempAmount : 0;

        const hasInjection = amountReg > 0 ? true : false;

        const ConsumerUnit = {
          name,
          address,
          district,
          postal_code,
          city,
          state,
          cpf,
          rate,
          consumerUnitClass,
          consumer_unit,
          installation_number,
          subclass,
          history,
          nextRead,
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
  return promise;
}
