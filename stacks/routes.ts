const hello = {
    "GET /public": {
        function: "packages/functions/src/public.main",
        authorizer: "none",
    },
}

// Bot routes
const bot = {
    "GET /bot": "packages/functions/src/bot/list.main",
    "GET /bot/{id}": "packages/functions/src/bot/get.main",
    "POST /bot": "packages/functions/src/bot/create.main",
    "POST /bot/search": "packages/functions/src/bot/find.main",
    "PATCH /bot/{id}": "packages/functions/src/bot/update.main",
    "DELETE /bot/{id}": "packages/functions/src/bot/remove.main",
}

// Customer routes
const customer = {
    "GET /customer": "packages/functions/src/customer/list.main",
    "GET /customer/{id}": "packages/functions/src/customer/get.main",
    "POST /customer": "packages/functions/src/customer/create.main",
    "POST /customer/search": "packages/functions/src/customer/find.main",
    "PATCH /customer/{id}": "packages/functions/src/customer/update.main",
    "DELETE /customer/{id}": "packages/functions/src/customer/remove.main",
}

// DO NOT REMOVE THIS LINE: PLOP ROUTE DEFINITION

export default {
    ...hello,
    ...bot,
    ...customer,
// DO NOT REMOVE THIS LINE: PLOP ROUTE IMPORT
    $default: "packages/functions/src/default.main",
};