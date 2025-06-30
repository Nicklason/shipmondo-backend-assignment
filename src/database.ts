import { Sequelize } from "sequelize-typescript";
import { ParcelAttributes, ParcelModel, ShipmentModel } from "./models";
import { Shipment } from "./types";

export class Database {
  private db: Sequelize;

  constructor() {
    this.db = new Sequelize({
      dialect: "sqlite",
      storage: "db.sql",
      models: [ShipmentModel, ParcelModel],
      logging: false,
    });
  }

  async sync(): Promise<void> {
    await this.db.sync();
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
