import { CreateShipmentDto } from "./dto";
import { Shipment } from "./types";
import axios, { AxiosInstance } from "axios";

export class ShipmondoService {
  private client: AxiosInstance;

  constructor(baseUrl: string, username: string, password: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      auth: {
        username,
        password,
      },
    });
  }

  async createShipment(dto: CreateShipmentDto): Promise<Shipment> {
    const response = await this.client.post<Shipment>("/shipments", dto);
    return response.data;
  }
}
