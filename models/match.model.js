const DATABASES = require('../database');


const Match = function(match) {
    this.Id = match.Id;
    this.Title = match.Title;
    this.StartTime = match.StartTime;

}

Match.findById = (matchId, result) => {

}

Match.getAll = (result) => {
    const matchesArray = Array();
    const pilMatches = DATABASES.planetmansDb("ScrimMatch").select("*");
    matchesArray.push(pilMatches);
    const euSpringMatches = DATABASES.euSpringScrimsDb("ScrimMatch").select("*");
    matchesArray.push(euSpringMatches);
    console.log(matchesArray)
    result(matchesArray);
}

module.exports = Match;