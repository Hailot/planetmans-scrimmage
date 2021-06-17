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
            return res.status(500).json({ message: `${JSON.stringify(error)}` });

        }
    }

    const fetchPlayerMatches = async (req, res, next) => {
        try {
            const matches = await DATABASES.planetmansDb("ScrimMatchParticipatingPlayer").where('CharacterId', req.params.characterId).select('*');
            return res.status(200).json(matches);
        } catch (error) {
            return res.status(500).json({ message: `${JSON.stringify(error)}` });

        }
    }
    const fetchPlayerMatchesStats = async (req, res, next) => {
        try {
            const matches = await DATABASES.planetmansDb("View_ScrimMatchReportInfantryPlayerRoundStats").where('CharacterId', req.params.characterId).select('*');
            return res.status(200).json(matches);
        } catch (error) {
            return res.status(500).json({ message: `${JSON.stringify(error)}` });

        }
    }

    return {
        fetchAllPlayers,
        fetchPlayerMatches,
        fetchPlayerMatchesStats
    };
}

module.exports = playerController;