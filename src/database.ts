import { Sequelize } from "sequelize-typescript";
import {
  BalanceChangeModel,
  BalanceModel,
  ParcelAttributes,
  ParcelModel,
  ShipmentModel,
} from "./models";
import { Balance, Shipment } from "./types";
import { toHundredths } from "./utils";
import { Op } from "sequelize";

export class Database {
  private db: Sequelize;

  constructor() {
    this.db = new Sequelize({
      dialect: "sqlite",
      storage: "db.sql",
      models: [ShipmentModel, ParcelModel, BalanceModel, BalanceChangeModel],
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
      balance: Math.floor(balance.amount * 100),
      currencyCode: balance.currency_code,
      updatedAt: new Date(balance.updated_at),
    });
  }

  async saveBalanceChange(
    amount: string,
    positive: boolean,
    updatedAt: Date,
  ): Promise<void> {
    await BalanceChangeModel.create({
      amount: (positive ? 1 : -1) * toHundredths(amount),
      updatedAt: updatedAt,
    });
  }

  async getBalanceChange(from?: Date): Promise<BalanceChangeModel[]> {
    const where: { updatedAt?: object } = {};
    if (from) {
      where.updatedAt = { [Op.gt]: from };
    }

    return BalanceChangeModel.findAll({
      where,
      order: [["updatedAt", "DESC"]],
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
