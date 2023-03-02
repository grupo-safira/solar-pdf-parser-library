import * as generalInfo from "../../../cemigParse/generalInfo";
import * as jsonPath from "jsonpath";
jest.mock("jsonpath", () => {
  return {
    query: jest.fn(),
  };
});

describe("generalInfo unit tests", () => {
  beforeEach(jest.clearAllMocks);

  describe("getTariffFlag", () => {
    it("should return tariff flag when before flag word is 'n.º 194/22' (layout of bill has different types)", () => {
      const getGeneralInfoSpy = jest.spyOn(generalInfo, "getGeneralInfo");
      getGeneralInfoSpy.mockReturnValueOnce(
        "RECIBO DE QUITAÇÃO DE DÉBITOS Nº 01/2023 A Cemig, ematendimento à Lei nº 12.007, de 29/07/09,declara quitados os débitos do cliente em referência (contrato5016723274), relativos ao fornecimento deenergia elétrica a esta unidade consumidora, referente aosvencimentos de 01/01/2018 a 31/12/2022,excetuando eventuais débitos que sejam posteriormente apuradosdiante de possível verificação deirregularidades ou de revisão de faturamento, que abranjam operíodo em questão. SALDO ATUAL DE GERAÇÃO: 0,00 kWh. Tarifa vigente conforme Res Aneel nº 3.046,de 21/06/2022. Redução aliquota ICMSconforme Lei Complementar 194/22. Base de cálculo reduzida nascomponentes Distribuição, Transmissão eEncargos conf. art. 2º da Lei n.º 194/22 DEZ/22 Band. Verde - JAN/23 Band. Verde."
      );

      const response = generalInfo.getTariffFlag("page");

      expect(getGeneralInfoSpy).toHaveBeenCalled();
      expect(response).toEqual({
        previous: "DEZ/22 Band. Verde",
        current: "JAN/23 Band. Verde.",
      });
    });
    it("should return tariff flag when before flag word is '.br.' (layout of bill has different types)", () => {
      const getGeneralInfoSpy = jest.spyOn(generalInfo, "getGeneralInfo");
      getGeneralInfoSpy.mockReturnValueOnce(
        "Tarifa vigente conforme Res Aneel nº 3.046, de 21/06/2022. Redução aliquota ICMS conforme Lei Complementar 194/22. Base de cálculo reduzida nas componentes Distribuição, Transmissão e Encargos conf. art. 2º da Lei n.º 194/22 O pagamento desta conta não quita débitos anteriores. Para estes, estão sujeitas penalidades legais vigentes (multas) e/ou atualização financeira (juros)baseadas no vencimento das mesmas. É dever do consumidor manter os dados cadastrais sempre atualizados e informar alterações da atividade exercida no local. Faça sua adesão para recebimento da conta de energia por e-mail acessando www.cemig.com.br. DEZ/22 Band. Verde - JAN/23 Band. Verde. "
      );

      const response = generalInfo.getTariffFlag("page");

      expect(getGeneralInfoSpy).toHaveBeenCalled();
      expect(response).toEqual({
        previous: "DEZ/22 Band. Verde",
        current: "JAN/23 Band. Verde.",
      });
    });
    it("should return tariff flag when before flag word is 'c/c.' (layout of bill has different types)", () => {
      const getGeneralInfoSpy = jest.spyOn(generalInfo, "getGeneralInfo");
      getGeneralInfoSpy.mockReturnValueOnce(
        "RECIBO DE QUITAÇÃO DE DÉBITOS Nº 01/2023 A Cemig, em atendimento à Lei nº 12.007, de 29/07/09, declara quitados os débitos do cliente em referência (contrato 5016347207), relativos ao fornecimento de energia elétrica a esta unidade consumidora, referente aos vencimentos de 01/01/2018 a 31/12/2022, excetuando eventuais débitos que sejam posteriormente apurados diante de possível verificação de irregularidades ou de revisão de faturamento, que abranjam o período em questão. Tarifa vigente conforme Res Aneel nº 3.046, de 21/06/2022. Redução aliquota ICMS conforme Lei Complementar 194/22. Base de cálculo reduzida nas componentes Distribuição, Transmissão e Encargos conf. art. 2º da Lei n.º 194/22 Considerar nota fiscal quitada após débito em sua c/c. DEZ/22 Band. Verde - JAN/23 Band. Verde."
      );

      const response = generalInfo.getTariffFlag("page");

      expect(getGeneralInfoSpy).toHaveBeenCalled();
      expect(response).toEqual({
        previous: "DEZ/22 Band. Verde",
        current: "JAN/23 Band. Verde.",
      });
    });
    it("should return tariff flag when before flag word is 'faturamento.' (layout of bill has different types)", () => {
      const getGeneralInfoSpy = jest.spyOn(generalInfo, "getGeneralInfo");
      getGeneralInfoSpy.mockReturnValueOnce(
        "RECIBO DE QUITAÇÃO DE DÉBITOS Nº 01/2023 A Cemig, ematendimento à Lei nº 12.007, de 29/07/09,declara quitados os débitos do cliente em referência (contrato5016723274), relativos ao fornecimento deenergia elétrica a esta unidade consumidora, referente aosvencimentos de 01/01/2018 a 31/12/2022,excetuando eventuais débitos que sejam posteriormente apuradosdiante de possível verificação deirregularidades ou de revisão de faturamento, que abranjam operíodo em questão. SALDO ATUAL DE GERAÇÃO: 0,00 kWh. Tarifa vigente conforme Res Aneel nº 3.046,de 21/06/2022. Redução aliquota ICMSconforme Lei Complementar 194/22. Base de cálculo reduzida nascomponentes Distribuição, Transmissão eEncargos conf. art. 2º da Lei n.º 194/22 DEZ/22 Band. Verde - JAN/23 Band. Verde."
      );

      const response = generalInfo.getTariffFlag("page");

      expect(getGeneralInfoSpy).toHaveBeenCalled();
      expect(response).toEqual({
        previous: "DEZ/22 Band. Verde",
        current: "JAN/23 Band. Verde.",
      });
    });
    it("should return tariff flag when before flag word is 'local.' (layout of bill has different types)", () => {
      const getGeneralInfoSpy = jest.spyOn(generalInfo, "getGeneralInfo");
      getGeneralInfoSpy.mockReturnValueOnce(
        "SALDO ATUAL DE GERAÇÃO: 0,00 kWh. Tarifa vigente conforme Res Aneel nº 3.046, de 21/06/2022.Redução aliquota ICMS conforme Lei Complementar 194/22. Base de cálculo reduzida nas componentes Distribuição, Transmissão e Encargos conf. art. 2º da Lei n.º 194/22 Unidade faz parte de sistema de compensação de energia. O pagamento desta conta não quita débitos anteriores. Para estes, estão sujeitas penalidades legais vigentes (multas) e/ou atualização financeira (juros)baseadas no vencimento das mesmas. Leitura realizada conforme calendário de faturamento. É dever do consumidor manter os dados cadastrais sempre atualizados e informar alterações da atividade exercida no local. DEZ/22 Band. Verde - JAN/23 Band. Verde."
      );

      const response = generalInfo.getTariffFlag("page");

      expect(getGeneralInfoSpy).toHaveBeenCalled();
      expect(response).toEqual({
        previous: "DEZ/22 Band. Verde",
        current: "JAN/23 Band. Verde.",
      });
    });
    it("should return tariff flag when before flag word is 'energia.' (layout of bill has different types)", () => {
      const getGeneralInfoSpy = jest.spyOn(generalInfo, "getGeneralInfo");
      getGeneralInfoSpy.mockReturnValueOnce(
        "RECIBO DE QUITAÇÃO DE DÉBITOS Nº 01/2023 A Cemig, em atendimento à Lei nº 12.007, de 29/07/09, declara quitados os débitos do cliente em referência (contrato 5012347880), relativos ao fornecimento de energia elétrica a esta unidade consumidora, referente aos vencimentos de 01/01/2018 a 31/12/2022, excetuando eventuais débitos que sejam posteriormente apurados diante de possível verificação de irregularidades ou de revisão de faturamento, que abranjam o período em questão. SALDO ATUAL DE GERAÇÃO: 477,95 kWh FP/Único, 7,10 kWh ponta. Tarifa vigente conforme Res Aneel nº 3.046, de 21/06/2022. Redução aliquota ICMS conforme Lei Complementar 194/22. Unidade faz parte de sistema de compensação de energia. DEZ/22 Band. Verde - JAN/23 Band. Verde."
      );

      const response = generalInfo.getTariffFlag("page");

      expect(getGeneralInfoSpy).toHaveBeenCalled();
      expect(response).toEqual({
        previous: "DEZ/22 Band. Verde",
        current: "JAN/23 Band. Verde.",
      });
    });
    it("should return empty tariff object when not found flag", () => {
      const getGeneralInfoSpy = jest.spyOn(generalInfo, "getGeneralInfo");
      getGeneralInfoSpy.mockReturnValueOnce(
        "RECIBO DE QUITAÇÃO DE DÉBITOS Nº 01/2023 A Cemig, em atendimento à Lei"
      );
      const response = generalInfo.getTariffFlag("page");

      expect(getGeneralInfoSpy).toHaveBeenCalled();
      expect(response).toEqual({
        current: "",
        previous: "",
      });
    });
  });
  describe("getGeneralInfo", () => {
    it("should return general info pdf", () => {
      const jsonPathSpy = jest.spyOn(jsonPath, "query");

      jsonPathSpy.mockImplementation(() => {
        return [
          {
            R: [
              {
                T: "RECIBO%20DE%20QUITA%C3%87%C3%83O%20DE%20D%C3%89BITOS%20N%C2%BA%2001%2F2023%20A%20Cemig%2C%20em",
              },
            ],
          },
        ];
      });
      const response = generalInfo.getGeneralInfo("page");

      expect(jsonPathSpy).toHaveBeenCalled();
      expect(response).toEqual(
        "RECIBO DE QUITAÇÃO DE DÉBITOS Nº 01/2023 A Cemig, em"
      );
    });
    it("should return throw error when not get generalInfo", () => {
      const jsonPathSpy = jest.spyOn(jsonPath, "query");

      jsonPathSpy.mockImplementation(() => {
        return [];
      });
      try{
        generalInfo.getGeneralInfo("page")
      }catch(error){
        expect(error).toEqual(Error("Não foi possivel localizar as informações gerais"))
      }

      expect(jsonPathSpy).toHaveBeenCalled();
    });
    it("should return general info pdf when has generation balance", () => {
      const jsonPathSpy = jest.spyOn(jsonPath, "query");

      jsonPathSpy.mockImplementation(() => {
        return [
          {
            R: [
              {
                T: "SALDO%20ATUAL%20DE%20GERA%C3%87%C3%83O%3A%2010.205%2C81%20kWh%20FP%2F%C3%9Anico%2C%2037%2C75%20kWh%20ponta",
              },
            ],
          },
          {
            R: [
              {
                T: "SALDO%20ATUAL%20DE%20GERA%C3%87%C3%83O%3A%2010.205%2C81%20kWh%20FP%2F%C3%9Anico%2C%2037%2C75%20kWh%20ponta",
              },
            ],
          },
        ];
      });
      const response = generalInfo.getGeneralInfo("page");

      expect(jsonPathSpy).toHaveBeenCalled();
      expect(response).toEqual(
        "SALDO ATUAL DE GERAÇÃO: 10.205,81 kWh FP/Único, 37,75 kWh pontaSALDO ATUAL DE GERAÇÃO: 10.205,81 kWh FP/Único, 37,75 kWh ponta"
      );
    });
  });
  describe("getGenerationBalance", () => {
    it("should return general info pdf", () => {
      const getGeneralInfoSpy = jest.spyOn(generalInfo, "getGeneralInfo");
      getGeneralInfoSpy.mockReturnValueOnce(
        "SALDO ATUAL DE GERAÇÃO: 10.205,81 kWh FP/Único, 37,75 kWh ponta. Tarifa vigente conforme Res Aneel nº 3.046, de 21/06/2022. Unidade faz parte de sistema de compensação de energia. O pagamento desta conta não quita débitos anteriores. Para estes, estão sujeitas penalidades legais vigentes (multas) e/ou atualização financeira (juros)baseadas no vencimento das mesmas. É dever do consumidor manter os dados cadastrais sempre atualizados e informar alterações da atividade exercida no local. Faça sua adesão para recebimento da co"
      );
      const response = generalInfo.getGenerationBalance('page')

      expect(response).toEqual(10205.81)
      expect(getGeneralInfoSpy).toHaveBeenCalled()

    });
    it("should return zero when not has generation balance", () => {
      const getGeneralInfoSpy = jest.spyOn(generalInfo, "getGeneralInfo");
      getGeneralInfoSpy.mockReturnValueOnce(
        "Tarifa vigente conforme Res Aneel nº 3.046, de 21/06/2022.Redução aliquota ICMS conforme Lei Complementar 194/22. Base de cálculo reduzida nas componentes Distribuição, Transmissão e Encargos conf. art. 2º da Lei n.º 194/22 Unidade faz parte de sistema de compensação de energia. O pagamento desta conta não quita débitos anteriores. Para estes, estão sujeitas penalidades legais vigentes (multas) e/ou atualização financeira (juros)baseadas no vencimento das mesmas. Leitura realizada conforme calendário de faturamento. É dever do consumidor manter os dados cadastrais sempre atualizados e informar alterações da atividade exercida no local. DEZ/22 Band. Verde - JAN/23 Band. Verde."
      );
      const response = generalInfo.getGenerationBalance('page')

      expect(response).toEqual(0)
      expect(getGeneralInfoSpy).toHaveBeenCalled()

    });
  });
});
