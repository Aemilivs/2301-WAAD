const model = require('./model');
const router = require('express').Router();

router.get(
    '/users',
    (request, response) => {
        try {
            const users = model.getUsers();
            response.json(users);
        } catch (exception) {
            console.error(exception);
            response.status(500).end();
        }
    }
)

module.exports = router;