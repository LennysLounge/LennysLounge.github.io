var weatherSim = 0;
var sessionArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var statisticsTimeout;
var statistics = new Statistics();

function setup() {
    let container = document.getElementById("canvasContainer");
    let canvas = createCanvas(container.offsetWidth, container.offsetWidth * 0.6);

    canvas.parent(container);

    ellipseMode(CENTER);

    weatherSim = new WeatherSim(0.2, 0.3, 3, 27);
    weatherSim.calculateWeekend(300);
}

function draw() {
    background(255);
    if (weatherSim === undefined)
        return;

    drawGraphBackground();

    function drawGraph(value) {
        beginShape();
        for (let i = 0; i < weatherSim.getWeekend().length; i++) {
            let uW = (width - 100) / (weatherSim.getWeekend().length - 1);
            let h = value(weatherSim.getWeekend()[i]);
            vertex(50 + uW * i, height - 30 - h);
        }
        endShape();
    }

    noFill();
    stroke(150);
    strokeWeight(3);
    drawGraph(weatherStatus => map(weatherStatus.cloudLevel, 0, 1, 0, height - 80));
    stroke(0, 0, 255);
    drawGraph(weatherStatus => map(weatherStatus.rainLevel, 0, 1, 0, height - 80));

    stroke(0, 255, 0);
    drawGraph(weatherStatus => map(weatherStatus.ambientTemp, 0, 45, 0, height - 80));
    strokeWeight(1);

    fill(0);
    noStroke();
    textAlign(RIGHT, CENTER);
    text("Time:", 200, 10);
    text("Temperature:", 200, 30);
    text("Cloud:", 400, 10);
    text("Rain:", 400, 30);

    if (mouseX > 50 && mouseX < width - 50 && mouseY > 50 && mouseY < height - 30) {
        stroke(0);
        line(mouseX, 50, mouseX, height - 30);

        let t = (mouseX - 50) / (width - 100) * 259200;
        let i = Math.floor(t / (259200 / weatherSim.getWeekend().length));
        let r = weatherSim.getWeekend()[i].rainLevel;
        let c = weatherSim.getWeekend()[i].cloudLevel;
        let at = weatherSim.getWeekend()[i].ambientTemp;
        noStroke();
        fill(150);
        ellipse(mouseX, height - 30 - (height - 80) * c, 10, 10);
        fill(0, 0, 255);
        ellipse(mouseX, height - 30 - (height - 80) * r, 10, 10);
        fill(0, 255, 0);
        ellipse(mouseX, height - 30 - (height - 80) * at / 45, 10, 10);

        fill(0);
        textAlign(LEFT, CENTER);
        text(asTime(t) + ((t%86400) < 43200 ? " AM" : " PM"), 210, 10);
        text(Math.round(at * 100) / 100 + " C", 210, 30);
        text(Math.round(c * 100) / 100, 410, 10);
        text(Math.round(r * 100) / 100, 410, 30);
    }
    else{
        fill(0);
        textAlign(LEFT, CENTER);
        text("-", 210, 10);
        text("-", 210, 30);
        text("-", 410, 10);
        text("-", 410, 30);
    }
}


