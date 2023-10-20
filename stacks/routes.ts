const bot = {
  "GET /bot": "packages/functions/src/bot.list",
  "GET /bot/{id}": "packages/functions/src/bot.get",
  "POST /bot": "packages/functions/src/bot.create",
  "PATCH /bot/{id}": "packages/functions/src/bot.update",
  "DELETE /bot/{id}": "packages/functions/src/bot.remove",
}
export default {
  ...bot,
  $default: "packages/functions/src/default.main",
};