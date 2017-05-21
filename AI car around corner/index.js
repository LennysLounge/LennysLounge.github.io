var car;
var corner
var cars = [];
var car;
var counter = 0;
var numberOfCars;
var track;
function setup(){
    createCanvas( window.innerWidth, window.innerHeight );
    track = new Track(0,0);
    track.addCorner( 100, 900, 100, 700, 100, 500, 100, 300 );
    track.addCorner( 100, 300, 100, 160, 160, 100, 300, 100 );
    track.addCorner( 300, 100, 500, 100, 700, 100, 900, 100 );

    numberOfCars = 100;
    for( var i=0; i<numberOfCars; i++ ){
        car = new Car("c"+(i+1));
        car.addTrack( track );
        car.randomize();
        car.end = reset;
        car.reset();
        cars.push( car );
    }
    car = random( cars );
    car.drawTrack = true;
}
function draw(){
    background(50);
    track.draw();

    cars.forEach( (c)=>{
        c.update();
        c.draw();
    })

    /*
    car.draw();
    if( !car.active ){
        var i=0;
        while( !cars[i].active ){
            i++;
        }
        cars[i].draw();
    }
    */
}
function reset(){
    counter++;


    if( counter == numberOfCars ){
        cars.sort( (a,b)=>{
            return a.getScore()- b.getScore();
        });
        car.drawTrack = false;
        car = cars[0];
        car.drawTrack = true;
        console.log( "best: "+ "%c"+cars[0].getScore().toFixed(2)+"%c "+ cars[0].name,"color:#00f","color:#000" );

        for( var i=1; i<cars.length; i++){
            cars[i].copyCorner( cars[0].corners );
            cars[i].randomize();
        }
        cars.forEach( (c)=>{ c.reset() } );
        counter = 0;
    }


}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
