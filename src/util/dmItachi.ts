import { APIMessageContentResolvable, Client, MessageAdditions, MessageOptions } from "discord.js";

export async function dmItachi(client: Client, text: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions) {
  const ch = client.users.resolve('318014316874039306').dmChannel;
  if (ch) {
    await ch.send(text);
  }
}
