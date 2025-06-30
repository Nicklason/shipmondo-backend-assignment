export interface CreateShipmentDto {
  own_agreement: false;
  sender: PartyDto;
  receiver: ReceiverDto;
  automatic_select_service_point: true;
  product_code: string;
  service_codes: string;
  parcels: ParcelDto[];
}

export interface PartyDto {
  name: string;
  address1: string;
  zipcode: string;
  city: string;
  country_code: string;
}

export interface ReceiverDto extends PartyDto {
  email: string;
}

export interface ParcelDto {
  quantity?: number;
  weight: number;
}
