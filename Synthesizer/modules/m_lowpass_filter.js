moduleController.addModule( function lowpass(){
    Module.call( this );
    this.h = 160;

    this.title = "Low-Pass";

    this.filter = new Tone.Filter( 350, "lowpass" );
    this.out = this.addControll( AudioOut, 100, 60,  "test" );
    this.out.setValue( this.filter );


    /*
    ########################################################################
    ####  FREQUENCY                                                     ####
    ########################################################################
    */
    var startFrequncy = 440;
    this.frequencyValue = new Tone.exp().connect( this.filter.frequency );
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
        if( this.freqMod.value !== undefined )
            this.freqMod.value.connect( this.frequency );
    }
    this.freqMod.onDisconnect = function(){
        if( this.freqMod.value !== undefined )
            this.freqMod.value.disconnect( this.frequency );
    }

    /*
    ########################################################################
    ####  AudioIn                                                       ####
    ########################################################################
    */
    this.in = this.addControll( AudioIn, 0, 46,  "test" );
    this.in.onConnect = function(){
        if( this.in.value !== undefined )this.in.value.connect( this.filter );
    }
    this.in.onDisconnect = function(){
        if( this.in.value !== undefined )this.in.value.disconnect( this.filter );
    }
});
