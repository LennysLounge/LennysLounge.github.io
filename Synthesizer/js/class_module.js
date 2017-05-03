function Module( title ){
    this.x = 0;
    this.y = 0;
    this.w = 100;
    this.h = 100;

    this.radius = 0;
    this.margin = 3 ;
    this.textSize = 14;
    this.topMargin = this.textSize+this.margin*2;
    this.title = "";
    this.color = color(255);

    this.follow = false;
    this.followX = 0;
    this.followY = 0;
    this.controlls = [];
    this.objects = [];

    this.createObject = function( func ){
        var obj = func.call( this );
        if( obj !== undefined ){
            obj.parent = this;
            this.objects.push( obj );
            return obj;
        }
        return undefined;
    }
    this.newObject = function(){};
    this.deleteObject = function( obj ){

        var i = this.objects.indexOf( obj );
        console.log( i, obj );
        if( i >= 0 ){
            this.objects[i].disconnect();
            this.objects[i].dispose();
            this.objects.splice( i, 1 );
        }
    }
    this.synthesize = function( array=[], offset="" ){
        console.log(offset,"______ Begin Synthesis _____________");


        var prevModule = undefined;
        var moduleObjects = [];
        array.forEach( (module)=>{
            var obj;
            if( Array.isArray( module ) ){
                console.log( offset, "> Array");
                var chains = [];
                module.forEach( (chain)=>{
                    var synthChain = this.synthesize( chain, offset+"    " );
                    chains.push( synthChain );
                    console.log(offset, "["+synthChain.toString()+"]" );
                });
                console.log(offset, "["+chains.join("|")+"]" );
                var gain = new Tone.Gain(0.2);
                gain.parent = this;
                this.objects.push( gain );

                chains.forEach( (chain)=>{
                    var last = chain[ chain.length-1 ];
                    if( last !== undefined )    last.connect( gain );
                });

                obj = gain;
            }else{// Not an Array
                obj = module.ref.createObject( module.func );
            }
            if( obj !== undefined ){
                moduleObjects.push( obj );

                if( prevModule === undefined ){
                    prevModule = obj;
                }else{
                    console.log(offset,"- "+ (prevModule || "undefined").toString() );
                    console.log( prevModule );
                    console.log( obj );
                    prevModule.connect( obj );
                    prevModule == obj;
                }
            }
            console.log(offset,"> "+ (obj || "undefined").toString() );
        });


        console.log(offset,"______ End Synthesis _____________");
        return moduleObjects;
        /*
        //create Objects
        var totalChains = [];
        var objects = [];
        array.forEach( (module)=>{
            if( Array.isArray( module ) ){
                var chains = [];
                module.forEach( (chain)=>{
                    var synthChain = this.synthesize( chain );
                    chains.push( synthChain );
                });
                console.log("chains:", chains );
                totalChains = totalChains.concat( chains );
                var gain = new Tone.Gain(0.2);
                gain.parent = this;
                this.objects.push( gain );
                chains.forEach( (chain)=>{
                    var last = chain[ chain.length-1 ];
                    if( last !== undefined ){
                        last.connect( gain );
                    }
                });
                objects.push( gain );
            }else{
                var obj = module.ref.createObject( module.func );
                if( obj !== undefined ) objects.push( obj );
            }
        });
        console.log("total Chains:", totalChains );

        return [];
        */
    }
    this.addControll = function( obj, x, y, title="", unit="" ){
        var o = new obj( this, x, y, title, unit )
        this.controlls.push( o );
        return o;
    }
    this.setPosition = function( x, y ){
        this.x = x;
        this.y = y;
    }
    this.setToFollow = function(){
        this.x = mouseX;
        this.y = mouseY;
        this.follow = true;
        this.followX = -this.w/2 - min(0,this.x - this.w/2);
        this.followY = -this.textSize/2-this.margin;
    }
    this.destroy = function(){
        this.controlls.forEach( (con)=>{
            if( con.disconnect )    con.disconnect();
        });
        moduleController.deleteModule( this );
    }
    this.mousePressed = function( e ){
        //clicked on the header
        if( mouseY > this.y && mouseY < this.y+this.textSize+this.margin*2 && mouseX > this.x && mouseX < this.x+this.w ){
            this.follow = true;
            this.followX = this.x - mouseX;
            this.followY = this.y - mouseY;
        }
        this.controlls.forEach( (obj)=>{    obj.mousePressed( e );   });
    }
    this.mouseReleased = function( e ){
        this.follow = false;
        if( this.x < 0 ) this.destroy();
        this.controlls.forEach( (obj)=>{    obj.mouseReleased( e );   });
    }
    this.keyPressed = function( e ){};
    this.keyReleased = function( e ){};
    this.update = function(){
        Module.prototype.update.call(this);
    }
    this.draw = function(){
        Module.prototype.draw.call(this);
    }
}
Module.prototype.update = function(){
    if( this.follow ){
        this.x = mouseX + this.followX;
        this.y = mouseY + this.followY;
    }
    this.draw();
    this.controlls.forEach( (obj)=>{    obj.update();   });
}
Module.prototype.draw = function(){
    if( this.follow ){
        fill( 200 );
        var y = this.textSize+this.margin*2;
        rect( this.x, this.y, this.w, y, this.radius, this.radius, 0, 0 );
    }
    fill( this.color );
    stroke(0);
    rect( this.x, this.y, this.w, this.h, this.radius );
    line( this.x, this.y+this.topMargin, this.x+this.w, this.y+this.topMargin );

    if( this.follow ){
        fill( 0, 50 );
        var y = this.textSize+this.margin*2;
        rect( this.x, this.y, this.w, y, this.radius, this.radius, 0, 0 );
    }

    fill(0);
    noStroke();
    textSize(14);
    textFont("Arial");
    textAlign( CENTER, TOP );
    text( this.title, this.x+this.w/2, this.y+3 );
}
Module.prototype.destroy = function(){};
