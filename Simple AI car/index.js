var corner = [];
var car,n;
function setup(){
    createCanvas( window.innerWidth, window.innerHeight );
    background(50);
    var x = width/4;
    var y = height/4;
    corner.push( new TrackPiece(
        x-100, y+100,
        x-100, y-100,
        x+100, y-100,
        x+100, y+100,
    ));
    car = new Car( x*2, y*2 );
}
function draw(){
    background(50);
    corner.forEach( (corner)=>{
        //corner.draw();
    });
    car.update();
    car.draw();
}
