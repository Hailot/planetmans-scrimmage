const dbHelper = require('../utils/dbhelper.util');
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
      const matchId = req.params.scrimMatchId;
      const db = await DATABASES.determineOrigDbfromMatchId(matchId);
      const results = await db("ScrimMatchTeamResult")
        .where({ ScrimMatchId: req.params.scrimMatchId })
        .select("*");
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const fetchMatchPlayers = async (req, res, next) => {
    try {
      const matchId = req.params.scrimMatchId;
      const db = await DATABASES.determineOrigDbfromMatchId(matchId);
      const players = {};
      players.team1 = await db(
        "ScrimMatchParticipatingPlayer"
      )
        .where({ ScrimMatchId: req.params.scrimMatchId, TeamOrdinal: 1 })
        .select("*");
      players.team2 = await db(
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
      const matchId = req.params.scrimMatchId;
      const db = await DATABASES.determineOrigDbfromMatchId(matchId);
      let matchPlayers = await db(
          'ScrimMatchParticipatingPlayer')
          .where({ ScrimMatchId: req.params.scrimMatchId})
          .select('*')
      let players = await Promise.all(
          matchPlayers.map(async player => {
            let playerStat= {};
            playerStat.team = player.TeamOrdinal;
            playerStat.total = await db(
                'View_ScrimMatchReportInfantryPlayerStats'
            ).where({ ScrimMatchId:req.params.scrimMatchId, CharacterId: player.CharacterId})
                .select('*');
            playerStat.perRound = await db(
                'View_ScrimMatchReportInfantryPlayerRoundStats'
            ).where({ ScrimMatchId:req.params.scrimMatchId, CharacterId: player.CharacterId})
                .select('*');
            return playerStat;
          })
      )
      console.log(players)
      let sortedPlayers = {
        team1: [],
        team2: []
      };
      players.forEach(player => {
        switch (player.team) {
          case 1:
            sortedPlayers.team1.push(player);
            break;
          case 2:
            sortedPlayers.team2.push(player);
            break;
          default:
            break
        }
      })
      return res.status(200).json(sortedPlayers);
    } catch (error) {
      return res.status(500).json({ message: `${JSON.stringify(error)}` });
    }
  };

  const fetchMatchPlayersKillboard = async (req, res, next) => {
      try {
        const matchId = req.params.scrimMatchId;
        const db = await DATABASES.determineOrigDbfromMatchId(matchId);
        const players = {};
        const team1 = {};
        const team2 = {};
        team1.death = await db("ScrimDeath").where({ScrimMatchId: matchId, VictimTeamOrdinal: 1}).select('*');
        team1.kill = await db("ScrimDeath").where({ScrimMatchId: matchId, AttackerTeamOrdinal: 1}).select('*');
        players.team1 = team1;
        team2.death = await db("ScrimDeath").where({ScrimMatchId: matchId, VictimTeamOrdinal: 2}).select('*');
        team2.kill = await db("ScrimDeath").where({ScrimMatchId: matchId, AttackerTeamOrdinal: 2}).select('*');
        players.team2 = team2;

        //players.team2 = await DATABASES.planetmansDb("ScrimDeath").where({ScrimMatchId: matchId, AttackerTeamOrdinal: 2}).select('*');
        return res.status(200).json(players );
      } catch (error) {

        return res.status(500).json({ message: `${JSON.stringify(error)}` });

      }
  }

  const fetchMatchesInfo = async (req, res, next) => {
    try {
      const matchesArray = Array();
      const matches1 = await DATABASES.planetmansDb.raw(
        "SELECT config1.ScrimMatchId,       MAX(StartTime) StartTime,       MAX(config1.Title) Title,       MAX(config1.ScrimMatchRound) RoundCount,       MAX(ruleset.Id) RulesetId,       MAX(ruleset.Name) RulesetName,       MAX(world.Id) WorldId,       MAX(world.Name) WorldName,       MAX(facility.FacilityId) FacilityId,       MAX(facility.FacilityName) FacilityName,       MAX( CASE WHEN team_factions.TeamOrdinal = 1 THEN team_factions.FactionId ELSE 0 END ) TeamOneFactionId,       MAX( CASE WHEN team_factions.TeamOrdinal = 2 THEN team_factions.FactionId ELSE 0 END ) TeamTwoFactionId  FROM ScrimMatchRoundConfiguration config1    INNER JOIN ScrimMatchRoundConfiguration config2      ON ( config1.ScrimMatchId = config2.ScrimMatchId           AND config1.ScrimMatchRound >= config2.ScrimMatchRound )    INNER JOIN ScrimMatch match      ON config1.ScrimMatchId = match.Id    INNER JOIN Ruleset Ruleset      ON match.RulesetId = ruleset.Id    INNER JOIN World world      ON config1.WorldId = world.Id    LEFT OUTER JOIN MapRegion facility      ON config1.FacilityId = facility.FacilityId    LEFT OUTER JOIN ( SELECT match_players.ScrimMatchId, match_players.TeamOrdinal, MAX(match_players.FactionId) FactionId                        FROM ScrimMatchParticipatingPlayer match_players                        WHERE match_players.TeamOrdinal IN ( 1, 2 )                        GROUP BY match_players.ScrimMatchId, match_players.TeamOrdinal ) team_factions      ON config1.ScrimMatchId = team_factions.ScrimMatchId  WHERE config1.ScrimMatchRound >= config2.ScrimMatchRound GROUP BY config1.ScrimMatchId;"
      );
      matches1.forEach(async (match) => {
        matchesArray.push(match);
      });
      const matches2 = await DATABASES.euSpringScrimsDb.raw(
        "SELECT config1.ScrimMatchId,       MAX(StartTime) StartTime,       MAX(config1.Title) Title,       MAX(config1.ScrimMatchRound) RoundCount,       MAX(ruleset.Id) RulesetId,       MAX(ruleset.Name) RulesetName,       MAX(world.Id) WorldId,       MAX(world.Name) WorldName,       MAX(facility.FacilityId) FacilityId,       MAX(facility.FacilityName) FacilityName,       MAX( CASE WHEN team_factions.TeamOrdinal = 1 THEN team_factions.FactionId ELSE 0 END ) TeamOneFactionId,       MAX( CASE WHEN team_factions.TeamOrdinal = 2 THEN team_factions.FactionId ELSE 0 END ) TeamTwoFactionId  FROM ScrimMatchRoundConfiguration config1    INNER JOIN ScrimMatchRoundConfiguration config2      ON ( config1.ScrimMatchId = config2.ScrimMatchId           AND config1.ScrimMatchRound >= config2.ScrimMatchRound )    INNER JOIN ScrimMatch match      ON config1.ScrimMatchId = match.Id    INNER JOIN Ruleset Ruleset      ON match.RulesetId = ruleset.Id    INNER JOIN World world      ON config1.WorldId = world.Id    LEFT OUTER JOIN MapRegion facility      ON config1.FacilityId = facility.FacilityId    LEFT OUTER JOIN ( SELECT match_players.ScrimMatchId, match_players.TeamOrdinal, MAX(match_players.FactionId) FactionId                        FROM ScrimMatchParticipatingPlayer match_players                        WHERE match_players.TeamOrdinal IN ( 1, 2 )                        GROUP BY match_players.ScrimMatchId, match_players.TeamOrdinal ) team_factions      ON config1.ScrimMatchId = team_factions.ScrimMatchId  WHERE config1.ScrimMatchRound >= config2.ScrimMatchRound GROUP BY config1.ScrimMatchId;"
      );
      matches2.forEach(async (match) => {
        matchesArray.push(match);
      });

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
    fetchMatchPlayersKillboard
  };
};

module.exports = matchController;
