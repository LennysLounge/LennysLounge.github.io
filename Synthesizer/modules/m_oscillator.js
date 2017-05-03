moduleController.addModule( function oscillator(){
    Module.call( this );
    this.title = "Oscillator";

    this.oscSine = new Tone.Oscillator(440).start();
    this.outSine = this.addControll( AudioOut, 100, 39, "Sine" );
    this.outSine.setValue( this.oscSine );

    this.oscTriangle = new Tone.Oscillator(440).start();
    this.oscTriangle.type = "triangle"
    this.outTriangle = this.addControll( AudioOut, 100, 53, "Triangle" );
    this.outTriangle.setValue( this.oscTriangle );

    this.oscSawtooth = new Tone.Oscillator(440).start();
    this.oscSawtooth.type = "sawtooth"
    this.outSawtooth = this.addControll( AudioOut, 100, 67, "Sawtooth" );
    this.outSawtooth.setValue( this.oscSawtooth );

    this.oscSquare = new Tone.Oscillator(440).start();
    this.oscSquare.type = "square"
    this.outSquare = this.addControll( AudioOut, 100, 81, "Square" );
    this.outSquare.setValue( this.oscSquare );

    /*
    ########################################################################
    ####  FREQUENCY                                                     ####
    ########################################################################
    */
    var startFrequncy = 440;
    this.frequencyValue = new Tone.exp()
    this.frequencyValue.connect( this.oscSine.frequency );
    this.frequencyValue.connect( this.oscTriangle.frequency );
    this.frequencyValue.connect( this.oscSawtooth.frequency );
    this.frequencyValue.connect( this.oscSquare.frequency );
    this.frequency = new Tone.Add(0.5).connect( this.frequencyValue );

    this.freqKnob = this.addControll( Knob, 50, 60, "Frequency", "Hz" );
    this.freqKnob.setRange( 20, 20480, 1000, 1000, true );
    this.freqKnob.onChange = function(){
        this.frequency.value = this.freqKnob.rawValue;
    }
    this.freqKnob.setValue( startFrequncy );
    /*
    ########################################################################
    ####  FREQUENCY MODULATION                                          ####
    ########################################################################
    */

    this.freqMod = this.addControll( ControllIn, 0, 60, "Frequency" );
    this.freqMod.onConnect = function(){
        if( this.freqMod.value !== undefined ){
            this.freqMod.value.connect( this.frequency );
        }
    }
    this.freqMod.onDisconnect = function(){
        if( this.freqMod.value !== undefined )
            this.freqMod.value.disconnect( this.frequency );
    }
});
