import * as utils from "../utils";
import { TFileToParse } from "../../models/cemigParse.model";

export function getHolderName(page: TFileToParse) {
  return utils.getHolderData(page, 0, 1, 3, 3.5);
}

export function getHolderDocument(page: TFileToParse) {
  return utils.getHolderData(page, 0, 1, 5, 6)
    .replace("CPF ", "")
    .replace("CNPJ ", "")
    .normalize("NFD")
    .replace(/[^0-9]/g, "");
}
