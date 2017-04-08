var orb1, orb2;
function setup(){
    createCanvas( window.innerWidth, window.innerHeight );
    background(50);
    strokeWeight(1);
    stroke(255);
    noFill();

    orb1 = new Orb( width/2, height/2 );
    orb2 = new Orb( width/2, height/2 );
}

function draw(){
    background(50);

    var r = (width < height) ? width/4 : height/4;
    stroke(150);
    ellipse( width/2, height/2, r*2.8, r*2.8 );

    stroke(200);
    orb1.update();
    orb2.update();

    for( var i=orb1.tailLength/10; i<orb1.tailLength/2 ; i+=3 ){
        line(
            orb1.prev[i].x, orb1.prev[i].y,
            orb2.prev[i].x, orb2.prev[i].y
        );
    }
}
