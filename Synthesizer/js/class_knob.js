function Knob( parent, x, y, name="", unit="" ){
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.name = name;
    this.unit = unit;
    this.isLog = false;

    this.rawValue = 0.5;
    this.prevRawValue = this.rawValue;
    this.lowValue = 0;
    this.highValue = 1;
    this.value = (this.highValue-this.lowValue)*this.rawValue+this.lowValue;
    this.steps = 100;   //steps in the rotation
    this.dist = 100;    //Mouse deltaY to change the rawValue from 0 to 1

    this.clicked = false;
    this.clickY = 0;
    this.clickValue = 0;

    this.size = 50;
    this.dotSize = 7;
    this.cutoutAngle = radians(45);
    this.color = color(255);

    this.setRange = function( lower, higher, steps=100, dist=100, log=false ){
        this.lowValue = lower;
        this.highValue = higher;
        this.steps = steps;
        this.dist = dist;
        this.isLog = log;
        this.updateValue();
    }
    this.setValue = function( value ){
        if( this.isLog ){
            var rv = Math.log10(value);
            this.rawValue = map( rv, Math.log10(this.lowValue), Math.log10(this.highValue),0,1);
        }else{
            this.rawValue=(value-this.lowValue)/(this.highValue-this.lowValue);
        }
        this.value = value;
        this.onChange.call( this.parent );
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

    this.onChange = function(){};

    this.updateValue = function(){
        var rv = this.rawValue;
        var range = this.highValue-this.lowValue;
        if( this.isLog ){
            rv = map(rv,0,1,Math.log10(this.lowValue), Math.log10(this.highValue) );
            this.value = pow(10,rv);
        }else{
            this.value = rv*range + this.lowValue;
        }
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
        /*
        this.rawValue += 0.001;
        if( this.rawValue > 1 ) this.rawValue = 0.01;
        this.updateValue();
        this.onChange.call(this.parent);
        */
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
        arc( x, y, this.size, this.size, cutoutAngleLow, cutoutAngleHigh, PIE );
        //Indicator
        if( this.rawValue != 0 ){
            var indicatorAngle = map( this.rawValue, 0, 1, cutoutAngleLow, PI*2+cutoutAngleHigh );
            sin = Math.sin( indicatorAngle );
            cos = Math.cos( indicatorAngle );
            line( x, y, x+cos*this.size/2, y+sin*this.size/2 );
            noFill();
            arc( x, y, this.dotSize*2, this.dotSize*2, cutoutAngleLow, indicatorAngle );
            if( this.clicked ){
                fill(0,50);
                arc( x, y, this.size, this.size, cutoutAngleLow, indicatorAngle );
            }
            fill(this.color);
        }
        //dot
        ellipse( x, y, this.dotSize, this.dotSize );
        //text
        fill(0);
        noStroke();
        textAlign( CENTER, CENTER );
        textSize(10);
        if( this.clicked ){
            var precision = max(0, 2-Math.log10(this.highValue-this.lowValue));
            text( this.value.toFixed(precision) + this.unit, x, y+this.size/2 );
        }else{
            text( this.name, x, y+this.size/2 );
        }
    }
}
