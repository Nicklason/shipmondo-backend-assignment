import { Sequelize } from "sequelize-typescript";
import {
  BalanceModel,
  ParcelAttributes,
  ParcelModel,
  ShipmentModel,
} from "./models";
import { Balance, Shipment } from "./types";

export class Database {
  private db: Sequelize;

  constructor() {
    this.db = new Sequelize({
      dialect: "sqlite",
      storage: "db.sql",
      models: [ShipmentModel, ParcelModel, BalanceModel],
      logging: false,
    });
  }

  async sync(): Promise<void> {
    await this.db.sync();
  }

  async getNewestBalance(): Promise<BalanceModel | null> {
    return BalanceModel.findOne({
      order: [["updatedAt", "DESC"]],
    });
  }

  async saveBalance(balance: Balance): Promise<void> {
    await BalanceModel.create({
      balance: balance.amount,
      currencyCode: balance.currency_code,
      updatedAt: new Date(balance.updated_at),
    });
  }

  async saveShipment(shipment: Shipment): Promise<void> {
    const parcels: ParcelAttributes[] = [];

    // TODO: Fix this. This is pretty dumb.

    for (const parcel of shipment.parcels) {
      for (const packageNumber of parcel.pkg_nos) {
        parcels.push({
          id: packageNumber,
        });
      }
    }

    await ShipmentModel.create(
      {
        id: shipment.id,
        parcels,
      },
      { include: [ParcelModel] },
    );
  }
}
