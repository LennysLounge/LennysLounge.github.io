function setup() {
    noCanvas();
    testFullSampleCorrectness();
    testDistribution(1, Rand1);
    testDistribution(2, Rand2);
    testDistribution(3, Rand3);
    testDistribution(4, Rand4);
    testDistribution(5, Rand5);
    testDistribution(6, Rand6);
    testDistribution(7, Rand7);
}

// draws the full sim sample
new p5((sketch) => {
    sketch.setup = function () {
        let container = document.getElementById("FullSimSampleCanvas");
        let canvas = sketch.createCanvas(container.offsetWidth - 2, container.offsetHeight - 2);
        canvas.parent(container);
    }
    sketch.draw = function () {
        sketch.background(255);
        sketch.noFill();
        sketch.stroke(50, 50, 50);
        sketch.line(0, sketch.height * 0.4, sketch.width, sketch.height * 0.4);
        sketch.stroke(0, 255, 0);
        drawGraph("ambientTemp", 0, 50);
        sketch.stroke(255, 0, 0);
        drawGraph("trackTemp", 0, 50);
        sketch.stroke(0, 0, 255);
        drawGraph("rainLevel", 0, 1);
        sketch.stroke(255, 0, 255);
        drawGraph("cloudLevel", 0, 1);
        sketch.stroke(0, 255, 255);
        drawGraph("brightness", -1.2, 0.8);

    }
    function drawGraph(attribute, lowerLimit, upperLimit) {
        sketch.beginShape();
        for (let i = 0; i < weatherDataSample.length; i++) {
            let x = sketch.map(i, 0, weatherDataSample.length, 0, sketch.width);
            let y = sketch.map(weatherDataSample[i][attribute], lowerLimit, upperLimit, sketch.height, 0);
            sketch.vertex(x, y);
        }
        sketch.endShape();
    }
});

// draws the full sim sample
new p5((sketch) => {
    let weatherSim;
    sketch.setup = function () {
        let container = document.getElementById("FullSimCanvas");
        let canvas = sketch.createCanvas(container.offsetWidth - 2, container.offsetHeight - 2);
        canvas.parent(container);
        weatherSim = new WeatherSim(0.3, 0.3, 7, 27);
        weatherSim.setSeeds(seedsSample, otherSeedsSample, ambientBaseTempSameple);
    }
    sketch.draw = function () {
        sketch.background(255);
        sketch.noFill();
        sketch.stroke(50, 50, 50);
        sketch.line(0, sketch.height * 0.4, sketch.width, sketch.height * 0.4);
        sketch.stroke(0, 255, 0);
        drawGraph("ambientTemp", 0, 50);
        sketch.stroke(255, 0, 0);
        drawGraph("trackTemp", 0, 50);
        sketch.stroke(0, 0, 255);
        drawGraph("rainLevel", 0, 1);
        sketch.stroke(255, 0, 255);
        drawGraph("cloudLevel", 0, 1);
        sketch.stroke(0, 255, 255);
        drawGraph("brightness", -1.2, 0.8);

    }
    function drawGraph(attribute, lowerLimit, upperLimit) {
        sketch.beginShape();
        for (let i = 0; i < weatherDataSample.length; i++) {
            let weatherResult = weatherSim.calculateWeather(weatherDataSample[i].weektime);
            let x = sketch.map(i, 0, weatherDataSample.length, 0, sketch.width);
            let y = sketch.map(weatherResult[attribute], lowerLimit, upperLimit, sketch.height, 0);
            sketch.vertex(x, y);
        }
        sketch.endShape();
    }
});

function testFullSampleCorrectness() {
    let result = {
        ambientTempMaxError: 0,
        trackTempMaxError: 0,
        rainLevelMaxError: 0,
        cloudLevelMaxError: 0,
        brightnessMaxError: 0
    };

    let weatherSim = new WeatherSim(0.3, 0.3, 7, 27);
    weatherSim.setSeeds(seedsSample, otherSeedsSample, ambientBaseTempSameple);
    for (let i = 0; i < weatherDataSample.length; i++) {
        let weatherResult = weatherSim.calculateWeather(weatherDataSample[i].weektime);
        ambientTempMax = abs(weatherResult.ambientTemp - weatherDataSample[i].ambientTemp);
        if (ambientTempMax > result.ambientTempMaxError) result.ambientTempMaxError = ambientTempMax;
        trackTempMax = abs(weatherResult.trackTemp - weatherDataSample[i].trackTemp);
        if (trackTempMax > result.trackTempMaxError) result.trackTempMaxError = trackTempMax;
        rainLevelMax = abs(weatherResult.rainLevel - weatherDataSample[i].rainLevel);
        if (rainLevelMax > result.rainLevelMaxError) result.rainLevelMaxError = rainLevelMax;
        cloudLevelMax = abs(weatherResult.cloudLevel - weatherDataSample[i].cloudLevel);
        if (cloudLevelMax > result.cloudLevelMaxError) result.cloudLevelMaxError = cloudLevelMax;
        brightnessMax = abs(weatherResult.brightness - weatherDataSample[i].brightness);
        if (brightnessMax > result.brightnessMaxError) result.brightnessMaxError = brightnessMax;
    }

    let element = document.getElementById("FullSampleTestResult");
    element.innerHTML = "";
    element.innerHTML += "<b>Test result comparing calculated result with real data.<b><br>";
    element.innerHTML += "Maximum error in ambient temperature: " + result.ambientTempMaxError + "<br>";
    element.innerHTML += "Maximum error in track temperature: " + result.trackTempMaxError + "<br>";
    element.innerHTML += "Maximum error in cloud levels: " + result.cloudLevelMaxError + "<br>";
    element.innerHTML += "Maximum error in rain level: " + result.rainLevelMaxError + "<br>";
    element.innerHTML += "Maximum error in brightness: " + result.brightnessMaxError + "<br>";
}

