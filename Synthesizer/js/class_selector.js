function Selector( parent, x, y, name="" ){
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.name = name;

    this.rawValue = 0.5;
    this.prevRawValue = this.rawValue;
    this.value = 0;
    this.steps = 0;   //steps in the rotation
    this.dist = 100;    //Mouse deltaY to change the rawValue from 0 to 1
    this.options = [];

    this.clicked = false;
    this.clickY = 0;
    this.clickValue = 0;

    this.size = 40;
    this.dotSize = 10;
    this.markerLength = 5;
    this.cutoutAngle = radians(50);
    this.color = color(255);

    this.defaultOptionDraw = function( x, y, angle ){
        var sin = round(Math.sin( angle )*1000);
        var cos = round(Math.cos( angle )*1000);
        var ha = CENTER;
        var va = CENTER;
        if( abs(cos) > abs(sin) )   ha = (cos<0) ? RIGHT : LEFT;
        if( abs(sin) >= abs(cos) )  va = (sin<0) ? BASELINE : TOP;
        textAlign( ha, va );
        noStroke();
        fill(0);
        text( this.value, x, y );
    }
    this.addOption = function( value, draw=this.defaultOptionDraw ){
        var obj = {value:value,draw:draw};
        this.options.push( obj );
        this.steps = this.options.length-1;
        this.rawValue = 1;
    }
    this.setDist = function( dist ){
        this.dist = dist;
    }
    this.onChange = function(){};

    this.setValue = function( value ){
        this.rawValue = value/(this.options.length-1);
        this.updateValue();
        this.onChange.call( this.parent );
    }
    this.updateValue = function(){
        this.value = this.options[this.rawValue * (this.options.length-1)].value;
    }
    this.update = function(){
        if( this.clicked ){
            var rawValueOffset = this.rawValue;
            var dy = (this.clickY - mouseY );
            this.rawValue = constrain(this.clickValue + (dy/this.dist),0,1);
            this.rawValue = round( this.rawValue*this.steps)/this.steps;

            this.updateValue();
            if( this.prevRawValue != this.rawValue )
                this.onChange.call(this.parent);
            this.prevRawValue = this.rawValue;
        }

        this.draw();
    }
    this.draw = function(){
        var x = this.parent.x + this.x;
        var y = this.parent.y + this.y;
        fill(this.color);
        stroke( 0 );
        //Background
        var cutoutAngleLow = PI/2 + this.cutoutAngle;
        var cutoutAngleHigh = PI/2 - this.cutoutAngle;

        //Indicator
        var indicatorAngle = map( this.rawValue, 0, 1, cutoutAngleLow, PI*2+cutoutAngleHigh );
        var sin = Math.sin( indicatorAngle );
        var cos = Math.cos( indicatorAngle );
        //line( x, y, x+cos*this.size/2, y+sin*this.size/2 );
        fill(this.color);
        beginShape();
        vertex(  x+cos*this.size/3, y+sin*this.size/3 );
        vertex(  x+sin*this.dotSize/3, y-cos*this.dotSize/3 );
        vertex(  x-sin*this.dotSize/3, y+cos*this.dotSize/3 );
        endShape( CLOSE );
        ellipse( x, y, this.dotSize, this.dotSize );
        if( this.clicked ){
            fill(0,50);
            ellipse( x, y, this.dotSize, this.dotSize );
        }
        fill(this.color);

        //options
        fill(0);
        noStroke();
        textAlign( RIGHT, CENTER );
        textSize(8);
        for( var i=0; i<this.options.length; i++ ){
            var angle = map( i, 0, this.options.length-1, cutoutAngleLow, PI*2+cutoutAngleHigh );
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var x1 = x+cos*(this.size/2+this.markerLength);
            var y1 = y+sin*(this.size/2+this.markerLength);
            stroke(0);
            line(   x+cos*this.size/2, y+sin*this.size/2, x1, y1 );
            this.options[i].draw( x1, y1, angle );
        }

        //text
        noStroke();
        fill(0);
        textAlign( CENTER, CENTER );
        textSize(10);
        if( this.clicked ){
            var precision = max(0, 2-Math.log10(this.highValue-this.lowValue));
            text( this.value, x, y+this.size/2 );
        }else{
            text( this.name, x, y+this.size/2 );
        }
    }
    this.mousePressed = function(){
        var dx = mouseX - (this.parent.x + this.x);
        var dy = mouseY - (this.parent.y + this.y);
        if( sqrt(dx*dx + dy*dy) < this.size/2 ){
            this.clicked = true;
            this.clickY = mouseY;
            this.clickValue = this.rawValue;
        }
    }
    this.mouseReleased = function(){
        this.clicked = false;
    }
}
