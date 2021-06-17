const express = require("express");
const db = require('../database');

const controllers = require('../controllers');

const routes = function() {
    const apiRoute = express.Router();

    const matchController = controllers.matchController(db);
    const playerController = controllers.playerController(db);
    const teamController = controllers.constructedTeamController(db);

    apiRoute.route("/matches").get(matchController.fetchMatches);
    apiRoute.route("/matchinfo").get(matchController.fetchMatchesInfo);

    apiRoute.route("/players").get(playerController.fetchAllPlayers);
    

    return apiRoute;
}

module.exports = routes;