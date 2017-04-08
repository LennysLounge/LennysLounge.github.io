var particleList = [];
function setup(){
    createCanvas( window.innerWidth, window.innerHeight );
    background(50);
    stroke(255);
    colorMode(HSB, 255);
    strokeWeight( 5 );
    window.setInterval(()=>{
        for( var i=0 ; i<1 ; i++ ){
            var p = new Rocket(
                width/4 + random(width/2),
                height,
                45+random(30),
                -random(0.05)-0.1
            );
            particleList.push( p );
        }
    },500);
}
function draw(){
    background(50,0,50,255);
    particleList.forEach((e)=>{
        if( e.alive ){
            e.update();
            e.draw();
        }
    });
}


function Rocket( x, y, life, acc ){
    this.x = x;
    this.y = y;
    this.prevy = this.y;
    this.spd = 0;
    this.acc = acc;
    this.alive = true;
    this.t = 0;
    this.life = life;
    this.color = color( random(255), 255, 255 );
    this.update = function(){
        this.prevy = this.y;
        this.spd += this.acc;
        this.y += this.spd;
        this.t++;
        if( this.t >= this.life ){
            this.alive = false;
            for( var i=0 ; i<50 ; i++ ){
                var p = new Particle(
                    this.x,
                    this.y,
                    createVector( 0, this.spd ),
                    random(360),
                    random(2),
                    random(15)+30
                );
                p.color = this.color;
                particleList.push( p );
            }
        }
    }
    this.draw = function(){
        stroke( this.color );
        line( this.x, this.y, this.x, this.prevy );
    }
}

function Particle( x, y, v, dir, spd, life ){
    this.pos = createVector( x, y );
    this.prev = this.pos.copy();
    this.v = createVector( sin(radians(dir))*spd , cos(radians(dir))*spd );
    this.v.add( v );
    this.g = createVector( 0, 0.2 );
    this.spd = 0;
    this.acc = -0.1;
    this.alive = true;
    this.t = 0;
    this.life = life;
    this.color = color( random(255), 255, 255 );
    this.update = function(){
        this.prev = this.pos.copy();
        this.v.add( this.g );
        this.pos.add( this.v );

        this.t++;
        if( this.t >= this.life )   this.alive = false;
    }
    this.draw = function(){
        stroke( this.color );
        line( this.pos.x, this.pos.y, this.prev.x, this.prev.y );
    }
}
