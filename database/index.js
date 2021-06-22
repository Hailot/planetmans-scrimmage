const planetmansDb = require('./planetmansDbContext');
const euSpringScrimsDb = require('./euSpringScrimsContext');

async function determineOrigDbfromMatchId(matchId) {
    const planetmans = await planetmansDb("ScrimMatch").select('Id').where('Id',matchId);
    if(planetmans.length > 0) {
        return planetmansDb
    } else {
        const euSpring = await euSpringScrimsDb("ScrimMatch").select('Id').where('Id',matchId);
        if(euSpring.length > 0) {
            return euSpringScrimsDb
        }
    }
}
async function determineOrigDbFromTeamName(teamName) {
    const planetmans = await planetmansDb("ConstructedTeam").select('Id').where('Name',teamName);
    if(planetmans.length > 0) {
        return planetmansDb
    } else {
        const euSpring = await euSpringScrimsDb("ConstructedTeam").select('Id').where('Name',teamName);
        if(euSpring.length > 0) {
            return euSpringScrimsDb
        }
    }
}

module.exports = {
    planetmansDb,
    euSpringScrimsDb,
    determineOrigDbfromMatchId,
    determineOrigDbFromTeamName
};