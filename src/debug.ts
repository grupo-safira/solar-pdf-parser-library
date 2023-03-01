import { parsePdf } from "./cemigParse";

const response =  async ()=> await parsePdf("src/tests/pdf/debug.pdf")

response().then(foo=>console.log(foo))