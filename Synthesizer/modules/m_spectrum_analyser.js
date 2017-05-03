moduleController.addModule( function spectrum(){
    Module.call( this, "Spectrum Analyser" );

    this.w = 400;
    this.h = 200;
    this.color = color(80,200,80);
    this.prev = [];
    this.border = 10;

    this.fft = new Tone.Analyser("fft",1024);
    Tone.Master.connect( this.fft );


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
        spectrum.length = 32;
        var n = w / Math.log10(spectrum.length-6);
        var split = 100;
        var X, Y, xx;
        fill(100);
        beginShape();
        for( var i=0; i<split; i++ ){
            X = x + floor( Math.log10(i)*n );
            Y = y + map( spectrum[i], 0, 255, h-5, 0 );
            curveVertex( X, Y );
        }
        curveVertex( X, y+h );curveVertex( X, y+h );curveVertex( X, y+h );
        curveVertex( x, y+h );curveVertex( x, y+h );
        endShape();
        xx = X;
        beginShape();
        for( var i=split-1; i<spectrum.length-5; i++ ){
            X = x + floor( Math.log10(i)*n );
            Y = y + map( spectrum[i], 0, 255, h-5, 0 );
            vertex( X, Y );
        }
        vertex( X, y+h );
        vertex( xx, y+h );
        endShape();

        noFill();
        stroke(255);
        strokeJoin(ROUND);
        beginShape();
        for( var i=0; i<split; i++ ){
            X = x + floor( Math.log10(i)*n );
            Y = y + map( spectrum[i], 0, 255, h-5, 0 );
            curveVertex( X, Y );
        }
        curveVertex( X, Y );
        endShape();
        xx = X;
        beginShape();
        for( var i=split-1; i<spectrum.length-5; i++ ){
            X = x + floor( Math.log10(i)*n );
            Y = y + map( spectrum[i], 0, 255, h-5, 0 );
            vertex( X, Y );
        }
        endShape();
    }
    this.destroy = function(){
        this.controlls.forEach( (con)=>{
            if( con.disconnect )    con.disconnect();
        });
        this.fft.dispose();
        moduleController.deleteModule( this );
    }
});
