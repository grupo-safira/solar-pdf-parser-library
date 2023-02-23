export interface IHistory {
  consumo: number;
  mes_ano: string;
  dias: string;
}

export interface IParseResult {
  name: string;
  address: string;
  district: string;
  postal_code: string;
  city: string;
  state: { initials: "MG"; name: string };
  cpf: string;
  tarifa: Number;
  classe: TClass;
  consumer_unit: string;
  installation_number: string;
  subclasse: TSubclass;
  history: { month: string; consumption: number; days: string }[];
  next_read: string;
  amountReg: number;
  hasInjection: Boolean;
}
export interface IItemEnergia {
  description: string;
  unitMeasurement: string;
  quantity: number;
  unitPrice: number;
  value: number;
}

export type TSubclass =
  | "Residencial"
  | "Comercial"
  | "Outros Serviços e Outras Ativ";
export type TClass = "Bifásico" | "Trifásico" | "Monofásico";

export type TFileToParse = any;
