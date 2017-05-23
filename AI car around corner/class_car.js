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
    this.change = 0.5;
    this.changeOffset = 50;


    //target
    this.minDistToTarget = 50;
    this.target = createVector(this.x+this.minDistToTarget*2,this.y);
    this.targetTimer = 0;

    //DATA
    this.data = {
        frames: 100000,
        times: [],
        steeringSum: 0,
        steeringSums: [],
    }
    this.firstlap = true;

    this.last = 0;
    this.end = function(){
        if( !this.firstlap ){
            this.last = this.data.times[0];
        }
    };
    this.endLap = function(){
        var time = this.data.frames;
        var dist = sqrt( pow(this.x-this.target.x,2) + pow(this.y-this.target.y,2) );
        var subframe = 1-(this.minDistToTarget - dist)/this.speed;
        var time = this.data.frames + subframe;
        this.data.times.unshift( time );
        this.data.steeringSums.unshift( this.data.steeringSum );

        this.end();
        if( this.firstlap ) this.firstlap = false;
        this.data.frames = 0;
    }
    this.nextTarget = function(){
        this.targetTimer = 0;
        this.section++;
        if( this.section >= this.corner.points.length ){
            this.section = 0;
            this.track.evolve();
            this.cornerIndex++;
            if( this.cornerIndex >= this.track.corners.length ){
                this.cornerIndex = 0;
                this.endLap();
            }
            this.corner = this.track.corners[ this.cornerIndex ];
        }
        var point = this.corner.points[ this.section ];
        this.target.x = point.x;
        this.target.y = point.y;
    }
    this.reset = function(){
        this.section = 0;
        this.cornerIndex = 0;
        this.corner = this.track.corners[ 0 ];
        this.x = this.corner.points[0].x;
        this.y = this.corner.points[0].y;
        this.nextTarget();
        this.heading = atan2( this.target.y-this.y, this.target.x-this.x );
        this.data.frames = 0;
        this.data.steeringSum = 0;
        this.active = true;
    }
    this.addTrack = function( track ){
        this.track = new AITrack( track );
        this.reset();
        return this.track;
    }
    this.update = function(){
        if( this.active ){
            this.data.frames++;
            this.targetTimer++;
            if( this.targetTimer > 100 ){
                this.active = false;
                this.end();
            }
            var targetAngle = atan2( this.target.y-this.y, this.target.x-this.x );

            var dif = angleDifference( this.heading, targetAngle );

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
    this.offset = 0;
    this.marked = false;
    this.draw = function(){
        //if( this.drawTrack )  this.track.draw();


        //draw time
        fill(255);noStroke();
        textSize(20);
        text( this.name, 200,200+this.offset );
        var time = (this.last/60).toFixed(3)+"s";
        text( time, 240,200+this.offset );

        stroke(255);strokeWeight(1);fill(255,50);
        if( this.drawTrack ){
            fill(0,255,0,50);
            stroke(0,255,0 );
        }
        var x = this.x;
        var y = this.y;
        var l = this.length;
        var w = this.width;
        var s = sin( this.heading );
        var c = cos( this.heading );

        if( this.drawTrack)
            //ellipse( this.target.x, this.target.y, 20, 20 );


        if( this.drawTrack ){
            fill(0,255,0);
            stroke(100,255,100 );
        }
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
