function Track( x, y ){
    this.x = x;
    this.y = y;
    this.corners = [];
    this.addCorner = function( x1, y1, x2, y2, x3, y3, x4, y4 ){
        this.corners.push(
            new Corner( this.x+x1, this.y+y1, this.x+x2, this.y+y2, this.x+x3, this.y+y3, this.x+x4, this.y+y4 )
        );
    }
    this.addCornerFromPiece = function( piece ){
        this.corners.push( piece );
    }
    this.draw = function(){
        this.corners.forEach( (corner)=>{
            corner.draw();
        })
    }
}
