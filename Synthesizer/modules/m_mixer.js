moduleController.addModule( function mixer(){
    Module.call( this );
    this.h = 300;
    this.title = "Mixer";

    var vca1out = true;
    var vca2out = true;
    var vca3out = true;
    var vca4out = true;


    /*
    ########################################################################
    ####  1                                                             ####
    ########################################################################
    */

    this.gain1Node = new Tone.Gain(1);
    this.out1 = this.addControll( AudioOut, 100, 60,  "Output 1" );
    this.out1.setValue( this.gain1Node );
    this.out1.onConnect = function(){
        console.log(" connected ");
        this.gain1Node.disconnect( this.outputGain );
    }
    this.out1.onDisconnect = function(){
        console.log(" disconnect");
        this.gain1Node.connect( this.outputGain );
    }


    //Gate
    this.gate1 = new Tone.Multiply(1).connect( this.gain1Node.gain );

    this.gate1Mod = this.addControll( GateIn, 0, 74, "Gate" );
    this.gate1Mod.onConnect = function(){
        if( this.gate1Mod.value !== undefined ){
            this.gate1.value = 0;
            this.gate1Mod.value.target = this;
            this.gate1Mod.value.onChange = function( state ){
                this.gate1.value = state ? 1 : 0 ;
            }
        }
    }
    this.gate1Mod.onDisconnect = function(){
        this.gate1.value = 1
        if( this.gate1Mod.value !== undefined ) this.gate1Mod.value.disconnect();
    }

    //Gain
    this.gain1 = new Tone.Add(1).connect( this.gate1 );

    this.gain1Knob = this.addControll( Knob, 50, 60, "Gain");
    this.gain1Knob.setRange( 0, 1, 100, 100 );
    this.gain1Knob.onChange = function(){
        this.gain1.value = this.gain1Knob.value;
    }
    this.gain1Knob.setValue( 0.5 );

    //Gain Modulation
    this.gain1Mod = this.addControll( ControllIn, 0, 60, "Gain" );
    this.gain1Mod.onConnect = function(){
        if( this.gain1Mod.value !== undefined )
            this.gain1Mod.value.connect( this.gain1 );
    }
    this.gain1Mod.onDisconnect = function(){
        if( this.gain1Mod.value !== undefined )
            this.gain1Mod.value.disconnect( this.gain1 );
    }

    //In
    this.in1 = this.addControll( AudioIn, 0, 46,  "Input 1" );
    this.in1.onConnect = function(){
        if( this.in1.value !== undefined )
            this.in1.value.connect( this.gain1Node );
    }
    this.in1.onDisconnect = function(){
        if( this.in1.value !== undefined )
            this.in1.value.disconnect( this.gain1Node );
    }

    /*
    ########################################################################
    ####  2                                                             ####
    ########################################################################
    */

    this.gain2Node = new Tone.Gain(1);
    this.out2 = this.addControll( AudioOut, 100, 120,  "Output 2" );
    this.out2.setValue( this.gain2Node );

    //Gate
    this.gate2 = new Tone.Multiply(1).connect( this.gain2Node.gain );

    this.gate2Mod = this.addControll( GateIn, 0, 134, "Gate" );
    this.gate2Mod.onConnect = function(){
        if( this.gate2Mod.value !== undefined ){
            this.gate2.value = 0;
            this.gate2Mod.value.target = this;
            this.gate2Mod.value.onChange = function( state ){
                this.gate2.value = state ? 1 : 0 ;
            }
        }
    }
    this.gate2Mod.onDisconnect = function(){
        this.gate2.value = 1
        if( this.gate2Mod.value !== undefined ) this.gate2Mod.value.disconnect();
    }

    //Gain
    this.gain2 = new Tone.Add(1).connect( this.gate2 );

    this.gain2Knob = this.addControll( Knob, 50, 120, "Gain");
    this.gain2Knob.setRange( 0, 1, 100, 100 );
    this.gain2Knob.onChange = function(){
        this.gain2.value = this.gain2Knob.value;
    }
    this.gain2Knob.setValue( 0.5 );

    //Gain Modulation
    this.gain2Mod = this.addControll( ControllIn, 0, 120, "Gain" );
    this.gain2Mod.onConnect = function(){
        if( this.gain2Mod.value !== undefined )
            this.gain2Mod.value.connect( this.gain2 );
    }
    this.gain2Mod.onDisconnect = function(){
        if( this.gain2Mod.value !== undefined )
            this.gain2Mod.value.disconnect( this.gain2 );
    }

    //In
    this.in2 = this.addControll( AudioIn, 0, 106,  "Input 2" );
    this.in2.onConnect = function(){
        if( this.in2.value !== undefined )
            this.in2.value.connect( this.gain2Node );
    }
    this.in2.onDisconnect = function(){
        if( this.in2.value !== undefined )
            this.in2.value.disconnect( this.gain2Node );
    }
    /*
    ########################################################################
    ####  3                                                             ####
    ########################################################################
    */

    this.gain3Node = new Tone.Gain(1);
    this.out3 = this.addControll( AudioOut, 100, 180,  "Output 3" );
    this.out3.setValue( this.gain3Node );

    //Gate
    this.gate3 = new Tone.Multiply(1).connect( this.gain3Node.gain );

    this.gate3Mod = this.addControll( GateIn, 0, 194, "Gate" );
    this.gate3Mod.onConnect = function(){
        if( this.gate3Mod.value !== undefined ){
            this.gate3.value = 0;
            this.gate3Mod.value.target = this;
            this.gate3Mod.value.onChange = function( state ){
                this.gate3.value = state ? 1 : 0 ;
            }
        }
    }
    this.gate3Mod.onDisconnect = function(){
        this.gate3.value = 1
        if( this.gate3Mod.value !== undefined ) this.gate3Mod.value.disconnect();
    }

    //Gain
    this.gain3 = new Tone.Add(1).connect( this.gate3 );

    this.gain3Knob = this.addControll( Knob, 50, 180, "Gain");
    this.gain3Knob.setRange( 0, 1, 100, 100 );
    this.gain3Knob.onChange = function(){
        this.gain3.value = this.gain3Knob.value;
    }
    this.gain3Knob.setValue( 0.5 );

    //Gain Modulation
    this.gain3Mod = this.addControll( ControllIn, 0, 180, "Gain" );
    this.gain3Mod.onConnect = function(){
        if( this.gain3Mod.value !== undefined )
            this.gain3Mod.value.connect( this.gain3 );
    }
    this.gain3Mod.onDisconnect = function(){
        if( this.gain3Mod.value !== undefined )
            this.gain3Mod.value.disconnect( this.gain3 );
    }

    //In
    this.in3 = this.addControll( AudioIn, 0, 166,  "Input 3" );
    this.in3.onConnect = function(){
        if( this.in3.value !== undefined )
            this.in3.value.connect( this.gain3Node );
    }
    this.in3.onDisconnect = function(){
        if( this.in3.value !== undefined )
            this.in3.value.disconnect( this.gain3Node );
    }

    /*
    ########################################################################
    ####  4                                                             ####
    ########################################################################
    */

    this.gain4Node = new Tone.Gain(1);
    this.out4 = this.addControll( AudioOut, 100, 240,  "Output 4" );
    this.out4.setValue( this.gain4Node );

    //Gate
    this.gate4 = new Tone.Multiply(1).connect( this.gain4Node.gain );

    this.gate4Mod = this.addControll( GateIn, 0, 254, "Gate" );
    this.gate4Mod.onConnect = function(){
        if( this.gate4Mod.value !== undefined ){
            this.gate4.value = 0;
            this.gate4Mod.value.target = this;
            this.gate4Mod.value.onChange = function( state ){
                this.gate4.value = state ? 1 : 0 ;
            }
        }
    }
    this.gate4Mod.onDisconnect = function(){
        this.gate4.value = 1
        if( this.gate4Mod.value !== undefined ) this.gate4Mod.value.disconnect();
    }

    //Gain
    this.gain4 = new Tone.Add(1).connect( this.gate4 );

    this.gain4Knob = this.addControll( Knob, 50, 240, "Gain");
    this.gain4Knob.setRange( 0, 1, 100, 100 );
    this.gain4Knob.onChange = function(){
        this.gain4.value = this.gain4Knob.value;
    }
    this.gain4Knob.setValue( 0.5 );

    //Gain Modulation
    this.gain4Mod = this.addControll( ControllIn, 0, 240, "Gain" );
    this.gain4Mod.onConnect = function(){
        if( this.gain4Mod.value !== undefined )
            this.gain4Mod.value.connect( this.gain4 );
    }
    this.gain4Mod.onDisconnect = function(){
        if( this.gain4Mod.value !== undefined )
            this.gain4Mod.value.disconnect( this.gain4 );
    }

    //In
    this.in4 = this.addControll( AudioIn, 0, 226,  "Input 4" );
    this.in4.onConnect = function(){
        if( this.in4.value !== undefined )
            this.in4.value.connect( this.gain4Node );
    }
    this.in4.onDisconnect = function(){
        if( this.in4.value !== undefined )
            this.in4.value.disconnect( this.gain4Node );
    }

    /*
    ########################################################################
    ####  MASTER                                                        ####
    ########################################################################
    */
    this.outputGain = new Tone.Gain(1);
    this.outMaster = this.addControll( AudioOut, 100, 287,  "Output Master" );
    this.outMaster.setValue( this.outputGain );

    this.gain1Node.connect( this.outputGain );
    this.gain2Node.connect( this.outputGain );
    this.gain3Node.connect( this.outputGain );
    this.gain4Node.connect( this.outputGain );

    console.log( this.gain1Node );

    /*
    ########################################################################
    ####  STUFF                                                         ####
    ########################################################################
    */
    this.draw = function(){
        Module.prototype.draw.call( this );
        stroke(100);
        line( this.x+1, this.y+275, this.x+this.w-1, this.y+275 );
        textAlign( CENTER, CENTER );
        textSize( 12 );
        noStroke();
        text( "Master", this.x+this.w/2, this.y+287 );
    }

});
