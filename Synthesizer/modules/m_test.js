moduleController.addModule( function test(){
    Module.call( this );

    this.title = "test";

    this.signal = new Tone.CustomGate();
    this.out = this.addControll( GateOut, 100, 60,  "Output" );
    this.out.setValue( this.signal );


    this.keyPressed = function( e ){
        if( e.keyCode == 71 ){
            this.signal.open()
        }
    }

    this.keyReleased = function( e ){
        if( e.keyCode == 71 ){
            this.signal.close();
        }
    }


});
