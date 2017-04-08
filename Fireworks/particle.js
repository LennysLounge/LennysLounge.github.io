function Particle( x, y, options ){
    this.pos = createVector( x, y );
    this.v = createVector( 0, -1 );
    this.acc = createVector( 0, 0 );
    this.gravity = createVector( 0, 0.05 );
    this.dead = false;
    this.life = 90;
    this.deathCallback = function(){};

    for( prop in options ){
        if( prop == "acc" ) this.acc = options[prop];
        if( prop == "dir" ){
            this.v.x = sin(radians( options[prop] ));
            this.v.y = cos(radians( options[prop] ));
        }
    }

    this.update = function(){

        //rotate acceleration to the velocity
        this.acc = this.v.copy().setMag( this.acc.mag() );

        this.v.add( this.acc );
        this.v.add( this.gravity );

        this.pos.add( this.v );
        this.life--;
        if( this.life <= 0 && this.dead == false ){
            this.dead = true;
            this.deathCallback();
        }
    }
    this.draw = function(){
        ellipse( this.pos.x, this.pos.y, 10, 10 );
    }

}
