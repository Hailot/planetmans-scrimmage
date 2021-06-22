const db = require('../database');

async function determineOrigDbfromMatchId(matchId) {
    const planetmans = await db.planetmansDb("ScrimMatch").select('Id').where('Id',matchId);
    if(planetmans.length > 0) {
        return 'planetmansDb'
    } else {
        const euSpring = await db.euSpringScrimsDb("ScrimMatch").select('Id').where('Id',matchId);
        if(euSpring.length > 0) {
            return 'euSpringScrimsDb'
        }
    }
}

async function determineOrigDbFromTeamName(teamName) {
    const planetmans = await db.planetmansDb("ConstructedTeam").select('Id').where('Name',teamName);
    if(planetmans.length > 0) {
        return 'planetmansDb'
    } else {
        const euSpring = await db.euSpringScrimsDb("ConstructedTeam").select('Id').where('Name',teamName);
        if(euSpring.length > 0) {
            return 'euSpringScrimsDb'
        }
    }
}

module.exports = {
    determineOrigDbfromMatchId
}