function Orb(x,y){
    this.scale =        (width < height) ? width/4 : height/4;
    this.borderRadius = this.scale;
    this.targetRadius = this.scale / 5;
    this.maxspd =       this.scale / 50;
    this.acc =          this.maxspd / 50;
    this.home = createVector(x,y);
    this.pos = createVector(x,y);
    this.target = createVector(x,y);
    this.v = createVector(1,0);
    this.v.setMag( random(this.maxspd) );
    this.v.rotate( radians( random(360) ) );

    this.prev = [];
    this.tailLength = 100;
    for( var i=0; i<this.tailLength; i++ )  this.prev.push( this.pos.copy() );

    this.update = function(){
        this.draw();
        var deltaV = this.target.copy();
        deltaV = deltaV.sub(this.pos).setMag( this.maxspd );
        deltaV = deltaV.sub( this.v ).setMag( min(deltaV.mag(), this.acc) );
        this.v.add( deltaV );
        this.pos.add( this.v );
        //if point is inside target
        if( this.pos.dist(this.target) < this.targetRadius ){
            this.newTarget();
        }

        this.prev.shift();
        this.prev.push( this.pos.copy() );

    }
    this.newTarget = function(){
        var spreadAngle = 130;
        do{
            this.target = this.v.copy();
            if( this.target.mag() == 0 ) this.target.x = 1;
            this.target.rotate( radians( random(spreadAngle*2)-spreadAngle ) );
            this.target.setMag( random(this.scale) );
            this.target.add( this.pos );

            spreadAngle++;
        }while( this.target.dist(this.home) > this.borderRadius );
    }
    this.draw = function(){
        ellipse( this.pos.x, this.pos.y, 10,10);

        for( var i=1; i<this.prev.length ; i++ ){
            line(   this.prev[i].x, this.prev[i].y,
                    this.prev[i-1].x, this.prev[i-1].y );
        }
    }
}
