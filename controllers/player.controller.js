const playerController = (DATABASES) => {

    const fetchAllPlayers = async (req, res, next) => {
        try {
            const playersArray = Array();
            const players1 = await DATABASES.planetmansDb("ScrimMatchParticipatingPlayer")
                .select("*");
            playersArray.push(players1);
            const players2 = await DATABASES.euSpringScrimsDb("ScrimMatchParticipatingPlayer")
                .select("*");
            playersArray.push(players2);
            return res.status(200).json(playersArray);
        } catch (error) {
            return res.status(500).json({ message: `${JSON.stringify(error)}` });

        }
    }

    return {
        fetchAllPlayers
    };
}

module.exports = playerController;