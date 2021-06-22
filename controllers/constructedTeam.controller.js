const constructedTeamController = (DATABASES) => {

    const fetchAllTeams = async (req, res, next) => {
        try {
            const teams = Array();
            const planetmansTeams = await DATABASES.planetmansDb("constructedTeam").select("*");
            planetmansTeams.forEach(async (team) => {
                teams.push(team);
            })
            const euSpringTeams = await DATABASES.euSpringScrimsDb("constructedTeam").select("*");
            euSpringTeams.forEach(async (team) => {
                teams.push(team);
            })

            return res.status(200).json(teams);
        } catch (error) {
            return res.status(500).json({ message: `${JSON.stringify(error)}` });
        }
    }

    const fetchTeamPlayers = async (req, res, next) => {
        try {

        } catch (error) {
            return res.status(500).json({ message: `${JSON.stringify(error)}` });
        }
    }

    return {
        fetchAllTeams
    };
}

module.exports = constructedTeamController;