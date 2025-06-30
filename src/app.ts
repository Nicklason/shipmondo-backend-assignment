import readline from "readline";
import { Command, OptionValues } from "commander";
import { Database } from "./database";
import { ShipmondoService } from "./service";
import { CliOptions } from "./types";
import { getBalanceCommand } from "./commands/balance";
import { getShipmentsCommand } from "./commands/shipments";

function getOptions(values: OptionValues): CliOptions {
  const url = values.url;
  const username = values.username ?? process.env.SHIPMONDO_API_USERNAME;
  const password = values.password ?? process.env.SHIPMONDO_API_PASSWORD;

  if (!username || !password) {
    throw new Error("Missing username and/or password");
  }

  return {
    url,
    username,
    password,
  };
}

async function main() {
  const startup = new Command();
  startup
    .option("-u, --username <username>")
    .option("-p, --password <password>")
    .option(
      "--url <url>",
      "Shipmondo API url",
      "https://sandbox.shipmondo.com/api/public/v3",
    );
  startup.parse(process.argv);

  const database = new Database();
  await database.sync();

  const options = getOptions(startup.opts());

  const service = new ShipmondoService(
    options.url,
    options.username,
    options.password,
  );

  const context = {
    database,
    service,
    options,
  };

  const interactive = new Command();
  interactive.addCommand(getBalanceCommand(context));
  interactive.addCommand(getShipmentsCommand(context));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  rl.prompt();

  rl.on("line", (line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      rl.prompt();
      return;
    }

    const args = trimmed.split(/\s+/);

    interactive
      .exitOverride()
      .parseAsync(args, { from: "user" })
      .catch((err) => {
        console.error(err.message);
      })
      .finally(() => rl.prompt());
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

main().catch(console.error);
