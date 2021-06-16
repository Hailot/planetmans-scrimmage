
const matchController = (DATABASES) => {

    const fetchMatches = async (req, res, next) => {
        try {
            const matchesArray = Array();
            const matches1 = await DATABASES.planetmansDb('ScrimMatch').
            join('ScrimMatchRoundConfiguration',{'ScrimMatch.id':'ScrimMatchRoundConfiguration.ScrimMatchId'}).
            select('*');
            matchesArray.push(matches1);
            const matches2 = await DATABASES.euSpringScrimsDb('ScrimMatch').
            join('ScrimMatchRoundConfiguration',{'ScrimMatch.id':'ScrimMatchRoundConfiguration.ScrimMatchId'}).
            select('*');
            matchesArray.push(matches2);

            return res.status(200).json(matchesArray);
        } catch (error) {
            return res.status(500).json({ message: `${JSON.stringify(error)}` });
        }
    }


    return {
        fetchMatches,
    }
}

module.exports = matchController;