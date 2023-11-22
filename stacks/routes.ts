const hello = {
    "GET /public": {
        function: "packages/functions/src/public.main",
        authorizer: "none",
    },
}

// Bot routes -do not modify this plop comment-
const bot = {
    "GET /bot": "packages/functions/src/bot/list.main",
    "GET /bot/{id}": "packages/functions/src/bot/get.main",
    "POST /bot": "packages/functions/src/bot/create.main",
    "POST /bot/search": "packages/functions/src/bot/search.main",
    "PATCH /bot/{id}": "packages/functions/src/bot/update.main",
    "DELETE /bot/{id}": "packages/functions/src/bot/remove.main",
}

// Customer routes -do not modify this plop comment-
const customer = {
    "GET /customer": "packages/functions/src/customer/list.main",
    "GET /customer/{id}": "packages/functions/src/customer/get.main",
    "POST /customer": "packages/functions/src/customer/create.main",
    "POST /customer/search": "packages/functions/src/customer/search.main",
    "PATCH /customer/{id}": "packages/functions/src/customer/update.main",
    "DELETE /customer/{id}": "packages/functions/src/customer/remove.main",
}

// Company routes -do not modify this plop comment-
const company = {
    "GET /company": "packages/functions/src/company/list.main",
    "GET /company/{id}": "packages/functions/src/company/get.main",
    "POST /company": "packages/functions/src/company/create.main",
    "POST /company/search": "packages/functions/src/company/search.main",
    "PATCH /company/{id}": "packages/functions/src/company/update.main",
    "DELETE /company/{id}": "packages/functions/src/company/remove.main",
}

// AlertType routes -do not modify this plop comment-
const alert_type = {
    "GET /alert_type": "packages/functions/src/alert_type/list.main",
    "GET /alert_type/{id}": "packages/functions/src/alert_type/get.main",
    "POST /alert_type": "packages/functions/src/alert_type/create.main",
    "POST /alert_type/search": "packages/functions/src/alert_type/search.main",
    "PATCH /alert_type/{id}": "packages/functions/src/alert_type/update.main",
    "DELETE /alert_type/{id}": "packages/functions/src/alert_type/remove.main",
}

// DO NOT REMOVE THIS LINE: PLOP ROUTE DEFINITION              

export default {
    ...hello,
    ...bot,
    ...customer,
    ...company,
    ...alert_type,
// DO NOT REMOVE THIS LINE: PLOP ROUTE IMPORT
    $default: "packages/functions/src/default.main",
};