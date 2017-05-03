moduleController.addModule( function monoKeyboard(){
    Module.call( this );
    this.title = "3-Voice Mono Keyboard";
    this.w = 200;
    this.h = 110;
    this.border = 10;




    /*
    ########################################################################
    ####  GATE                                                          ####
    ########################################################################
    */

    this.gate1Signal = new Tone.CustomGate();
    this.gate1 = this.addControll( GateOut, 200, 30,  "Gate 1" );
    this.gate1.setValue( this.gate1Signal );

    this.gate2Signal = new Tone.CustomGate();
    this.gate2 = this.addControll( GateOut, 200, 55,  "Gate 2" );
    this.gate2.setValue( this.gate2Signal );

    this.gate3Signal = new Tone.CustomGate();
    this.gate3 = this.addControll( GateOut, 200, 80,  "Gate 3" );
    this.gate3.setValue( this.gate3Signal );

    /*
    ########################################################################
    ####  CV                                                            ####
    ########################################################################
    */

    this.cv1Signal = new Tone.Signal(0.3);
    this.cv1 = this.addControll( ControllOut, 200, 40, "CV 1" );
    this.cv1.setValue( this.cv1Signal );

    this.cv2Signal = new Tone.Signal(0.3);
    this.cv2 = this.addControll( ControllOut, 200, 65, "CV 2" );
    this.cv2.setValue( this.cv2Signal );

    this.cv3Signal = new Tone.Signal(0.3);
    this.cv3 = this.addControll( ControllOut, 200, 90, "CV 3" );
    this.cv3.setValue( this.cv3Signal );

    /*
    ########################################################################
    ####  Keyboard input                                                ####
    ########################################################################
    */
    this.keyPressed = function( e ){
        this.lastKey = e.keyCode;
        this.keys.push( e.keyCode );
        this.isKeyPressed = true;

        var key1 = this.findHalfStep(this.keys[ this.keys.length-1 ]);
        var key2 = this.findHalfStep(this.keys[ this.keys.length-2 ]);
        var key3 = this.findHalfStep(this.keys[ this.keys.length-3 ]);
        //console.log( "1:", key1, "2:", key2, "3:", key3 );

        if( key1 >= 0 ){
            this.cv1Signal.value = this.values[ key1 ];
            if( this.gate1Signal.isOpen == false ){
                this.gate1Signal.open();
            }
        }
        if( key2 >= 0 ){
            this.cv2Signal.value = this.values[ key2 ];
            if( this.gate2Signal.isOpen == false ){
                this.gate2Signal.open();
            }
        }
        if( key3 >= 0 ){
            this.cv3Signal.value = this.values[ key3 ];
            if( this.gate3Signal.isOpen == false ){
                this.gate3Signal.open();
            }
        }
    }
    this.keyReleased = function( e ){
        this.isKeyPressed = false;
        var i = this.keys.indexOf( e.keyCode );
        this.keys.splice( i , 1 );

        var key1 = this.findHalfStep(this.keys[ this.keys.length-1 ]);
        var key2 = this.findHalfStep(this.keys[ this.keys.length-2 ]);
        var key3 = this.findHalfStep(this.keys[ this.keys.length-3 ]);
        //console.log( "1:", key1, "2:", key2, "3:", key3 );

        if( key1 >= 0 ){
            this.cv1Signal.value = this.values[ key1 ];
        }
        if( key2 >= 0 ){
            this.cv2Signal.value = this.values[ key2 ];
        }
        if( key3 >= 0 ){
            this.cv3Signal.value = this.values[ key3 ];
        }

        if( key1 < 0 && this.gate1Signal.isOpen == true ){
            this.gate1Signal.close();
        }
        if( key2 < 0 && this.gate2Signal.isOpen == true ){
            this.gate2Signal.close();
        }
        if( key3 < 0 && this.gate3Signal.isOpen == true ){
            this.gate3Signal.close();
        }

    }
    /*
    ########################################################################
    ####  STUFF                                                         ####
    ########################################################################
    */

    this.offsetPlus = this.addControll( Button, 52, 22, "Offset Plus" );
    this.offsetPlus.setText(">",20);
    this.offsetPlus.setSize( 16, 16 );
    this.offsetPlus.onChange = function(){
        this.offset += (this.offset%12==4||this.offset%12==11) ? 1 : 2;
        this.visualOffset++;
    }
    this.offsetMinus = this.addControll( Button, 2, 22, "Offset Minus" );
    this.offsetMinus.setText("<",20);
    this.offsetMinus.setSize( 16, 16 );
    this.offsetMinus.onChange = function(){
        this.offset -= (this.offset%12==5||this.offset%12==0) ? 1 : 2;
        this.visualOffset--;
        if( this.offset < 0 ){
            this.offset = 0;
            this.visualOffset = 0;
        }
    }


    this.keys = [];
    this.isKeyPressed = false;
    this.blackKeys = [81,87,69,82,84,90,85,73,79,80,186,187];
    this.whiteKeys = [65,83,68,70,71,72,74,75,76,192,222,191];
    this.names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    this.values = [ 16.352, 17.324, 18.354, 19.445, 20.602, 21.827, 23.125,
        24.500, 25.957, 27.500, 29.135, 30.868 ];
    for( var i=1; i<=6; i++ ){
        var mult = pow(2, i );
        for( var j=0; j<12; j++ ){
            this.values[12*i+j] = this.values[j]*mult
        }
    }
    for( var i=0; i<this.values.length; i++ ){
        this.values[i] = map(
            Math.log10( this.values[i] ),
            Math.log10(20), Math.log10( 20480 ),
            0, 1 );
    }
    this.visualOffset = 28;
    this.offset = 48;
    window.keyboard = this;

    this.draw = function(){
        Module.prototype.draw.call( this );
        var w = (this.w-this.border*2)/this.whiteKeys.length;
        var h = 70;
        var x = this.x;
        var y = this.y + this.h-h;


        stroke(0);
        for( var i=0; i<this.whiteKeys.length; i++ ){
            fill(255);
            if( this.keys.indexOf(this.whiteKeys[i]) != -1 ) fill( 0, 255, 0);
            rect( x+w*i+this.border,y,w,h);
        }
        h = 40;
        stroke(0);
        for( var i=0; i<this.blackKeys.length; i++ ){
            fill(0);
            if( this.keys.indexOf(this.blackKeys[i]) != -1 ) fill( 0, 255, 0);
            if( (i+this.visualOffset)%7==0 || (i+this.visualOffset)%7==3 ) continue;
            if( i == 0){
                rect( x+w*i+this.border,y,w/4,h);
            }else{
                rect( x-w/4+w*i+this.border,y,w/2,h);
            }
        }


        //offset name;
        var str = this.names[ (this.offset%12) ];
        var octave = (this.offset - (this.offset%12)) / 12;
        var y = this.y;
        fill(0);
        noStroke();
        textAlign( CENTER, CENTER );
        text( str+octave, x+35, y+30 );


        var halfStep = this.findHalfStep();
        var octave = (halfStep- (halfStep%12) ) / 12;
        var str = "";
        if( halfStep >= 0 ){
            str = this.names[halfStep%12] + octave;
            //str = this.values[ halfStep ];
        }
        text( str, x+this.w-30, y+30 );
    }
    this.findHalfStep = function( keyCode ){
        if( keyCode === undefined ) return -1;
        var black = this.blackKeys.indexOf( keyCode )*2;
        var white = this.whiteKeys.indexOf( keyCode )*2+1;
        var key = max( black, white ) + this.visualOffset*2 - 1;
        if( key%14 == 5 || key%14== 13 || key==-1) return -1;
        if( key%14 >= 6 ) key -= 1;

        var octave = (key-key%14)/14;
        key = key - octave*2;

        return key;
    }
});
