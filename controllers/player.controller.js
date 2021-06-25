const playerController = (DATABASES) => {

    const fetchAllPlayers = async (req, res, next) => {
        try {
            const playersArray = Array();
            const players1 = await DATABASES.planetmansDb("ScrimMatchParticipatingPlayer")
                .select("*");
            players1.forEach(player => {
                playersArray.push(player)
            })
            const players2 = await DATABASES.euSpringScrimsDb("ScrimMatchParticipatingPlayer")
                .select("*");
            players2.forEach(player => {
                playersArray.push(player)
            })
            return res.status(200).json(playersArray);
        } catch (error) {
            return res.status(500).json({message: `${JSON.stringify(error)}`});

        }
    }

    const fetchPlayerMatches = async (req, res, next) => {
        try {
            const matches = await DATABASES.planetmansDb("ScrimMatchParticipatingPlayer").where('CharacterId', req.params.characterId).select('*');
            return res.status(200).json(matches);
        } catch (error) {
            return res.status(500).json({message: `${JSON.stringify(error)}`});

        }
    }
    const fetchPlayerMatchesStats = async (req, res, next) => {
        try {
            const matches = await DATABASES.planetmansDb("View_ScrimMatchReportInfantryPlayerRoundStats").where('CharacterId', req.params.characterId).select('*');
            return res.status(200).json(matches);
        } catch (error) {
            return res.status(500).json({message: `${JSON.stringify(error)}`});

        }
    }

    const fetchPlayerKillboard = async (req, res, next) => {
        try {
            const playerId = req.params.characterId;
            const kills = Array();
            const deaths = Array();
            const player = {};
            const kill1 = await DATABASES.planetmansDb('ScrimDeath').where('AttackerCharacterId', playerId).select('*');
            kills.push(kill1);
            const death1 = await DATABASES.planetmansDb('ScrimDeath').where('VictimCharacterId', playerId).select('*');
            deaths.push(death1);
            const kill2 = await DATABASES.euSpringScrimsDb('ScrimDeath').where('AttackerCharacterId', playerId).select('*');
            kills.push(kill2);
            const death2 = await DATABASES.euSpringScrimsDb('ScrimDeath').where('VictimCharacterId', playerId).select('*');
            deaths.push(death2);
            player.kill = kills;
            player.death = deaths;
            return res.status(200).json(player);
        } catch (error) {
            return res.status(500).json({message: `${JSON.stringify(error)}`});

        }
    }

    const fetchPlayerInfantryStats = async (req, res, next) => {
        try {
        } catch (error) {
            return res.status(500).json({message: `${JSON.stringify(error)}`});
        }

    }

    const findPlayerByName = async (req, res, next) => {
        try {
            const playerName = req.params.characterName;


            let pilChars = await DATABASES.planetmansDb('View_ScrimMatchReportInfantryPlayerStats').where('NameDisplay', 'like', '%' + playerName + '%').select('*');
            let euSpring = await DATABASES.euSpringScrimsDb('View_ScrimMatchReportInfantryPlayerStats').where('NameDisplay', 'like', '%' + playerName + '%').select('*');

            let matches = pilChars.concat(euSpring)
            return res.status(200).json(matches);


        } catch (error) {
            return res.status(500).json({message: `${JSON.stringify(error)}`});
        }
    }

    const getPlayerWeaponStatsByPlayerName = async (req, res, next) => {
        try {
            const playerName = req.params.characterName;
            let query = `
                                SELECT 
                                WeaponId,
                                WeaponName,
                                SUM(Kills) as kills,
                                COUNT(WeaponId) as match_usages, 
                                SUM(HeadshotKills) as headshots, 
                                SUM(Deaths) as deaths, 
                                SUM(HeadshotDeaths) as headshotDeaths,
                                SUM(Teamkills) as teamkills, 
                                SUM(AssistedKills) as assistedkills
                            FROM View_ScrimMatchReportInfantryPlayerWeaponStats
                            WHERE NameDisplay LIKE ?
                            GROUP BY WeaponId, WeaponName
                            ORDER BY WeaponId`
            let pilWeapons = await DATABASES.planetmansDb.raw(query,['%'+playerName+'%'])
            let euSpringWeapons = await DATABASES.euSpringScrimsDb.raw(query,['%'+playerName+'%'])
            console.log(pilWeapons.length);
            console.log(euSpringWeapons.length);

            let weaponStats = pilWeapons.concat(euSpringWeapons)
            let weaponsArray = {};
            weaponStats.forEach( item => {
                weapon = weaponsArray[item.WeaponId]
                if(weapon) {
                        weapon.kills+= item.kills,
                        weapon.headshots+= item.headshots,
                        weapon.deaths+= item.deaths,
                        weapon.headshotDeaths+= item.headshotDeaths,
                        weapon.teamKill+= item.teamKill,
                        weapon.assistedkills+= item.assistedkills
                }else {
                    weaponsArray[item.WeaponId] = {
                        weaponId: item.WeaponId,
                        weaponName: item.WeaponName,
                        kills: item.kills,
                        headshots: item.headshots,
                        deaths: item.deaths,
                        headshotDeaths: item.headshotDeaths,
                        teamKill: item.teamKill,
                        assistedkills: item.assistedkills,
                    }
                }
            })


            return res.status(200).json(weaponsArray);
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: `${JSON.stringify(error)}`});
        }
    }

    return {
        fetchAllPlayers,
        fetchPlayerMatches,
        fetchPlayerMatchesStats,
        fetchPlayerKillboard,
        findPlayerByName,
        getPlayerWeaponStatsByPlayerName
        //fetchPlayerInfantryStats
    };
}

module.exports = playerController;