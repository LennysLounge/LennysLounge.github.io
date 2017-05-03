moduleController.addModule( function adsr(){
    Module.call( this );
    this.title = "ADSR";
    this.w = 170;
    this.h = 160;

    this.envelope = new Tone.Envelope(1,1,0.5,1);
    this.envelope.releaseCurve = "linear";
    this.out = this.addControll( ControllOut, this.w, 60,  "Output" );
    this.out.setValue( this.envelope );
    this.attackStart = this.envelope.now();
    this.releaseStart = this.attackStart;

    /*
    ########################################################################
    ####  ATTACK DECAY SUSTAIN RELEASE                                  ####
    ########################################################################
    */
    this.attackKnob = this.addControll( Knob, 50, 60, "Attack");
    this.attackKnob.setRange( 0, 1, 100, 100 );
    this.attackKnob.onChange = function(){
        this.envelope.attack = this.attackKnob.value;
    }
    this.attackKnob.setValue( 0.5 );

    this.decayKnob = this.addControll( Knob, 120, 60, "Decay");
    this.decayKnob.setRange( 0, 1, 100, 100 );
    this.decayKnob.onChange = function(){
        this.envelope.decay = this.decayKnob.value;
    }
    this.decayKnob.setValue( 0.5 );

    this.sustainKnob = this.addControll( Knob, 50, 120, "Sustain");
    this.sustainKnob.setRange( 0, 1, 100, 100 );
    this.sustainKnob.onChange = function(){
        this.envelope.sustain = this.sustainKnob.value;
    }
    this.sustainKnob.setValue( 0.5 );

    this.releaseKnob = this.addControll( Knob, 120, 120, "Release");
    this.releaseKnob.setRange( 0, 1, 100, 100 );
    this.releaseKnob.onChange = function(){
        this.envelope.release = this.releaseKnob.value;
    }
    this.releaseKnob.setValue( 0.5 );

    /*
    ########################################################################
    ####  GATE                                                          ####
    ########################################################################
    */

    this.gate = this.addControll( GateIn, 0, 53, "Gate" );
    this.gate.onConnect = function(){
        if( this.gate.value !== undefined ){
            this.gate.value.target = this;
            this.gate.value.onChange = this.gateChanged;
        }
    }
    this.gate.onDisconnect = function(){
        if( this.gate.value !== undefined ) this.gate.value.disconnect();
    }
    this.gateChanged = function( state ){
        if( state == true ) this.envelope.triggerAttack();
        if( state == false )this.envelope.triggerRelease();
    }
    /*
    ########################################################################
    ####  TRIGGER                                                       ####
    ########################################################################
    */

    this.trigger = this.addControll( GateIn, 0, 67, "Trigger" );
    this.trigger.onConnect = function(){
        if( this.trigger.value !== undefined ){
            this.trigger.value.target = this;
            this.trigger.value.onChange = this.triggerChanged;
        }
    }
    this.trigger.onDisconnect = function(){
        if( this.trigger.value !== undefined ) this.trigger.value.disconnect();
    }
    this.triggerChanged = function( state ){
        if( state == true ){
            this.envelope.triggerAttackRelease( this.envelope.attack );
        }
    }

});
