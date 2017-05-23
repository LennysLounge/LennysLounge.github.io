var verbose = false;
function AICorner( corner ){
    this.corner = corner;
    this.points = [];

    this.s = 0;
    this.m = 0;
    this.e = 0;
    this.startOffset = 0;
    this.endOffset = 0;
    this.startOffsetMax = corner.start.copy().sub(corner.c1).mag();
    this.endOffsetMax = corner.end.copy().sub(corner.c2).mag();
    this.calcPoints = function(){
        var point = corner.points[0];
        this.start = createVector( point.x+point.tx*corner.width/2*this.s, point.y+point.ty*corner.width/2*this.s );
        this.startDir = atan2( point.ty, point.tx )-PI/2;
        this.start.x += cos(this.startDir)*this.startOffset;
        this.start.y += sin(this.startDir)*this.startOffset;

        var point = corner.points[ round(corner.sections*0.5) ];
        this.mid = createVector( point.x+point.tx*corner.width/2*this.m, point.y+point.ty*corner.width/2*this.m );
        this.midDir = atan2( point.ty, point.tx )-PI/2;

        var point = corner.points[ corner.sections ];
        this.end = createVector( point.x+point.tx*corner.width/2*this.e, point.y+point.ty*corner.width/2*this.e );
        this.endDir = atan2( point.ty, point.tx )-PI/2;
        this.end.x += cos(this.endDir)*this.endOffset;
        this.end.y += sin(this.endDir)*this.endOffset;


        this.startMid = findIntersection(
            this.start.x, this.start.y,
            this.start.x+cos(this.startDir), this.start.y+sin(this.startDir),
            this.mid.x, this.mid.y,
            this.mid.x+cos(this.midDir), this.mid.y+sin(this.midDir),
        );
        this.midEnd = findIntersection(
            this.mid.x, this.mid.y,
            this.mid.x+cos(this.midDir), this.mid.y+sin(this.midDir),
            this.end.x, this.end.y,
            this.end.x+cos(this.endDir), this.end.y+sin(this.endDir),
        );


        this.points = [];
        for( var i=0; i<10; i++ ){
            this.points.push({
                x: bezier3Point( this.start.x, this.startMid.x, this.mid.x, i/9 ),
                y: bezier3Point( this.start.y, this.startMid.y, this.mid.y, i/9 ),
                t: bezier3Tangent(  this.start.x, this.start.y, this.startMid.x, this.startMid.y, this.mid.x, this.mid.y, i/9 ),
            });
        }

        for( var i=1; i<10; i++ ){
            this.points.push({
                x: bezier3Point( this.mid.x, this.midEnd.x, this.end.x, i/9 ),
                y: bezier3Point( this.mid.y, this.midEnd.y, this.end.y, i/9 ),
                t: bezier3Tangent( this.mid.x, this.mid.y, this.midEnd.x, this.midEnd.y, this.end.x, this.end.y, i/9 ),
            });
        }


    }
    this.calcPoints();
    this.getScore = function(){
        var sum = 0;
        var prev = this.points[0];
        for( var i=1; i<this.points.length; i++ ){
            var angle = angleDifference( this.points[i].t, prev.t );
            var dist = pointDistance( this.points[i].x, this.points[i].y, prev.x, prev.y );

            sum += abs( pow(angle,2)/dist );
            //sum += dist;
            //sum += abs(pow(angle,2));
            prev = this.points[i];
        }
        return sum;
    }
    this.copy = function(){
        var c = new AICorner( this.corner );
        c.s = this.s;
        c.m = this.m;
        c.e = this.e;
        c.startOffset = this.startOffset;
        c.endOffset = this.endOffset;
        c.calcPoints();
        return c;
    }
    this.draw = function(){
        stroke(255,0,0);strokeWeight(2);noFill();

        /*
        ellipse( this.start.x, this.start.y, 10, 10 );
        ellipse( this.end.x, this.end.y, 10, 10 );
        ellipse( this.mid.x, this.mid.y, 10, 10 );
        */

        bezier3( this.start.x, this.start.y, this.startMid.x, this.startMid.y, this.mid.x, this.mid.y );
        bezier3( this.mid.x, this.mid.y, this.midEnd.x, this.midEnd.y, this.end.x, this.end.y );

        this.points.forEach( (point)=>{
            //ellipse( point.x, point.y, 5, 5 );
        });

    }
}

function angleDifference( a1, a2 ){
    var dif = atan2( sin(a1-a2), cos(a1-a2) );
    return dif;
}
function pointDistance( p1x, p1y, p2x, p2y ){
    return sqrt( pow(p1x-p2x,2) + pow(p1y-p2y,2) );
}
function bezier3( p1x, p1y, p2x, p2y, p3x, p3y ){
    prevx = p1x;
    prevy = p1y;
    var steps = 50;
    for( var i=1; i<steps; i++ ){
        var t = i/(steps-1);
        cx = bezier3Point( p1x, p2x, p3x, t );
        cy = bezier3Point( p1y, p2y, p3y, t );
        line( prevx, prevy, cx, cy );
        prevx = cx;
        prevy = cy;
    }
}
function bezier3Point( p1x, p2x, p3x, t ){
    var ax = p1x*(1-t)+p2x*t;
    var bx = p2x*(1-t)+p3x*t;
    return ax*(1-t)+bx*t;
}
function bezier3Tangent( p1x, p1y, p2x, p2y, p3x, p3y, t ){
    var ax = p1x*(1-t)+p2x*t;
    var ay = p1y*(1-t)+p2y*t;
    var bx = p2x*(1-t)+p3x*t;
    var by = p2y*(1-t)+p3y*t;
    return atan2( ay-by, ax-bx );
}
function findIntersection( p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y ){
    //Check infinities
    var m1,m2,b1,b2,x,y;
    if( (p1x-p2x)!=0 ){
        m1 = (p2y-p1y)/(p2x-p1x);
    }
    if( (p3x-p4x)!=0 ){
        m2 = (p4y-p3y)/(p4x-p3x);
    }
    m1 = round(m1*1000)/1000;
    m2 = round(m2*1000)/1000;
    if( m1 == 0 && m2 == 0 ){
        //console.log("both are parallel");
        var x = (p1x+p3x)/2;
        var y = (p1y+p3y)/2;
        return createVector( x, y );

    }
    if( m1 == m2 ){
        //console.log("both are parallel");
        var x = (p1x+p3x)/2;
        var y = (p1y+p3y)/2;
        return createVector( x, y );
    }
    if( (p1x-p2x)==0 ){
        if( (p3x-p4x)==0 ){
            //console.log("both are vertical");
            var x = (p1x+p3x)/2;
            var y = (p1y+p3y)/2;
            return createVector( x, y );
        }else{
            var y = p3y-m2*(p3x-p1x);
            var x = p1x;
            return createVector( x, y );
        }
    }
    if( (p3x-p4x)==0 ){
        var y = p1y-m1*(p1x-p3x);
        var x = p3x;
        return createVector( x, y );
    }


    var b1 = p1y-m1*p1x;
    var b2 = p3y-m2*p3x;

    var x = (b2-b1)/(m1-m2);
    var y = m1*x+b1;
    return createVector( x, y );
}
