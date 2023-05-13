var express = require('express');
var router = express.Router();

const User = require('../models/userSchema.js');

/* GET users listing. */
router.get('/:name', async (request, response) => {
  let name = request.params.name;

  let user = await User.find({ name: name }).exec();
  response.status(200).send(user);
});

router
  .post(
      '/',
      async (request, response) => {
        var user = new User({
          name: request.body.name,
          email: request.body.email,
        });
      
        await user.save();
        response.status(201).send();
      }
    );


module.exports = router;
