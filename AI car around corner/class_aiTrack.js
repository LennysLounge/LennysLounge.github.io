function AITrack( track ){
    this.corners = [];
    if( track !== undefined ){
        track.corners.forEach( (corner)=>{
            this.corners.push( new AICorner(corner) );
        });
    }

    this.draw = function(){
        this.corners.forEach( (corner)=>{   corner.draw()   });
    }
    this.drawSegment = function( segment ){
        this.corners[ ((segment-1)<0) ? this.corners.length-1 : (segment-1) ].draw();
        this.corners[ (segment+1)%this.corners.length ].draw();
        this.corners[ segment ].draw();
    }
    this.getScore = function(){
        var v = 0;
        this.corners.forEach( (corner)=>{
            v += corner.getScore()
        });
        return v;
    }

    this.evolve = function(){
        for( var segment=0; segment<this.corners.length; segment++ ){
            var current = this.copySegment( segment );
            //console.log("current: ", current.getScore().toFixed(4) );
            for( var i=0; i<1; i++ ){
                var tmp = this.copySegment( segment );
                tmp.iterate();
                if( tmp.getScore() < current.getScore() ){
                    current = tmp;
                }
            }
            //console.log("now: ", current.getScore().toFixed(4) );
            this.copyTrack( current, segment );
        }
    }

    this.copySegment = function( segment ){
        var tmp = new AITrack();
        tmp.corners.push( this.corners[ ((segment-1)<0) ? this.corners.length-1 : (segment-1) ].copy() );
        tmp.corners.push( this.corners[ segment ].copy() );
        tmp.corners.push( this.corners[ (segment+1)%this.corners.length ].copy() );
        return tmp;
    }
    this.copyTrack = function( track, offset ){
        var i = ((offset-1)<0) ? this.corners.length-1 : (offset-1);
        track.corners.forEach( (corner)=>{
            this.corners[i].s = corner.s;
            this.corners[i].m = corner.m;
            this.corners[i].e = corner.e;
            this.corners[i].startOffset = corner.startOffset;
            this.corners[i].endOffset = corner.endOffset;
            this.corners[i].calcPoints();
            i = (i+1)%this.corners.length;
        });
        var start = ((offset-1)<0) ? this.corners.length-1 : (offset-1);
        var prevStart = ((start-1)<0) ? this.corners.length-1 : (start-1);
        this.corners[start].s = this.corners[prevStart].e;
        this.corners[start].startOffset = this.corners[prevStart].endOffset;
        this.corners[start].calcPoints();
        var last = i;
        var prevLast = ((last-1)<0) ? this.corners.length-1 : (last-1);;
        this.corners[prevLast].e = this.corners[last].s;
        this.corners[prevLast].endOffset = this.corners[last].startOffset;
        this.corners[prevLast].calcPoints();
    }

    this.change = 0.2;
    this.changeOffset = 100;
    this.iterate = function(){
        this.changeOffset = 100*this.change;
        //if( this.corners.length != 3 )return;

        cPrev = this.corners[ 0 ];
        cNow = this.corners[ 1 ];
        cNext = this.corners[ 2 ];

        cPrev.startOffset = constrain( cPrev.startOffset+random(-this.changeOffset,this.changeOffset), -cPrev.startOffsetMax, cPrev.startOffsetMax );
        cPrev.endOffset = constrain( cPrev.endOffset+random(-this.changeOffset,this.changeOffset), -cPrev.endOffsetMax, cNow.startOffsetMax );
        cNow.startOffset = cPrev.endOffset;
        cNow.endOffset = constrain( cNow.endOffset+random(-this.changeOffset,this.changeOffset), -cNow.endOffsetMax, cNext.startOffsetMax );
        cNext.startOffset = cNow.endOffset;
        cNext.endOffset = constrain( cNext.endOffset+random(-this.changeOffset,this.changeOffset), -cNext.endOffsetMax, cNext.endOffsetMax );

        cPrev.s = constrain( cPrev.s+random(-this.change, this.change), -1, 1 );
        cPrev.m = constrain( cPrev.m+random(-this.change, this.change), -1, 1 );
        cPrev.e = constrain( cPrev.e+random(-this.change, this.change), -1, 1 );
        cNow.s = cPrev.e;
        cNow.m = constrain( cNow.m+random(-this.change, this.change), -1, 1 );
        cNow.e = constrain( cNow.e+random(-this.change, this.change), -1, 1 );
        cNext.s = cNow.e;
        cNext.m = constrain( cNext.m+random(-this.change, this.change), -1, 1 );
        cNext.e = constrain( cNext.e+random(-this.change, this.change), -1, 1 );

        cPrev.calcPoints();
        cNow.calcPoints();
        cNext.calcPoints();
    }
}
