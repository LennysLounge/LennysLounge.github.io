function WeatherSim(_rainLevelConfig, _cloudLevelConfig, randomness, _ambientTempConfig) {
    let rainLevelConfig = _rainLevelConfig;
    let cloudLevelConfig = _cloudLevelConfig;
    let ambientTempConfig = _ambientTempConfig;
    randomness = constrain(randomness, 0, 7);

    /**
     * Factor used for scaling the randomness
     */
    let randomnessFactor = randomness / 7;

    /**
     * How many passes the noise function does.
     */
    let noisePasses = 0;
    if (randomness > 0) {
        noisePasses = floor(randomnessFactor * 10) + 4;
    }

    /**
     * Generates the noise coefficient array
     */
    let noiseCoefficients = [];
    if (randomness > 0) {
        let variance = randomnessFactor * 0.4;
        let r = constrain(randNormalDist(0, variance), -2 * variance, 2 * variance);
        noiseCoefficients[0] = r * 0.2;
        for (i = 1; i < noisePasses; i++) {
            r = constrain(randNormalDist(0, variance), -2 * variance, 2 * variance);
            noiseCoefficients[i] = (2.5 / noisePasses) * r;
        }
    }

    /**
     * There is a list of other coefficients aswell.
     * There is only ever one element in it.
     * I dont know why this has to be a list.
     * I wish i had a better understanding of what the are.
     * For now they are just called otherCoefficients. 
     */
    let otherCoefficients = [];
    {
        let baseValue = constrain(randNormalDist(0, 1.2), -1.6, 1.6);
        otherCoefficients[0] = randNormalDist(baseValue, 1.3);
    }

    /**
     * Base temperature for temperature calculation
     */
    let baseTemp = ambientTempConfig + 1 - 2 * Math.random() * randomnessFactor;

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
            noise += weektime / 86400 * noiseCoefficients[0];
            for (i = 1; i < noisePasses; i++) {
                let s = 0;
                s = sin(weektime * 3.14156 / 86400 + otherCoefficients[0]);
                s = sin((s * 86400 / 3.14156 + weektime) * i * 2 * 3.14156 * 2 / 86400);
                noise += s * noiseCoefficients[i];
            }

            result.noise = noise;

            // cloud level is cloud level config + noise
            let cloudLevel = noise + cloudLevelConfig;
            result.cloudLevel = constrain(cloudLevel, 0, 1);

            // rain is only allowed to exist if the cloud level is atleast 0.6
            // if the rain level is zero and the randomness is less than four
            // rain is always zero.
            result.rainLevel = 0;
            if ((rainLevelConfig > 0 || randomness > 3) && result.cloudLevel >= 0.6) {
                let rainLevel = (cloudLevel - 0.6) * 1.4875 + 0.15;
                // the rain level can never be bigger than the noise
                // this effectivly limits rain to maximum the configured level.
                rainLevel = constrain(rainLevel, 0, noise);
                result.rainLevel = constrain(rainLevel, 0, 1);
            }
            //TODO:: Add wind calculation   
        }

        // the brightness is a cosine with a period of one day (86400 seconds)
        // and offset by two hours (7200 seconds)
        result.brightness = -0.2 - cos((weektime - 7200) / 86400 * 3.14156 * 2);

        // The hottness factor goes up with increasing temperature.
        // Hottness factor is equal to one then the temperature is 25 degrees.
        let hottnessFactor = baseTemp / 25;


        // The ambient temperature starts as the base temperature.
        // It gets hotter and colder based on the brightness; cloud cover
        // reduces the temperature sing.
        // Rain reduces the temperature. The drop in temperatue
        // is higher on hotter days.
        result.ambientTemp = baseTemp
            + (6 - result.cloudLevel * 3) * result.brightness
            - (result.rainLevel * 4 + result.cloudLevel) * hottnessFactor;

        // Track temperatures goes up with increasing sunlight.
        // At night the track is the same temperature as the air.
        // I dont fully understand this crazy formula.
        let brightnessClipped = max(result.brightness, 0);
        result.trackTemp = result.ambientTemp +
            (result.ambientTemp + 20) * (0.25 - 0.125 * (result.cloudLevel + result.rainLevel) * hottnessFactor) * brightnessClipped;

        return result;
    }

    this.setSeeds = function (_noiseCoefficients, _otherCoefficients, _baseTemp) {
        noiseCoefficients = _noiseCoefficients;
        otherCoefficients = _otherCoefficients;
        baseTemp = _baseTemp;
    }

    this.setRainLevelConfig = function (newRainLevelConfig) {
        rainLevelConfig = newRainLevelConfig;
    }

    this.setCloudLevelConfig = function (newCloudLevelConfig) {
        cloudLevelConfig = newCloudLevelConfig;
    }

    this.setAmbientTempConfig = function (newAmbientTempConfig) {
        ambientTempConfig = newAmbientTempConfig;
        let variance = randomness / 7;
        baseTemp = ambientTempConfig + 1 - Math.random() * 2 * variance;
    }

    this.getNoiseCoefficients = function () {
        return noiseCoefficients;
    }
    this.getOtherCoefficients = function () {
        return otherCoefficients;
    }
    this.getBaseTemp = function () {
        return baseTemp;
    }
}

function randNormalDist(baseValue, variance) {
    do {
        a = Math.random() * 2 - 1;
        b = Math.random() * 2 - 1;
        c = a * a + b * b;
    } while (c > 1);
    let aa = Math.sqrt(Math.log(c) * -2 / c) * a;
    return baseValue + variance * aa;
}