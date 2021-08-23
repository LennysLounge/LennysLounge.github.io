
function Statistics() {
    this.simsRun = 0;
    this.sessionsRun = 0;
    this.racesRun = 0;
    this.drySessions = 0;
    this.wetSessions = 0;
    this.mixedSessions = 0;
    this.dryRaceSessions = 0;
    this.wetRaceSessions = 0;
    this.mixedRaceSessions = 0;
    this.showerLength = [];
    this.sunshineLength = [];
    this.averageShowerLength = 0;
    this.averageSunshineLength = 0;
}

function runStatistics() {
    if (statisticsTimeout !== undefined) {
        clearTimeout(statisticsTimeout);
    }
    statistics = new Statistics();

    let sessionCount = 0;
    for (let i = 0; i < sessionArray.length; i++) if (sessionArray[i] != 0) sessionCount++;

    if (sessionCount > 0) {
        statisticsTimeout = window.setTimeout(() => runSim(999), 0);
    }
    else {
        document.getElementById("statistics").innerHTML = "Add atleast one session to get statistics for sessions.";
    }
}

function runSim(count) {
    if (count > 0) statisticsTimeout = window.setTimeout(() => runSim(count - 1), 0);

    // create new weather sim.
    let rainLevel = parseInt(document.getElementById("rainLevelSlider").value) / 100;
    let cloudLevel = parseInt(document.getElementById("cloudLevelSlider").value) / 100;
    let randomness = parseInt(document.getElementById("randomnessSlider").value);

    let sim = new WeatherSim(rainLevel, cloudLevel, randomness, 27);
    let weekend = []
    for (let t = 0; t < 259200; t += 300)
        weekend[weekend.length] = sim.calculateWeather(t);

    let hasRaceSessions = false;

    // find if a racs is wet, dry or mixed.
    for (let i = 0; i < sessionArray.length; i++) {
        if (sessionArray[i] == 0) continue;
        let dayElement = document.getElementById("sessionDay" + i);
        let hourElement = document.getElementById("sessionHourOfDay" + i);
        let lengthElement = document.getElementById("sessionLength" + i);
        let raceElement = document.getElementById("sessionRace" + i);
        let startTime = (dayElement.selectedIndex * 24 + parseFloat(hourElement.value)) * 60 * 60;
        let finishTime = startTime + parseFloat(lengthElement.value) * 60;
        let startIndex = Math.floor(startTime / 300);
        let finishIndex = min(Math.ceil(finishTime / 300), weekend.length - 1);

        let wetCount = 0;
        for (let j = startIndex; j <= finishIndex; j++) {
            if (weekend[j].rainLevel > 0) wetCount++;
        }
        if (wetCount == 0) statistics.drySessions++;
        else if (wetCount == finishIndex - startIndex + 1) statistics.wetSessions++;
        else statistics.mixedSessions++;

        if (raceElement.checked) {
            hasRaceSessions = true;
            if (wetCount == 0) statistics.dryRaceSessions++;
            else if (wetCount == finishIndex - startIndex + 1) statistics.wetRaceSessions++;
            else statistics.mixedRaceSessions++;
            statistics.racesRun++;
        }
        statistics.sessionsRun++;
    }

    // find shower length
    let isRaining = false;
    let showerLength = 0;
    let sunshineLength = 0;
    for (let i = 0; i < weekend.length; i++) {
        if (weekend[i].rainLevel > 0) {
            if(!isRaining){
                isRaining = true;
                statistics.sunshineLength.push(sunshineLength * 300);
                sunshineLength = 0;
            }
            showerLength++;
        } else {
            if (isRaining) {
                isRaining = false;
                statistics.showerLength.push(showerLength * 300);
                showerLength = 0;
            }
            sunshineLength++;
        }
    }

    // calc average shower length
    if (statistics.showerLength.length > 0) {
        let sum = 0;
        for (let i = 0; i < statistics.showerLength.length; i++) {
            sum += statistics.showerLength[i];
        }
        statistics.averageShowerLength = sum / statistics.showerLength.length;
    }
    // calc average sunshine length
    if (statistics.sunshineLength.length > 0) {
        let sum = 0;
        for (let i = 0; i < statistics.sunshineLength.length; i++) {
            sum += statistics.sunshineLength[i];
        }
        statistics.averageSunshineLength = sum / statistics.sunshineLength.length;
    }

    statistics.simsRun++;
    let text = ""
        + statistics.simsRun + " weekends simulated.<br>"
        + "<b>All session:</b><br>"
        + "Sessions full dry: " + statistics.drySessions + " (" + Math.round(statistics.drySessions / statistics.sessionsRun * 100) + "%)<br>"
        + "Sessions full wet: " + statistics.wetSessions + " (" + Math.round(statistics.wetSessions / statistics.sessionsRun * 100) + "%)<br>"
        + "Sessions mixed: " + statistics.mixedSessions + " (" + Math.round(statistics.mixedSessions / statistics.sessionsRun * 100) + "%)<br>";
    if (hasRaceSessions) {
        text = text
            + "<br><b>Race sessions:</b><br>"
            + "Sessions full dry: " + statistics.dryRaceSessions + " (" + Math.round(statistics.dryRaceSessions / statistics.racesRun * 100) + "%)<br>"
            + "Sessions full wet: " + statistics.wetRaceSessions + " (" + Math.round(statistics.wetRaceSessions / statistics.racesRun * 100) + "%)<br>"
            + "Sessions mixed: " + statistics.mixedRaceSessions + " (" + Math.round(statistics.mixedRaceSessions / statistics.racesRun * 100) + "%)<br>"
            + "<br><b>Average rain shower length:</b> " + asDuration(statistics.averageShowerLength) + "<br>"
            + "<b>Average time between rain shower:</b> " + asDuration(statistics.averageSunshineLength) + "<br>";
    }
    console.log(text);
    document.getElementById("statistics").innerHTML = text;
}
