const model = require('../model');
const router = require('express').Router();

// router.get(
//     '/users',
//     (request, response) => {
//         try {
//             const users = model.getUsers();
//             response.json(users);
//         } catch (exception) {
//             console.error(exception);
//             response.status(500).end();
//     }
// )

router.post(
    '/users',
    (request, response) => {
        try {
            const user = request.body;
            
            if (!user.name)
                return console.error('User got no name');
            
            if (!user.email)
                return console.error('User got no email');
            
            if (!user.password)
                return console.error('User got no password');

            model.createUser(user);
            response.json(user);
        } catch (exception) {
            console.error(exception);
            response.status(500).end();
        }
    }
)

module.exports = router;