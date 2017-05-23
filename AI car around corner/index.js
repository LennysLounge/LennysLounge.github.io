var track, aiTrack;
var counter = 0;
var numberOfCars = 100;
var activeSegment = -1;
var interval;
var segment = 0;
var counter = 0;
var change = 1;
var cars = [];
function setup(){
    createCanvas( window.innerWidth, window.innerHeight );
    track = new Track(0,0);
    track.addCorner( 1000, 800, 850, 800, 650, 800, 500, 800 );
    track.addCorner( 500, 800, 250, 800, 100, 650, 100, 400 );
    track.addCorner( 100, 400, 100, 325, 100, 275, 100, 200 );
    track.addCorner( 100, 200, 100, 130, 130, 100, 200, 100 );
    track.addCorner( 200, 100, 250, 100, 300, 100, 350, 100 );
    track.addCorner( 350, 100, 400, 100, 400, 100, 435, 135 );
    track.addCorner( 435, 135, 500, 200, 650, 350, 800, 500,);
    track.addCorner( 800, 500, 850, 550, 850, 550, 900, 500, );
    track.addCorner( 900, 500, 930, 470, 970, 470, 1000, 500 );
    track.addCorner( 1000, 500, 1050, 550, 1050, 550, 1121, 550 );
    track.addCorner( 1121, 550, 1200, 550, 1300, 550, 1400, 550 );
    track.addCorner( 1400, 550, 1470, 550, 1500, 620, 1500, 650 );
    track.addCorner( 1500, 650, 1500, 750, 1400, 800, 1300, 800 );
    track.addCorner( 1300, 800, 1200, 800, 1100, 800, 1000, 800 );
    for( var i=0; i<track.corners.length; i++ ){
        var c = new Car("c"+i);
        c.offset = 20*i;
        c.addTrack( track );
        /*
        c.corner = c.track.corners[i];
        c.cornerIndex = i;
        c.nextTarget();
        c.x = c.target.x;
        c.y = c.target.y;
        c.nextTarget();
        c.heading = atan2( c.target.y-c.y, c.target.x-c.x );
        */
        c.x = c.x + 25*i;
        c.y = c.y + (i%2*10)
        c.y = c.y - ((i+1)%2*10)
        c.end = Sort;
        cars.push( c );
    }
    car = random(cars);
    car.drawTrack = true;
}
function draw(){
    background(50);
    track.draw();
    cars.forEach( (car)=>{
        car.update();
        car.draw();
    });
}

function Sort(){
    if( !this.firstlap ){
        this.last = this.data.times[0];
    }
    cars.sort( (a,b)=>{
        return a.last-b.last;
    });
    for( var i=0; i<cars.length; i++ ){
        cars[i].offset = 20*i;
    }
    //car.drawTrack = false;
    //car = cars[0];
    //car.drawTrack = true;
}
function select( nr ){
    car.drawTrack = false;
    car = cars[nr];
    car.drawTrack = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
