const express = require('express');
const BoletoHandler = require('./../services/handlers/boleto');

const routes = express.Router();

routes.get('/boleto/:digitableLine', BoletoHandler.get)

module.exports = routes;
