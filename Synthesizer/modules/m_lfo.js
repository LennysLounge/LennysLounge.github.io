moduleController.addModule( function lfo(){
    Module.call( this );
    this.title = "LFO";
    this.h = 160;

    this.lfoSine = new Tone.LFO(1, 0, 1 ).start();
    this.outSine = this.addControll( ControllOut, 100, 39, "Sine" );
    this.outSine.setValue( this.lfoSine );

    this.lfoTriangle = new Tone.LFO(1, 0, 1 ).start();
    this.lfoTriangle.type = "triangle";
    this.outTriangle = this.addControll( ControllOut, 100, 53, "Triangle" );
    this.outTriangle.setValue( this.lfoTriangle );

    this.lfoSawtooth = new Tone.LFO(1, 0, 1 ).start();
    this.lfoSawtooth.type = "sawtooth";
    this.outSawtooth = this.addControll( ControllOut, 100, 67, "Sawtooth" );
    this.outSawtooth.setValue( this.lfoSawtooth );

    this.lfoSquare = new Tone.LFO(1, 0, 1 ).start();
    this.lfoSquare.type = "square";
    this.outSquare = this.addControll( ControllOut, 100, 81, "Square" );
    this.outSquare.setValue( this.lfoSquare );

    /*
    ########################################################################
    ####  FREQUENCY                                                     ####
    ########################################################################
    */
    this.frequency = new Tone.Signal( 1 )
    this.frequency.connect( this.lfoSine.frequency );
    this.frequency.connect( this.lfoTriangle.frequency );
    this.frequency.connect( this.lfoSawtooth.frequency );
    this.frequency.connect( this.lfoSquare.frequency );
    this.freqKnob = this.addControll( Knob, 50, 60, "Frequency", "Hz" );
    this.freqKnob.setRange( 0, 10, 1000, 100 );
    this.freqKnob.setValue( this.frequency.value );
    this.freqKnob.onChange = function(){
        this.frequency.value = this.freqKnob.value;
    }

    /*
    ########################################################################
    ####  AMPLITUDE                                                     ####
    ########################################################################
    */

    this.amplitude = new Tone.Signal( 0.1 )
    this.ampKnob = this.addControll( Knob, 50, 120, "Amplitude" );
    this.ampKnob.setRange( 0, 1, 1000, 100 );
    this.ampKnob.onChange = function(){
        var value = this.ampKnob.value;
        this.amplitude.value = value;
        this.lfoSine.max = value;
        this.lfoTriangle.max = value;
        this.lfoSawtooth.max = value;
        this.lfoSquare.max = value;
    }
    this.ampKnob.setValue( this.amplitude.value );

});
