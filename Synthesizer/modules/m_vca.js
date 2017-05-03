moduleController.addModule( function vca(){
    Module.call( this );
    this.title = "VCA";

    this.gainNode = new Tone.Gain(1);
    this.out = this.addControll( AudioOut, 100, 60,  "Output" );
    this.out.setValue( this.gainNode );

    /*
    ########################################################################
    ####  GATE                                                          ####
    ########################################################################
    */
    this.gate = new Tone.Multiply(1).connect( this.gainNode.gain );

    this.gateMod = this.addControll( GateIn, 0, 74, "Gate" );
    this.gateMod.onConnect = function(){
        if( this.gateMod.value !== undefined ){
            this.gate.value = 0;
            this.gateMod.value.target = this;
            this.gateMod.value.onChange = function( state ){
                this.gate.value = state ? 1 : 0 ;
            }
        }
    }
    this.gateMod.onDisconnect = function(){
        this.gate.value = 1
        if( this.gateMod.value !== undefined ) this.gateMod.value.disconnect();
    }

    /*
    ########################################################################
    ####  GAIN                                                          ####
    ########################################################################
    */
    this.gain = new Tone.Add(1).connect( this.gate );

    this.gainKnob = this.addControll( Knob, 50, 60, "Gain");
    this.gainKnob.setRange( 0, 1, 100, 100 );
    this.gainKnob.onChange = function(){
        this.gain.value = this.gainKnob.value;
    }
    this.gainKnob.setValue( 0.5 );

    /*
    ########################################################################
    ####  GAIN MODULATION                                               ####
    ########################################################################
    */
    this.gainMod = this.addControll( ControllIn, 0, 60, "Gain" );
    this.gainMod.onConnect = function(){
        if( this.gainMod.value !== undefined )
            this.gainMod.value.connect( this.gain );
    }
    this.gainMod.onDisconnect = function(){
        if( this.gainMod.value !== undefined )
            this.gainMod.value.disconnect( this.gain );
    }

    /*
    ########################################################################
    ####  AudioIn                                                       ####
    ########################################################################
    */
    this.in = this.addControll( AudioIn, 0, 46,  "test" );
    this.in.onConnect = function(){
        if( this.in.value !== undefined )this.in.value.connect( this.gainNode );
    }
    this.in.onDisconnect = function(){
        if( this.in.value !== undefined )this.in.value.disconnect( this.gainNode );
    }
});
