function Car( name ){
    this.x = 0;
    this.y = 0;
    this.steeringAngle = 0;
    this.maxSterringAngle = 0.3;
    this.heading = 0;
    this.speed = 5;
    this.length = 15;
    this.width = 10;
    this.tireWidth = 2.5;
    this.tireLength = 5;
    this.name = name;

    this.active = false;
    this.autoReset = false;

    //track
    this.corners = [];
    this.corner;
    this.section = 0;
    this.cornerIndex = 0;
    this.change = 1;


    //target
    this.minDistToTarget = 30;
    this.target = createVector(this.x+this.minDistToTarget*2,this.y);

    //DATA
    this.data = {
        frames: 0,
        times: [],
        steeringSum: 0,
        steeringSums: [],
    }

    this.getScore = function(){
        //var score =  this.data.steeringSums[0] * this.data.times[0];
        //var score =  this.data.times[0];
        var score = this.data.steeringSums[0];
        return score;
    }

    this.randomize = function(){
        var prev = 0;
        var prevStartOffset = 0;
        this.corners.forEach( (c)=>{
            c.s = prev;
            c.m = constrain( c.m+random(-this.change, this.change), -1, 1 );
            c.e = constrain( c.e+random(-this.change, this.change), -1, 1 );
            c.startOffset = prevStartOffset;
            c.endOffset = constrain( c.endOffset+random(-this.change*100,this.change*100), -100, 200 )
            prevStartOffset = c.endOffset;
            prev = c.e;
            c.calcPoints();
        });
        this.corners[0].s = prev;
        this.corners[0].calcPoints();
        this.corners[ this.corners.length-1 ].endOffset = 0;
        this.corners[ this.corners.length-1 ].calcPoints();
    }
    this.copyCorner = function( corners ){
        for( var i=0; i<this.corners.length; i++ ){
            var c = this.corners[i];
            c.s = corners[i].s;
            c.m = corners[i].m;
            c.e = corners[i].e;
            c.startOffset = corners[i].startOffset;
            c.endOffset = corners[i].endOffset;
            c.calcPoints();
        }

    }

    this.end = function(){
        this.reset();
    };
    this.endLap = function(){
        var time = this.data.frames;
        var dist = sqrt( pow(this.x-this.target.x,2) + pow(this.y-this.target.y,2) );
        var subframe = 1-(this.minDistToTarget - dist)/this.speed;
        var time = this.data.frames + subframe;
        this.data.times.unshift( time );
        this.data.steeringSums.unshift( this.data.steeringSum );
        this.end();
    }
    this.nextTarget = function(){
        this.section++;
        if( this.section >= this.corner.points.length ){
            this.section = 0;
            this.cornerIndex++;
            if( this.cornerIndex >= this.corners.length ){
                this.active = false;
                this.endLap();
                return;
            }
            this.corner = this.corners[ this.cornerIndex ];
        }
        var point = this.corner.points[ this.section ];
        this.target.x = point.x;
        this.target.y = point.y;
    }
    this.reset = function(){
        this.section = 0;
        this.cornerIndex = 0;
        this.corner = this.corners[ 0 ];
        this.x = this.corner.points[0].x;
        this.y = this.corner.points[0].y;
        this.nextTarget();
        this.heading = atan2( this.target.y-this.y, this.target.x-this.x );
        this.data.frames = 0;
        this.data.steeringSum = 0;
        this.active = true;
    }
    this.addTrack = function( track ){
        track.corners.forEach( (corner)=>{
            this.corners.push( new AICorner(corner) );
        });
        this.section = 0;
        this.cornerIndex = 0;
        this.corner = this.corners[0];
        this.nextTarget();
    }
    this.update = function(){
        if( this.active ){
            this.data.frames++;
            var targetAngle = atan2( this.target.y-this.y, this.target.x-this.x );
            var dif = this.heading - targetAngle;
            if( dif >  PI ) dif -= PI*2;
            if( dif < -PI ) dif += PI*2;

            this.steeringAngle = -constrain( dif, -this.maxSterringAngle, this.maxSterringAngle );

            var sv = createVector( this.length-this.speed, 0 );
            sv.x += cos(this.steeringAngle)*this.speed;
            sv.y += sin(this.steeringAngle)*this.speed;
            this.heading += sv.heading();
            sv.normalize();
            sv.rotate( this.heading );
            this.x += sv.x*this.speed;
            this.y += sv.y*this.speed;

            this.data.steeringSum += pow(this.steeringAngle,2);

            do{
                var dist = sqrt( pow(this.x-this.target.x,2) + pow(this.y-this.target.y,2) )
                if( dist <= this.minDistToTarget ){
                    this.nextTarget();
                }
            }while( dist <= this.minDistToTarget && this.active==true );
        }
    }
    this.drawTrack = false;
    this.draw = function(){
        if( this.drawTrack ){
            this.corners.forEach( (corner)=>{
                corner.draw();
            });
        }

        stroke(255);strokeWeight(1);fill(255,50);
        if( this.drawTrack ){
            fill(0,255,0,100);
            stroke(0,255,0 );
        }
        var x = this.x;
        var y = this.y;
        var l = this.length;
        var w = this.width;
        var s = sin( this.heading );
        var c = cos( this.heading );

        if( this.drawTrack)
            ellipse( this.target.x, this.target.y, 10, 10 );

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
