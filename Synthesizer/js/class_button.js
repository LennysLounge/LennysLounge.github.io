function Button( parent, x, y, name="", unit="" ){
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.name = name;
    this.unit = unit;
    this.isLog = false;


    this.clicked = false;
    this.clickY = 0;
    this.clickValue = 0;

    this.size = 14;
    textSize( this.size );
    this.text = "Hallo"
    this.height = 20;
    this.width = textWidth( this.text );
    this.color = color(255);

    this.setText = function( str, size ){
        textSize( size );
        this.width = textWidth( str );
        this.size = size;
        this.text = str;
    }
    this.setSize = function( w, h ){
        this.width = w;
        this.height = h;
    }

    this.mousePressed = function(){
        var x = this.parent.x + this.x;
        var y = this.parent.y + this.y;
        if( mouseX>x && mouseX<x+this.width ){
            if( mouseY>y && mouseY<y+this.height ){
                this.clicked = true;
                this.onChange.call( this.parent );
            }
        }
    }
    this.mouseReleased = function(){
        this.clicked = false;
    }

    this.onChange = function(){};
    this.update = function(){
        if( this.clicked ){
        }
        this.draw();
    }
    this.draw = function(){
        var x = this.parent.x + this.x;
        var y = this.parent.y + this.y;
        stroke(0,100);
        if( this.clicked ) fill(0,100);
        else noFill();
        rect( x, y, this.width, this.height );

        fill(0);
        stroke(0);
        textSize( this.size );
        textAlign( CENTER, CENTER );
        text( this.text, x+this.width/2, y+this.height/2 );
    }
}
