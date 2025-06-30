import { Command } from "commander";
import { CommandContext } from "../types";

export function getBalanceCommand(context: CommandContext) {
  const { database, service } = context;

  const command = new Command("balance").exitOverride();

  command
    .command("get")
    .description("Get the estimated balance")
    .action(async () => {
      let newestBalance = await context.database.getNewestBalance();

      if (newestBalance === null) {
        console.log("No balance found, fetching from API...");
        const balance = await context.service.getBalance();
        newestBalance = await context.database.saveBalance(balance);
      }

      console.log(
        "Last balance:\t\t" +
          newestBalance.balance / 100 +
          " " +
          newestBalance.currencyCode,
      );

      const changes = await database.getBalanceChange(newestBalance.updatedAt);

      const currentBalance =
        newestBalance.balance +
        changes.reduce((sum, change) => sum + change.amount, 0);

      console.log(
        "Estimated balance:\t" +
          currentBalance / 100 +
          " " +
          newestBalance.currencyCode,
      );
    });

  command
    .command("update")
    .description("Update the balance using the API")
    .action(async () => {
      const balance = await service.getBalance();
      await database.saveBalance(balance);

      console.log("Updated balance");
    });

  return command;
}
