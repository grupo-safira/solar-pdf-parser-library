export interface IHistory {
  consumption: number;
  monthAndYear: string;
  days: number;
}

export interface IParseResult {
  id: string;
  name: string;
  address: string;
  district: string;
  postalCode: string;
  city: string;
  state: { initials: string; name: string };
  cpf: string;
  _class: TClass;
  consumerUnit: string;
  subclass: string;
  history: IHistory[];
  nextRead: Date;
  amountReg: number;
  hasInjection: boolean;
  competence: string;
  flag: {
    current: string;
    previous: string;
  };
  bankSlip: string;
  automaticDebtCode: string;
  totalInvoice: number | string;
  generationBalance: number;
  dueDate: Date;
  invoicedItems: IInvoicedItems;
  technicalInfo: ITechnicalInfo;
  customerNumber: string
}

export interface IInvoicedItems {
  invoicedItems: {
    field: string;
    x: number;
    y: number;
  }[];
  invoicedItemsUnit: string[];
  invoicedItemsValue: string[];
  energyDistributorItems: IEnergyItem[];
  compensatedEnergyItems: IEnergyItem[];
  injectedEnergyItems: IEnergyItem[];
  availabilityCostItems: IEnergyItem[];
  invoicedItemsUnitTariff: string[];
}

export interface ITechnicalInfo {
  measurement: string;
  previousReading: number;
  currentReading: number;
  constantReading: number;
  consumptionReading: number;
}
export interface IEnergyItem {
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
