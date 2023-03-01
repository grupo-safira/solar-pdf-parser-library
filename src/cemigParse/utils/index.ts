import * as jsonPath from "jsonpath";
import * as queryString from "querystring";
export function getColumn(
  page: any,
  xInicial: number,
  xFinal: number,
  yInicial: number,
  yFinal: number
): string[] {
  const x = jsonPath.query(
    page,
    `$..[?(@.y >= ${yInicial} && @.y <= ${yFinal} && @.x >= ${xInicial} && @.x <= ${xFinal})]`
  );
  if(!x.length){
    console.error(`Houve um erro ao realizar o parse da coluna com as seguintes coordenadas ${xInicial}, ${xFinal}, ${yInicial}, ${yFinal}`)
    return []
  }
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
