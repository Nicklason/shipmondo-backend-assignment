import { Database } from "./database";
import { ShipmondoService } from "./service";

async function main() {
  const API_URL =
    process.env.SHIPMONDO_API_URL ??
    "https://sandbox.shipmondo.com/api/public/v3";
  const USERNAME = process.env.SHIPMONDO_API_USERNAME;
  const PASSWORD = process.env.SHIPMONDO_API_PASSWORD;

  if (!USERNAME || !PASSWORD) {
    throw new Error(
      "Missing environment variables: SHIPMONDO_API_USERNAME or SHIPMONDO_API_PASSWORD",
    );
  }

  const database = new Database();
  await database.sync();

  const service = new ShipmondoService(API_URL, USERNAME, PASSWORD);

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

  await database.saveShipment(shipment);

  console.log("Created shipment " + shipment.id);

  const [newestBalance, balance] = await Promise.all([
    database.getNewestBalance(),
    service.getBalance(),
  ]);

  if (
    newestBalance === null ||
    newestBalance.updatedAt.getTime() < new Date(balance.updated_at).getTime()
  ) {
    await database.saveBalance(balance);
    console.log("Updated balance");
  }
}

main().catch(console.error);
