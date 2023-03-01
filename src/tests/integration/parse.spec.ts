import { parsePdf } from "../../cemigParse"
import { expectedExemptCompensation, expectedInjectedEnergy, expectedOnlyDistributor, expectedParsedOnlyAvailability } from "./parse.mock"

describe('parsePdfIntegration test',() =>{
    jest.setTimeout(90000)
    it('should parse pdf when bill have only availability cost',async ()=>{
        const parseResult = await parsePdf(process.cwd()+'\\src\\tests\\pdf\\onlyAvailabilityCost.pdf')
         expect(parseResult).toEqual(expectedParsedOnlyAvailability())
    })
    it('should parse pdf when bill  have injected energy, compensation and distributorEnergy',async ()=>{
        const parseResult = await parsePdf(process.cwd()+'\\src\\tests\\pdf\\withInjectedEnergy.pdf')
         expect(parseResult).toEqual(expectedInjectedEnergy())
    })
    it('should parse pdf when bill have injected energy, distributor energy and only compensation exempt',async ()=>{
        const parseResult = await parsePdf(process.cwd()+'\\src\\tests\\pdf\\withCompensationExempt.pdf')
         expect(parseResult).toEqual(expectedExemptCompensation())
    })
    it('should parse pdf when bill have only have only distributor energy',async ()=>{
        const parseResult = await parsePdf(process.cwd()+'\\src\\tests\\pdf\\onlyDistributorEnergy.pdf')
         expect(parseResult).toEqual(expectedOnlyDistributor())
    })
})