function drawGraphBackground() {
    strokeWeight(1);
    textFont('Helvetica');
    textAlign(LEFT, CENTER);
    textSize(20);
    noStroke();
    fill(0);

    textAlign(RIGHT, CENTER);
    text("1.0", 40, 50);
    text("0.6", 40, 50 + (height - 80) * 0.4);
    text("0.0", 40, height - 30);

    textAlign(CENTER, CENTER);
    text("FRI", 50 + (width - 100) / 6, height - 10);
    text("SAT", 50 + (width - 100) / 6 * 3, height - 10);
    text("SUN", 50 + (width - 100) / 6 * 5, height - 10);

    stroke(0);
    line(50, 50, 50, height - 30);
    line(width - 50, 50, width - 50, height - 30);
    line(50, height - 30, width - 50, height - 30);

    stroke(200);
    for (let i = 0; i < 10; i++)
        line(50, 50 + (height - 80) * i / 10, width - 50, 50 + (height - 80) * i / 10);

    let uw = (width - 100) / 6;
    for (let i = 1; i < 6; i++)
        line(50 + uw * i, 50, 50 + uw * i, height - 30);

    stroke(0);
    for (let i = 0; i <= 6; i += 2)
        line(50 + uw * i, height - 20, 50 + uw * i, height - 10);

    line(50, height - 10, 50 + uw - 25, height - 10);
    line(50 + uw + 25, height - 10, 50 + uw * 3 - 25, height - 10);
    line(50 + uw * 3 + 25, height - 10, 50 + uw * 5 - 25, height - 10);
    line(50 + uw * 5 + 25, height - 10, 50 + uw * 6, height - 10);

    // find sessions that need to be rendered
    let sessions = [];
    for (let i = 0; i < sessionArray.length; i++) {
        if (sessionArray[i] != 0) {
            let dayElement = document.getElementById("sessionDay" + i);
            let hourElement = document.getElementById("sessionHourOfDay" + i);
            let lengthElement = document.getElementById("sessionLength" + i);
            let raceElement = document.getElementById("sessionRace" + i);
            sessions[sessions.length] = {
                start: (dayElement.selectedIndex * 24 + constrain(parseFloat(hourElement.value), 0, 24)) / 72,
                length: (constrain(parseFloat(lengthElement.value), 0, 1440) / 60) / 72,
                isRace: raceElement.checked
            }
        }
    }
    for (session of sessions) {
        if (session.isRace)
            fill(255, 0, 0, 100);
        else
            fill(0, 255, 0, 100);
        stroke(0, 0, 0, 100);
        rect(50 + (width - 100) * session.start, 50, (width - 100) * session.length, height - 80);
    }

}

function asTime(seconds) {
    s = Math.floor(seconds & 60);
    m = Math.floor((seconds - s) / 60 % 60);
    h = Math.floor(((seconds - s) / 60 - m) / 60 % 24);
    ss = String(s);
    if (s < 10) ss = "0" + ss;
    mm = String(m);
    if (m < 10) mm = "0" + mm;
    hh = String(h);
    if (h < 10) hh = "0" + hh;
    return hh + ":" + mm;
}

function asDuration(seconds) {
    s = Math.floor(seconds & 60);
    m = Math.floor((seconds - s) / 60 % 60);
    h = Math.floor(((seconds - s) / 60 - m) / 60 % 24);
    ss = String(s);
    if (s < 10) ss = "0" + ss;
    mm = String(m);
    if (m < 10) mm = "0" + mm;
    hh = String(h);
    if (h < 10) hh = "0" + hh;
    return hh + "h " + mm + "min";
}

function generateNewWeatherSim() {
    let rainLevel = parseInt(document.getElementById("rainLevelSlider").value) / 100;
    let cloudLevel = parseInt(document.getElementById("cloudLevelSlider").value) / 100;
    let randomness = parseInt(document.getElementById("randomnessSlider").value);
    let temperature = parseInt(document.getElementById("temperatureSlider").value);

    weatherSim = new WeatherSim(rainLevel, cloudLevel, randomness, temperature);
    weatherSim.calculateWeekend(300);
}

/**
 * When a slider has been moved we update or create a new weather sim
 * and update the copy link.
 */
function inputChangedSlider(which) {
    updateCopyLink();

    let srcElement = document.getElementById(["rainLevelSlider", "cloudLevelSlider", "randomnessSlider", "temperatureSlider"][which]);
    let destElement = document.getElementById(["rainLevelSliderValue", "cloudLevelSliderValue", "randomnessSliderValue", "temperatureSliderValue"][which]);

    if (which == 0 || which == 1 || which == 3) {
        let level = parseInt(srcElement.value);
        destElement.innerHTML = level;
        if (which == 0) {
            weatherSim.setRainLevelConfig(level / 100);
            destElement.innerHTML = level / 100;
        }
        else if (which == 1) {
            weatherSim.setCloudLevelConfig(level / 100);
            destElement.innerHTML = level / 100;
        }
        else if (which == 3) {
            weatherSim.setAmbientTempConfig(level);
            destElement.innerHTML = level + "C&#176";
        }
        weatherSim.calculateWeekend(300);
    } else {
        destElement.innerHTML = srcElement.value;
        generateNewWeatherSim();
    }
    runStatistics();
}

