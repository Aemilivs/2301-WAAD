require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    const token = request.headers['authorization'];

    if (!token)
        return response
                .status(400)
                .end();

    jwt
        .verify(
                token, 
                process.env.SECRET, 
                (error, user) => {
                    if (error)
                    {

                        response
                        .status(401)
                        .end();

                        return;
                    }
                            
                    request.user = user.id;
                    next();
                }
            );
}