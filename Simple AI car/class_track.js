function TrackPiece( x1, y1, x2, y2, x3, y3, x4, y4 ){
    this.start = createVector( x1, y1 );
    this.c1 = createVector( x2, y2 );
    this.c2 = createVector( x3, y3 );
    this.end = createVector( x4, y4 );

    this.points = [];
    this.sections = 50;
    this.width = 50;
    this.s = -1;
    this.e = -1;
    this.m = 1;
    for( var i=0; i<=this.sections; i++ ){
        var x = bezierPoint( this.start.x, this.c1.x, this.c2.x, this.end.x, i/this.sections );
        var y = bezierPoint( this.start.y, this.c1.y, this.c2.y, this.end.y, i/this.sections );
        var tx =  bezierTangent( this.start.x, this.c1.x, this.c2.x, this.end.x, i/this.sections );
        var ty =  bezierTangent( this.start.y, this.c1.y, this.c2.y, this.end.y, i/this.sections );
        var normal = atan2( ty, tx )+PI/2;

        var n = i/(this.sections);
        t = ( this.s*(1-n) + this.e*n );
        t += (cos( n*PI*2+PI + sin(n*PI*2)/4 )+1)/2*(this.m-t);
        t *= this.width/2;
        this.points.push({
            x:x,
            y:y,
            tx:cos(normal),
            ty:sin(normal),
            t:t,
        });
    }


    this.draw = function(){
        stroke(255);fill(255);strokeWeight(1);
        ellipse( this.start.x, this.start.y, 5, 5 );
        noFill();
        /*
        bezier(
            this.start.x, this.start.y,
            this.c1.x, this.c1.y,
            this.c2.x, this.c2.y,
            this.end.x, this.end.y
        )
        */
        var w = this.width/2;
        var point, prev;
        point = this.points[0];
        line(point.x-point.tx*w, point.y-point.ty*w,point.x+point.tx*w, point.y+point.ty*w);
        point = this.points[ this.points.length-1 ];
        line(point.x-point.tx*w, point.y-point.ty*w,point.x+point.tx*w, point.y+point.ty*w);
        for( var i=0; i<this.points.length; i++ ){
            point = this.points[i];
            //line(point.x-point.tx*w, point.y-point.ty*w,point.x+point.tx*w, point.y+point.ty*w);
            if( i>0 ){
                line(point.x-point.tx*w, point.y-point.ty*w, prev.x-prev.tx*w, prev.y-prev.ty*w );
                line(point.x+point.tx*w, point.y+point.ty*w, prev.x+prev.tx*w, prev.y+prev.ty*w );
            }
            prev = point;
        }

        stroke(255,0,0);fill(255,0,0);strokeWeight(3);
        for( var i=0; i<this.points.length; i++ ){
            point = this.points[i];
            if( i>0 )
                line( prev.x+prev.tx*prev.t, prev.y+prev.ty*prev.t, point.x+point.tx*point.t, point.y+point.ty*point.t );
            prev = point;
            prevt = t;
        }
    }
}
