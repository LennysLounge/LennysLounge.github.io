var orb;
function setup(){
    createCanvas( window.innerWidth, window.innerHeight );
    background(50);
    stroke(255);
    noFill();

    orb = new Orb( width/2, height/2 );
}

function draw(){
    background(50);
    orb.update();
}
