export interface Shipment {
  id: string;
  price: string;
  parcels: Parcel[];
}

export interface Parcel {
  pkg_no: string;
  pkg_nos: string[];
}
