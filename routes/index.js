const express = require("express");
const db = require('../database');

const controllers = require('../controllers');

const routes = function() {
    const apiRoute = express.Router();

    const matchController = controllers.matchController(db);

    apiRoute.route("/matches").get(matchController.fetchMatches);
    apiRoute.route("/matchinfo").get(matchController.fetchMatchesInfo);
    

    return apiRoute;
}

module.exports = routes;