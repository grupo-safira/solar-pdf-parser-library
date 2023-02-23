import { parsePdf } from "./cemigParse";

const response =  async ()=> await parsePdf("src/pdf/debug.pdf")

response().then(foo=>console.log(foo))