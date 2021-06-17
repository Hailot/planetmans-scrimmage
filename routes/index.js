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
    apiRoute.route('/match/:scrimMatchId/result').get(matchController.fetchMatchResults);
    apiRoute.route('/match/:scrimMatchId/players').get(matchController.fetchMatchPlayers);
    apiRoute.route('/match/:scrimMatchId/players/stats').get(matchController.fetchMatchPlayersStats);



    apiRoute.route("/players").get(playerController.fetchAllPlayers);
    apiRoute.route("/players/:characterId/matches").get(playerController.fetchPlayerMatches);
    

    return apiRoute;
}

module.exports = routes;