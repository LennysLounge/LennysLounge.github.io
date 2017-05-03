moduleController.addModule( function noise(){
    Module.call( this );
    this.title = "Noise";
    this.h = 100;

    this.noise = new Tone.Noise().start();
    this.noise.volume.value = -30;
    this.out = this.addControll( AudioOut, 100, 60, "Audio Out" );
    this.out.setValue( this.noise );

    /*
    ########################################################################
    #### type                                                           ####
    ########################################################################
    */
    this.type = this.addControll( Selector, 50, 60, "Type" );
    this.type.cutoutAngle = radians( 120 );
    this.type.addOption("white",( x, y, angle )=>{
        noFill();
        beginShape();
        vertex( x-10, y-5 );
        vertex( x, y-5 );
        endShape();
    });
    this.type.addOption("pink",( x, y, angle )=>{
        noFill();
        beginShape();
        vertex( x-5, y-5 );
        vertex( x+5, y-2 );
        endShape();
    });
    this.type.addOption("brown",( x, y, angle )=>{
        noFill();
        beginShape();
        vertex( x, y-5 );
        vertex( x+3, y-5 );
        vertex( x+10, y)
        endShape();
    });
    this.type.onChange = function(){
        this.noise.type = this.type.value;
    }
    this.type.setValue( 2 );
});
