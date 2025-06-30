import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  HasMany,
  BelongsTo,
  ForeignKey,
  AutoIncrement,
} from "sequelize-typescript";

export interface ShipmentAttributes {
  id: string;
  parcels: ParcelAttributes[];
}

@Table({ timestamps: false })
export class ShipmentModel extends Model<ShipmentAttributes> {
  @PrimaryKey
  @Column(DataType.STRING)
  id!: string;

  @HasMany(() => ParcelModel)
  parcels!: ParcelModel[];
}

export interface ParcelAttributes {
  id: string;
}

@Table({ timestamps: false })
export class ParcelModel extends Model<ParcelAttributes> {
  @PrimaryKey
  @Column(DataType.STRING)
  id!: string;

  @ForeignKey(() => ShipmentModel)
  @Column(DataType.STRING)
  shipmentId!: string;

  @BelongsTo(() => ShipmentModel)
  shipment!: ShipmentModel;
}

export interface BalanceAttributes {
  balance: number;
  currencyCode: string;
  updatedAt: Date;
}

@Table({ timestamps: false })
export class BalanceModel extends Model<BalanceAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  currencyCode!: string;

  @Column(DataType.INTEGER)
  balance!: number;

  @Column(DataType.DATE)
  updatedAt!: Date;
}

export interface BalanceChangeAttributes {
  amount: number;
  updatedAt: Date;
}

@Table({ timestamps: false })
export class BalanceChangeModel extends Model<BalanceChangeAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.INTEGER)
  amount!: number;

  @Column(DataType.DATE)
  updatedAt!: Date;
}
