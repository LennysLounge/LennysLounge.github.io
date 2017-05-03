moduleController.addModule( function waveform(){
    Module.call( this, "Spectrum Analyser" );

    this.w = 400;
    this.h = 300;
    this.color = color(80,200,80);
    this.prev = [];
    this.border = 10;

    this.fft = new Tone.Analyser("waveform",128);
    Tone.Master.connect( this.fft );

    this.logterm = [];
    this.logterm.length = 1000;



    this.update = function(){
        Module.prototype.update.call(this);
    }
    this.draw = function(){
        Module.prototype.draw.call(this);

        var x = this.x+this.border;
        var y = this.y+this.topMargin+this.border;
        var w = this.w-this.border*2;
        var h = this.h-this.topMargin-this.border*2;
        rect( x, y, w, h );



        // draw filtered spectrum
        var spectrum = this.fft.analyse();
        this.logterm.shift();
        this.logterm.push( spectrum[0] );

        noFill();

        stroke(100);
        line( x,y+h/2,x+w,y+h/2);
        stroke(255);
        beginShape();
        for( var i=0; i<spectrum.length; i++ ){
            var X = w/(spectrum.length-1) * i;
            var Y = map( spectrum[i], 0, 255, h, 0 );
            vertex( x+X, y+Y );
        }
        endShape();

        for( var i=0; i<this.logterm.length; i++ ){
            var X = w/(this.logterm.length-1) * i;
            var Y = map( this.logterm[i], 0, 255, h, 0 );
            point( x+X, y+Y );
        }




    }
});
