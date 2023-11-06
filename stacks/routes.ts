const hello = {
    "GET /public": {
        function: "packages/functions/src/public.main",
        authorizer: "none",
    },
}
const bot = {
    "GET /bot": "packages/functions/src/bot/list.main",
    "GET /bot/{id}": "packages/functions/src/bot/get.main",
    "POST /bot": "packages/functions/src/bot/create.main",
    "PATCH /bot/{id}": "packages/functions/src/bot/update.main",
    "DELETE /bot/{id}": "packages/functions/src/bot/remove.main",
}
export default {
    ...hello,
    ...bot,
    $default: "packages/functions/src/default.main",
};