function addEmptySession() {
    let dest = document.getElementById("sessionContainer");
    let div = document.createElement("DIV");
    let sessionId = -1;
    for (let i = 0; i < sessionArray.length; i++) {
        if (sessionArray[i] == 0) {
            sessionId = i;
            break;
        }
    }
    if (sessionId == -1) return;

    div.innerHTML =
        "<div class='session'>\
            <b>Session {{{count}}}</b>\
            <button onclick='deleteSession({{{count}}})'>delete</button>\
            <table class='sessionTable'>\
                <tr>\
                    <td>Day:</td>\
                    <td>\
                        <select id='sessionDay{{{count}}}' onchange='updateCopyLink()'>\
                            <option value='Friday'>Friday</option>\
                            <option value='Saturday'>Saturday</option>\
                            <option value='Sunday'>Sunday</option>\
                        </select><br>\
                    </td>\
                    <td>Is Race:</td>\
                    <td><input type='checkbox' id='sessionRace{{{count}}}'  onchange='updateCopyLink();runStatistics()'></td>\
                </tr>\
                <tr>\
                    <td>Hour of day:</td>\
                    <td><input type='number' id='sessionHourOfDay{{{count}}}' value='14'  onchange='updateCopyLink()'></td>\
                    <td>Duration in minutes:</td>\
                    <td><input type='number' id='sessionLength{{{count}}}' value='60'  onchange='updateCopyLink();runStatistics()'></td>\
                </tr>\
            </table>\
        </div>".replaceAll("{{{count}}}", sessionId);

    sessionArray[sessionId] = div;
    dest.appendChild(div);

    runStatistics();

    updateCopyLink();
    return sessionId;
}

function deleteSession(which) {
    if (sessionArray[which] == 0) return;
    sessionArray[which].remove();
    sessionArray[which] = 0;

    runStatistics();

    updateCopyLink();
}

function updateCopyLink() {
    let saveString = document.getElementById("rainLevelSlider").value + ";";
    saveString += document.getElementById("cloudLevelSlider").value + ";";
    saveString += document.getElementById("randomnessSlider").value + ";";
    saveString += document.getElementById("temperatureSlider").value + ";";
    let sessionNumber = 0;
    for (let i = 0; i < sessionArray.length; i++)
        if (sessionArray[i] != 0) sessionNumber++;
    saveString += String(sessionNumber) + ";";

    let weekdaysToIndex = {
        "Friday": 0,
        "Saturday": 1,
        "Sunday": 2
    }

    for (let i = 0; i < sessionArray.length; i++) {
        if (sessionArray[i] == 0) continue;
        saveString += weekdaysToIndex[document.getElementById("sessionDay" + i).value] + ";";
        saveString += document.getElementById("sessionHourOfDay" + i).value + ";";
        saveString += document.getElementById("sessionLength" + i).value + ";";
        saveString += document.getElementById("sessionRace" + i).checked + ";";
    }
    let url = new URL(document.location.href)
    url.searchParams.set("weekend", btoa(saveString));
    document.getElementById("linkContainer").innerHTML = url.toString();
}

function copyLink() {
    navigator.clipboard.writeText(document.getElementById("linkContainer").innerHTML);
    alert("Link copied!")
}

function onBodyLoad() {
    // load the saved weekend from the url and load these settings
    let url = new URL(document.location.href);
    if (url.searchParams.has("weekend")) {
        let saveString = atob(url.searchParams.get("weekend"));
        let params = saveString.split(";");

        document.getElementById("rainLevelSlider").value = params[0];
        document.getElementById("rainLevelSliderValue").innerHTML = params[0] / 100;
        document.getElementById("cloudLevelSlider").value = params[1];
        document.getElementById("cloudLevelSliderValue").innerHTML = params[1] / 100;
        document.getElementById("randomnessSlider").value = params[2];
        document.getElementById("randomnessSliderValue").innerHTML = params[2];
        document.getElementById("temperatureSlider").value = params[3];
        document.getElementById("temperatureSliderValue").innerHTML = params[3] + "C&#176";;

        let indexToWeekDay = {
            0: "Friday",
            1: "Saturday",
            2: "Sunday",
        }

        let sessionCount = parseInt(params[4]);
        for (let i = 0; i < sessionCount; i++) {
            let sessionId = addEmptySession();
            saveString += document.getElementById("sessionDay" + sessionId).value = indexToWeekDay[params[5 + 4 * i]];
            saveString += document.getElementById("sessionHourOfDay" + sessionId).value = parseInt(params[5 + 4 * i + 1])
            saveString += document.getElementById("sessionLength" + sessionId).value = parseInt(params[5 + 4 * i + 2]);
            saveString += document.getElementById("sessionRace" + sessionId).checked = params[5 + 4 * i + 3] == "true";
        }
    }else{
        addEmptySession();
    }
    updateCopyLink();
    runStatistics();
}