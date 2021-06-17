const matchController = (DATABASES) => {
  const fetchMatches = async (req, res, next) => {
    try {
      const matchesArray = Array();
      const playersArray = Array();
      const matches1 = await DATABASES.planetmansDb("ScrimMatch")
        .join("ScrimMatchRoundConfiguration", {
          "ScrimMatch.Id": "ScrimMatchRoundConfiguration.ScrimMatchId",
        })
        .select("*");
      matches1.forEach(async (match) => {
        matchesArray.push(match);
      });
      const matches2 = await DATABASES.euSpringScrimsDb("ScrimMatch")
        .join("ScrimMatchRoundConfiguration", {
          "ScrimMatch.Id": "ScrimMatchRoundConfiguration.ScrimMatchId",
        })
        .select("*");
      matches2.forEach(async (match) => {
        matchesArray.push(match);
      });

      return res.status(200).json(matchesArray);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const fetchMatchResults = async (req, res, next) => {
    try {
      const results = await DATABASES.planetmansDb("ScrimMatchTeamResult")
        .where({ ScrimMatchId: req.params.scrimMatchId })
        .select("*");
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const fetchMatchPlayers = async (req, res, next) => {
    try {
      const players = {};
      players.team1 = await DATABASES.planetmansDb(
        "ScrimMatchParticipatingPlayer"
      )
        .where({ ScrimMatchId: req.params.scrimMatchId, TeamOrdinal: 1 })
        .select("*");
      players.team2 = await DATABASES.planetmansDb(
        "ScrimMatchParticipatingPlayer"
      )
        .where({ ScrimMatchId: req.params.scrimMatchId, TeamOrdinal: 2 })
        .select("*");
      return res.status(200).json(players);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };
  const fetchMatchPlayersStats = async (req, res, next) => {
    try {
      const players = {};
      players.team1 = await DATABASES.planetmansDb(
        "View_ScrimMatchReportInfantryPlayerRoundStats"
      )
        .where({ ScrimMatchId: req.params.scrimMatchId, TeamOrdinal: 1 })
        .select("*");
      players.team2 = await DATABASES.planetmansDb(
        "View_ScrimMatchReportInfantryPlayerRoundStats"
      )
        .where({ ScrimMatchId: req.params.scrimMatchId, TeamOrdinal: 2 })
        .select("*");
      return res.status(200).json(players);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const fetchMatchesInfo = async (req, res, next) => {
    try {
      const matchesArray = Array();
      const matches1 = await DATABASES.planetmansDb.raw(
        "SELECT config1.ScrimMatchId,       MAX(StartTime) StartTime,       MAX(config1.Title) Title,       MAX(config1.ScrimMatchRound) RoundCount,       MAX(ruleset.Id) RulesetId,       MAX(ruleset.Name) RulesetName,       MAX(world.Id) WorldId,       MAX(world.Name) WorldName,       MAX(facility.FacilityId) FacilityId,       MAX(facility.FacilityName) FacilityName,       MAX( CASE WHEN team_factions.TeamOrdinal = 1 THEN team_factions.FactionId ELSE 0 END ) TeamOneFactionId,       MAX( CASE WHEN team_factions.TeamOrdinal = 2 THEN team_factions.FactionId ELSE 0 END ) TeamTwoFactionId  FROM ScrimMatchRoundConfiguration config1    INNER JOIN ScrimMatchRoundConfiguration config2      ON ( config1.ScrimMatchId = config2.ScrimMatchId           AND config1.ScrimMatchRound >= config2.ScrimMatchRound )    INNER JOIN ScrimMatch match      ON config1.ScrimMatchId = match.Id    INNER JOIN Ruleset Ruleset      ON match.RulesetId = ruleset.Id    INNER JOIN World world      ON config1.WorldId = world.Id    LEFT OUTER JOIN MapRegion facility      ON config1.FacilityId = facility.FacilityId    LEFT OUTER JOIN ( SELECT match_players.ScrimMatchId, match_players.TeamOrdinal, MAX(match_players.FactionId) FactionId                        FROM ScrimMatchParticipatingPlayer match_players                        WHERE match_players.TeamOrdinal IN ( 1, 2 )                        GROUP BY match_players.ScrimMatchId, match_players.TeamOrdinal ) team_factions      ON config1.ScrimMatchId = team_factions.ScrimMatchId  WHERE config1.ScrimMatchRound >= config2.ScrimMatchRound GROUP BY config1.ScrimMatchId;"
      );
      matchesArray.push(matches1);
      const matches2 = await DATABASES.euSpringScrimsDb.raw(
        "SELECT config1.ScrimMatchId,       MAX(StartTime) StartTime,       MAX(config1.Title) Title,       MAX(config1.ScrimMatchRound) RoundCount,       MAX(ruleset.Id) RulesetId,       MAX(ruleset.Name) RulesetName,       MAX(world.Id) WorldId,       MAX(world.Name) WorldName,       MAX(facility.FacilityId) FacilityId,       MAX(facility.FacilityName) FacilityName,       MAX( CASE WHEN team_factions.TeamOrdinal = 1 THEN team_factions.FactionId ELSE 0 END ) TeamOneFactionId,       MAX( CASE WHEN team_factions.TeamOrdinal = 2 THEN team_factions.FactionId ELSE 0 END ) TeamTwoFactionId  FROM ScrimMatchRoundConfiguration config1    INNER JOIN ScrimMatchRoundConfiguration config2      ON ( config1.ScrimMatchId = config2.ScrimMatchId           AND config1.ScrimMatchRound >= config2.ScrimMatchRound )    INNER JOIN ScrimMatch match      ON config1.ScrimMatchId = match.Id    INNER JOIN Ruleset Ruleset      ON match.RulesetId = ruleset.Id    INNER JOIN World world      ON config1.WorldId = world.Id    LEFT OUTER JOIN MapRegion facility      ON config1.FacilityId = facility.FacilityId    LEFT OUTER JOIN ( SELECT match_players.ScrimMatchId, match_players.TeamOrdinal, MAX(match_players.FactionId) FactionId                        FROM ScrimMatchParticipatingPlayer match_players                        WHERE match_players.TeamOrdinal IN ( 1, 2 )                        GROUP BY match_players.ScrimMatchId, match_players.TeamOrdinal ) team_factions      ON config1.ScrimMatchId = team_factions.ScrimMatchId  WHERE config1.ScrimMatchRound >= config2.ScrimMatchRound GROUP BY config1.ScrimMatchId;"
      );
      matchesArray.push(matches2);

      return res.status(200).json(matchesArray);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  return {
    fetchMatches,
    fetchMatchesInfo,
    fetchMatchResults,
    fetchMatchPlayers,
    fetchMatchPlayersStats,
  };
};

module.exports = matchController;
