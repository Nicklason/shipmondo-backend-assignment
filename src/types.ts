import { Database } from "./database";
import { ShipmondoService } from "./service";

export interface Shipment {
  id: string;
  updated_at: string;
  price: string;
  parcels: Parcel[];
}

export interface Parcel {
  pkg_no: string;
  pkg_nos: string[];
}

export interface Balance {
  amount: number;
  currency_code: string;
  updated_at: string;
}

export interface CliOptions {
  url: string;
  username: string;
  password: string;
}

export interface CommandContext {
  database: Database;
  service: ShipmondoService;
  options: CliOptions;
}
