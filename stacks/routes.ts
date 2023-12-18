// Bot routes -do not modify this plop comment-
const crud = {
    "GET /{entity}": "packages/functions/src/crud/list.main",
    "GET /{entity}/{id}": "packages/functions/src/crud/get.main",
    "POST /{entity}": "packages/functions/src/crud/create.main",
    "POST /{entity}/search": "packages/functions/src/crud/search.main",
    "PATCH /{entity}/{id}": "packages/functions/src/crud/update.main",
    "DELETE /{entity}/{id}": "packages/functions/src/crud/remove.main",
}

const bot_location = {
    "GET /bot_location/{bot_uuid}": "packages/functions/src/api/bot_location.main",
}

export default [
    crud,
    bot_location,
];