import { Command } from "commander";
import { CommandContext } from "../types";

export function getShipmentsCommand(context: CommandContext) {
  const { database, service } = context;

  const command = new Command("shipment").exitOverride();

  command
    .command("list")
    .description("List shipments from the database")
    .action(async () => {
      throw new Error("Not implemented yet");
    });

  command
    .command("create")
    .description("Create a new shipment")
    .action(async () => {
      const shipment = await service.createShipment({
        own_agreement: false,
        product_code: "GLSDK_SD",
        service_codes: "EMAIL_NT",
        sender: {
          name: "Nicklas",
          address1: "Hvilehøjvej 25",
          zipcode: "5220",
          city: "Odense SØ",
          country_code: "DK",
        },
        receiver: {
          name: "Nicklas",
          address1: "Hvilehøjvej 25",
          zipcode: "5220",
          city: "Odense SØ",
          country_code: "DK",
          email: "nicklas@example.com",
        },
        parcels: [
          {
            weight: 1000,
          },
        ],
        automatic_select_service_point: true,
      });

      console.log("Created shipment " + shipment.id);

      await database.saveShipment(shipment);

      console.log("Saved shipment ");

      await database.saveBalanceChange(
        shipment.price,
        false,
        new Date(shipment.updated_at),
      );

      console.log("Saved balance change");
    });

  return command;
}
