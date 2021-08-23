function WeatherSim(_rainLevelConfig, _cloudLevelConfig, randomness, _ambientTempConfig) {
    let rainLevelConfig = _rainLevelConfig;
    let cloudLevelConfig = _cloudLevelConfig;
    let ambientTempConfig = _ambientTempConfig;
    /**
     * How many passes the noise function does.
     */
    let noisePasses = [0, 5, 6, 8, 9, 11, 12, 14][randomness];

    /**
     * Generates the noise coefficient array
     */
    let noiseCoefficients = [];
    let variance = randomness / 7 * 0.2;
    let randomValues = getRandNormalDistList(0, variance, noisePasses);
    let a = constrain(randomValues[0], -2 * variance, 2 * variance);
    noiseCoefficients[0] = (a * 0.2) * 2;
    for (i = 1; i < noisePasses; i++) {
        a = constrain(randomValues[i], -2 * variance, 2 * variance);
        noiseCoefficients[i] = (5 / noisePasses) * a;
    }

    /**
     * Base temperature for temperature calculation
     */
    variance = randomness / 7;
    let baseTemp = ambientTempConfig + 1 - Math.random() * 2 * variance;

    /**
     * Holds the indivicual weather results for a whole weekend
     */
    let weekend = [];

    /**
     * Calculates the weather for a whole weekend with the specified interval
     * interval:    the time in seconds between calculation.
     */
    this.calculateWeekend = function (interval) {
        weekend = [];
        for (let t = 0; t < 259200; t += interval) {
            weekend.push(this.calculateWeather(t));
        }
    }

    /**
     * Returns the whole weekend.
     */
    this.getWeekend = function () {
        return weekend;
    }

    /**
     * Calculates the weather values for a point in time at the 
     * specified moment.
     * weektime:    point at which to calculate the weather in seconds.
     */
    this.calculateWeather = function (weektime) {
        let result = {
            noise: 0,
            rainLevel: rainLevelConfig,
            cloudLevel: cloudLevelConfig,
            brightness: 0,
            ambientTemp: 0,
            trackTemp: 0,
        };
        if (noisePasses == 0) {
            //skip rain and cloud calculation
            result.noise = rainLevelConfig;
            result.rainLevel = rainLevelConfig;
            result.clouldLevel = cloudLevelConfig;
        }
        else {
            // calculate noise function
            let noise = rainLevelConfig;
            for (i = 1; i < noisePasses; i++) {
                noise += sin(weektime / 86400 * 3.14156 * i) * noiseCoefficients[i];
            }
            noise += weektime / 86400 * noiseCoefficients[0];
            result.noise = noise;

            // cloud level is cloud level config + noise
            let cloudLevel = noise + cloudLevelConfig;
            result.cloudLevel = constrain(cloudLevel, 0, 1);

            // rain is only allowed to exist if the cloud level is atleast 0.6
            // if the rain level is zero and the randomness is less than four
            // rain is always zero.
            result.rainLevel = 0;
            if ((rainLevelConfig > 0 || randomness > 3)
                && result.cloudLevel >= 0.6) {
                let rainLevel = (cloudLevel - 0.6) * 1.4875 + 0.15;
                // the rain level can never be bigger than the noise
                // this effectivly limits rain to maximum the configure level.
                rainLevel = constrain(rainLevel, 0, noise);
                result.rainLevel = constrain(rainLevel, 0, 1);
            }
            //TODO:: Add wind calculation   
        }

        // the brightness is a cosine with a period of one day (86400 seconds)
        // and offset by two hours (7200 seconds)
        result.brightness = max(-0.2 - cos((weektime - 7200) / 86400 * 3.14156 * 2), 0);

        // ambient temperature gets reduced by rain or cloud cover, aswell as 
        // the brightness of the sun.
        let cloudiness = 1 - (4 * result.rainLevel + result.cloudLevel) * 0.04;
        let sunIrradiation = (6 - 3 * result.cloudLevel) * result.brightness;
        result.ambientTemp = baseTemp * cloudiness + sunIrradiation;

        // track temperature is ambient temperature plus heating from the sun.
        // the ammount of heating is dependent on the ambient temperature and
        // get reduced by cloud cover.
        let heatingPotention = result.ambientTemp / 4 + 5;
        cloudiness = 1 - ((result.rainLevel - result.cloudLevel) / 2) * baseTemp * 0.04;
        result.trackTemp = result.ambientTemp + heatingPotention * cloudiness * result.brightness;
        return result;
    }

    this.setRainLevelConfig = function (newRainLevelConfig) {
        rainLevelConfig = newRainLevelConfig;
    }

    this.setCloudLevelConfig = function (newCloudLevelConfig) {
        cloudLevelConfig = newCloudLevelConfig;
    }

    this.setAmbientTempConfig = function(newAmbientTempConfig){
        ambientTempConfig = newAmbientTempConfig;
        let variance = randomness / 7;
        baseTemp = ambientTempConfig + 1 - Math.random() * 2 * variance;
    }

    this.setNoiseCoefficients = function (newCoefficients) {
        noiseCoefficients = newCoefficients;
        noisePasses = noiseCoefficients.length;
        redraw();
    }
}

function getRandNormalDistList(baseValue, variance, n) {
    let result = [];
    let a = 0;
    let b = 0;
    let c = 0;
    while (result.length < n) {
        do {
            a = Math.random() * 2 - 1;
            b = Math.random() * 2 - 1;
            c = a * a + b * b;
        } while (c > 1);
        let aa = Math.sqrt(Math.log(c) * -2 / c) * a;
        let bb = Math.sqrt(Math.log(c) * -2 / c) * a;
        result[result.length] = baseValue + variance * aa;
        if (result.length < n)
            result[result.length] = baseValue + variance * bb;
    }
    return result;
}