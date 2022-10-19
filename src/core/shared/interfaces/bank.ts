export interface BankInfo {
    [key: string]: any;
    _id?: any;
    owner?: string;
    iban: string;
    name: string;
    type: string;
    amount: number;
    logs: Array<{ date: Date; reason: String; from: String; amount: Number }>;
}
