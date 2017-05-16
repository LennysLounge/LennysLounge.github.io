function Car( x, y, corner ){
    var self = this;
    this.x = x;
    this.y = y;
    this.corner = corner;
    this.steeringAngle = radians(30);
    this.heading = PI;
    this.speed = 2;
    this.length = 30;
    this.width = 20;
    this.tireWidth = 5;
    this.tireLength = 10;

    this.target = createVector( random(width), random(height) );

    this.update = function(){
        var targetAngle = atan2( this.target.y-this.y, this.target.x-this.x );
        var dif = this.heading - targetAngle;
        if( dif >  PI ) dif -= PI*2;
        if( dif < -PI ) dif += PI*2;

        this.steeringAngle = -constrain( dif, -PI/5, PI/5 );

        var sv = createVector( this.length-this.speed, 0 );
        sv.x += cos(this.steeringAngle)*this.speed;
        sv.y += sin(this.steeringAngle)*this.speed;
        this.heading += sv.heading();
        sv.normalize();
        sv.rotate( this.heading );
        this.x += sv.x*this.speed;
        this.y += sv.y*this.speed;

        var p = createVector( this.x, this.y );
        p.sub( this.target );
        if( p.mag() < 100 ){
            this.target.x = random( width );
            this.target.y = random( height );
        }
    }
    this.draw = function(){
        stroke(255);strokeWeight(1);fill(255,50);
        var x = this.x;
        var y = this.y;
        var l = this.length;
        var w = this.width;
        var s = sin( this.heading );
        var c = cos( this.heading );

        ellipse( this.target.x, this.target.y, 20, 20 );

        //Body
        arc( x+c*l/2, y+s*l/2, w/4, w/4, this.heading+PI/2, this.heading-PI/2 );
        beginShape(  );
        vertex( x-c*l/2+s*w/2, y-s*l/2-c*w/2 );
        vertex( x-c*l/2-s*w/2, y-s*l/2+c*w/2 );
        vertex( x+c*l/2-s*w/2, y+s*l/2+c*w/2 );
        vertex( x+c*l/2+s*w/2, y+s*l/2-c*w/2 );
        endShape( CLOSE );


        //tires
        var tw = this.tireWidth;
        var tl = this.tireLength;
        var tx = x-c*(l/2)+s*(w/2);
        var ty = y-s*(l/2)-c*(w/2);
        beginShape(  );
        vertex( tx-c*tl/2+s*tw/2, ty-s*tl/2-c*tw/2 );
        vertex( tx-c*tl/2-s*tw/2, ty-s*tl/2+c*tw/2 );
        vertex( tx+c*tl/2-s*tw/2, ty+s*tl/2+c*tw/2 );
        vertex( tx+c*tl/2+s*tw/2, ty+s*tl/2-c*tw/2 );
        endShape( CLOSE );

        tx = x-c*(l/2)-s*(w/2);
        ty = y-s*(l/2)+c*(w/2);
        beginShape(  );
        vertex( tx-c*tl/2+s*tw/2, ty-s*tl/2-c*tw/2 );
        vertex( tx-c*tl/2-s*tw/2, ty-s*tl/2+c*tw/2 );
        vertex( tx+c*tl/2-s*tw/2, ty+s*tl/2+c*tw/2 );
        vertex( tx+c*tl/2+s*tw/2, ty+s*tl/2-c*tw/2 );
        endShape( CLOSE );

        var ts = sin( this.heading+this.steeringAngle );
        var tc = cos( this.heading+this.steeringAngle );
        tx = x+c*(l/2)+s*(w/2);
        ty = y+s*(l/2)-c*(w/2);
        beginShape(  );
        vertex( tx-tc*tl/2+ts*tw/2, ty-ts*tl/2-tc*tw/2 );
        vertex( tx-tc*tl/2-ts*tw/2, ty-ts*tl/2+tc*tw/2 );
        vertex( tx+tc*tl/2-ts*tw/2, ty+ts*tl/2+tc*tw/2 );
        vertex( tx+tc*tl/2+ts*tw/2, ty+ts*tl/2-tc*tw/2 );
        endShape( CLOSE );

        tx = x+c*(l/2)-s*(w/2);
        ty = y+s*(l/2)+c*(w/2);
        beginShape(  );
        vertex( tx-tc*tl/2+ts*tw/2, ty-ts*tl/2-tc*tw/2 );
        vertex( tx-tc*tl/2-ts*tw/2, ty-ts*tl/2+tc*tw/2 );
        vertex( tx+tc*tl/2-ts*tw/2, ty+ts*tl/2+tc*tw/2 );
        vertex( tx+tc*tl/2+ts*tw/2, ty+ts*tl/2-tc*tw/2 );
        endShape( CLOSE );


    }
}
