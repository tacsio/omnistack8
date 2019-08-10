const express = require('express');
const DevController = require('./controllers/DevController');
const LikeControoller = require('./controllers/LikeController');
const DislikeControoller = require('./controllers/DislikeController');

const routes = express.Router();

//Devs
routes.post('/devs', DevController.store);
routes.get('/devs', DevController.index);

//Likes & Dislikes
routes.post('/devs/:devId/likes', LikeControoller.store);
routes.post('/devs/:devId/dislikes', DislikeControoller.store);


//Test
routes.get('/all', DevController.findAll);

module.exports = routes;