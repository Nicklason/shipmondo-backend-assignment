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
