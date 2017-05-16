function Arm( x, y, dir ){
    this.x = x;
    this.y = y;
    this.length = length;
    this.dir = dir+180;
    this.centerx = x + sin(radians(this.dir))*this.length;
    this.centery = y + cos(radians(this.dir))*this.length;
    this.offset = 0;
    this.radius = 100;
    this.speed = 2;
    this.color = 0;
    this.update = function(){
        var x = this.centerx + sin(radians(this.offset+this.dir))*this.radius;
        var y = this.centery + cos(radians(this.offset+this.dir))*this.radius;
        this.offset += this.speed;

        this.color += 0.2;
        if( this.color > 100 ) this.color = 0;
        strokeWeight(7);
        stroke(this.color, 100, 70);
        point( x, y );
        strokeWeight(1);
        line( this.x, this.y, x, y );

        stroke(80, 100, 40 );
        strokeWeight(7);
        point( this.x, this.y );
    }
    this.setCenter = function( dir ){
        this.centerx = x + sin(radians(this.dir+dir))*this.length;
        this.centery = y + cos(radians(this.dir+dir))*this.length;
    }
}
var arms = [];
var corners = 5;
var dir = 0;
function setup(){
    createCanvas( window.innerWidth, window.innerHeight );
    var size = min( width, height )/2;
    colorMode(HSB, 100);
    var centerx = width/2;
    var centery = height/2;
    for( var i=0; i<360; i+=360/30 ){
        var s = sin(radians(i))*size/2;
        var c = cos(radians(i))*size/2;
        var arm = new Arm( centerx+s, centery+c, i );
        arm.length = size/5.7;
        arm.radius = size/20;
        arm.offset = -i*corners;
        arm.color = -arm.offset/corners/3.6 % 100;
        arms.push( arm );
    }
    background(50);
}
function draw(){
    background(20);
    arms.forEach( (arm)=>{
        arm.update();
        arm.setCenter( sin(radians(dir/2))*30 );
    });
    dir += 1;
}
