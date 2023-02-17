# pdf-parser-library
Pdf parser to read Cemig Bill


# How to debug

### Insert this code in index.ts
```
import { parsePdf } from "./cemigParse";

const response =  async ()=> await parsePdf("src/pdf/debug.pdf")

response().then(foo=>console.log(foo))
```
### Run in terminal:
```
yarn debug
```
or 
```
npm run debug
```

# How deploy:

Open pull request and merge in master

After merge, deployment script is running in Github Actions