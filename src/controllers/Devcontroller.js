const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [ //Filtro AND
        { _id: { $ne: user } }, //Tira o próprio id do resultado
        { _id: { $nin: loggedDev.likes } }, //Tira id que estao no likes
        { _id: { $nin: loggedDev.dislikes } }, //Tira id que estao nos dislikes
      ],
    })

    return res.json(users);
  },

  async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });

    if (userExists){
      return res.json({ message: 'Este usuário ja foi adicionado' });
    }

    const response = await axios.get(`https://api.github.com/users/${username}`);

    const { name, bio, avatar_url: avatar } = response.data

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    })

    return res.json(dev);
  }
};