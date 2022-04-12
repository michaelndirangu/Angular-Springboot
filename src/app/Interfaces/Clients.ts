import { signatory } from "./signatory";

export interface Clients {
    Name: string;
    Registration: string;
    KraPin: string;
    Address: string;
    Email: number;
    PhoneNo: string;
    BusinessNature: number;
    imageUrl: string;
    signatories: signatory;
}