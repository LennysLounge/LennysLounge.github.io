var p = [];
var t = [];
var n = 0;
var axis = 1;   //1 = x | -1 = y
var speed = 30
var blob = false;
var c = 0;
var prevRot = 0;

var angle = 30 * Math.PI/180;
var rotation = 45 * Math.PI/180;

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function setup(){
    createCanvas(window.innerWidth,window.innerHeight);
    stroke(255);
    strokeWeight(4);
    strokeJoin(ROUND);
    colorMode(HSB,255)
    p.push( new Point(  0, 0, 0 ) );
    p.push( new Point(  -100, 0, 0 ) );
    p.push( new Point(  0, 0, 100 ) );
    p.push( new Point(  -100, 0, 100 ) );

    p.push( new Point(  0, 100, 0 ) );
    p.push( new Point(  -100, 100, 0 ) );
    p.push( new Point(  0, 100, 100 ) );
    p.push( new Point(  -100, 100, 100 ) );


    t.push( new Point( p[0].x, p[0].y, 0 ) );
    t.push( new Point( p[1].x, p[1].y, 0 ) );
    t.push( new Point( p[4].x, p[4].y, 0 ) );
    t.push( new Point( p[5].x, p[5].y, 0 ) );

}
function draw(){
    background(255);
    translate( width/2, height/2 );


    var h = map( cos(n/speed*PI/2+PI/4), cos(PI/4), cos(PI/4*3), 0, 1 );
    //translate( 50*cos(PI/4)*axis, 50*sin(radians(45))*h )
    translate( 50*cos(PI/4)*axis, 50*sin(radians(45))*n/speed )


    //t.forEach( (point)=>{   point.draw();   });
    fill(0);
    stroke(0);
    //p.forEach( (point)=>{   point.draw();   });

    stroke(0);
    for( var i=t.length-4; i>=0; i-=4 ){
        pLine( t[i], t[i+1] );
        pLine( t[i], t[i+2] );
        pLine( t[i+1], t[i+3] );
        pLine( t[i+2], t[i+3] );
    }

    c = (c+0.001) % 1;
    fill( c*255, map(sin(PI*2*c),1,-1,100,255), map(cos(PI*4*(c+0.316)),1,-1,150,255));
    stroke(255);

    beginShape()
    pVertex( p[6] );
    pVertex( p[7] );
    pVertex( p[3] );
    pVertex( p[2] );
    endShape();

    pLine( p[2], p[6] );
    pLine( p[7], p[6] );

    beginShape()
    pVertex( p[5] );
    pVertex( p[4] );
    pVertex( p[0] );
    pVertex( p[1] );
    endShape();

    pLine( p[5], p[4] );
    pLine( p[0], p[4] );

    beginShape()
    pVertex( p[0] );
    pVertex( p[1] );
    pVertex( p[3] );
    pVertex( p[2] );
    endShape();

    beginShape()
    pVertex( p[3] );
    pVertex( p[7] );
    pVertex( p[5] );
    pVertex( p[1] );
    endShape();


    pLine( p[0], p[1] );    pLine( p[0], p[2] );    pLine( p[3], p[2] );
    pLine( p[7], p[5] );    pLine( p[7], p[3] );    pLine( p[5], p[1] );
    pLine( p[1], p[3] );



    var rot = map( cos(PI*n/speed), 1, -1, 0, -90 );
    var rot = rot - prevRot;
    prevRot += rot;
    p.forEach( (point)=>{   point.rotate( radians(rot), axis )    });
    n++;
    if( n/speed >= 0.43333333 && blob==false ){
        blob = true;
    }
    if( n >= speed ){
        n = 0;
        prevRot = 0;
        blob = false;
        p.forEach( (point)=>{   point.reset()    });
        p.forEach( (point)=>{   point.translate( 100*axis, -100*axis, 0 ) });
        axis *= -1;

        t.forEach( (point)=>{   point.translate( -100*(axis==1), -100*(axis==-1), 0 ) });

        t.push( new Point( p[0].x, p[0].y, 0 ) );
        t.push( new Point( p[1].x, p[1].y, 0 ) );
        t.push( new Point( p[4].x, p[4].y, 0 ) );
        t.push( new Point( p[5].x, p[5].y, 0 ) );
    }
}

function toIsometric( x, y, z ){
    var zHeight = cos( angle );
    var height = sin( angle );

    var x_ = x*cos(rotation) - y*sin(rotation);
    var y_ = x*sin(rotation) + y*cos(rotation);

    y_ *= height;
    y_ += z*zHeight;

    y_ *= -1;

    return { x:x_, y:y_ };
}
function pLine( start, end ){
    var pos1 = toIsometric( start.x, start.y, start.z );
    var pos2 = toIsometric( end.x, end.y, end.z );
    line( pos1.x, pos1.y, pos2.x, pos2.y );
}
function pVertex( p ){
    var pos = toIsometric( p.x, p.y, p.z );
    vertex( pos.x, pos.y );
}
function Point( x, y, z ){
    this.x = x;
    this.y = y;
    this.z = z;
    this.sx = x;
    this.sy = y;
    this.sz = z;

    this.rotate = function( a, axis ){

        if( axis == 1 ) var base = this.x;
        if( axis == -1 ) var base = this.y;

        var top = this.z;
        var d = sqrt( base*base + top*top );
        var angle = atan2( top, base );
        angle += a;

        //top
        this.z = sin(angle)*d;

        //base
        if( axis == 1 ) this.x = cos(angle)*d;
        if( axis == -1 ) this.y = cos(angle)*d;
    }
    this.reset = function(){
        this.x = this.sx;
        this.y = this.sy;
        this.z = this.sz;
    }
    this.translate = function( x, y, z ){
        this.x += x;
        this.y += y;
        this.z += z;
        this.sx += x;
        this.sy += y;
        this.sz += z;
    }
    this.draw = function(){
        var pos = toIsometric( this.x, this.y, this.z );
        ellipse( pos.x, pos.y, 5 );

        fill(255);
        text(p.indexOf( this ), pos.x+5, pos.y-5);
    }
}
