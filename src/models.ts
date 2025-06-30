import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  HasMany,
  BelongsTo,
  ForeignKey,
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