function testDistribution(randomness, sample) {
    let seeds = {
        ambientTemp: [],
        seed: [],
        otherSeed: []
    }
    // generate seeds
    for (let i = 0; i < 1000; i++) {
        let weatherSim = new WeatherSim(0.3, 0.3, randomness, 27);
        seeds.ambientTemp.push(weatherSim.getBaseTemp() - 27);
        let noiseCoef = weatherSim.getNoiseCoefficients();
        for (let j = 0; j < noiseCoef.length; j++) {
            if (seeds.seed.length <= j) {
                seeds.seed.push([]);
            }
            seeds.seed[j].push(noiseCoef[j]);
        }
        let otherCoef = weatherSim.getOtherCoefficients();
        for (let j = 0; j < otherCoef.length; j++) {
            if (seeds.otherSeed.length <= j) {
                seeds.otherSeed.push([]);
            }
            seeds.otherSeed[j].push(otherCoef[j]);
        }
    }

    let c = document.createElement("div");
    document.body.appendChild(c);
    c.innerHTML += "<br><b>Test Result comparing distribution of generated seeds with randomness " + randomness + "<b><br>";
    c.innerHTML += "Data generated by the game on the left, generated by this site on the right.<br>";
    c.innerHTML += "<br>";

    compareDistribution("ambient temp", sample.ambientTempSample, seeds.ambientTemp);
    for (let i = 0; i < sample.seedSamples.length; i++) {
        if (seeds.seed.length > i) {
            compareDistribution("seed " + i, sample.seedSamples[i], seeds.seed[i]);
        } else {
            document.body.appendChild(document.createTextNode("data generated does not have seed " + i));
        }
    }

    function compareDistribution(name, sample, data) {
        document.body.appendChild(document.createTextNode("Comparing " + name + " distribution"));
        let container = document.createElement("div");
        container.classList.add("distributionResult");
        document.body.appendChild(container);
        addDistributionTest(container, sample);
        addDistributionTest(container, data);
    }

    function addDistributionTest(targetElement, target) {
        let lowest = min(target);
        let highest = max(target);
        let avg = target.reduce((a, b) => a + b, 0) / target.length;
        let stdDev = sqrt(target
            .map(a => (a - avg) * (a - avg) / (target.length - 1))
            .reduce((a, b) => a + b, 0));

        let classesPerOneStdDev = 5;
        let classes = [];
        for (let i = 0; i < classesPerOneStdDev * 6; i++) {
            classes[i] = 0;
        }

        // count appearce in classes.
        target.forEach(v => {
            classes[floor((v - avg) / stdDev * classesPerOneStdDev) + 3 * classesPerOneStdDev]++;
        });

        // max occurances
        let maxOccurances = max(classes);

        new p5((sketch) => {
            sketch.setup = function () {
                let canvas = sketch.createCanvas(200, 200);
                canvas.parent(targetElement);
                canvas.style.border = "1px solid black";
                sketch.noLoop();

                let element = document.createElement("div");
                element.innerHTML += "lowest: " + lowest + "<br>";
                element.innerHTML += "highest: " + highest + "<br>";
                element.innerHTML += "avg: " + avg + "<br>";
                element.innerHTML += "stdDev: " + stdDev + "<br>";
                targetElement.appendChild(element);
            }
            sketch.draw = function () {
                sketch.stroke(0);
                sketch.noFill();
                sketch.rect(0, 0, sketch.width, sketch.height);
                sketch.beginShape();
                for (let i = 0; i < classes.length; i++) {
                    let x = map(i, 0, classes.length, 0, sketch.width);
                    let y = map(classes[i], 0, maxOccurances, sketch.height, 0);
                    sketch.vertex(x, y);
                }
                sketch.endShape();
            }
        });
    }
}



