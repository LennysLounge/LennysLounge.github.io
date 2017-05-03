Tone.exp = function(){
    var rtn = new Tone.WaveShaper( (val)=>{
        var i = map( val, 0, 1, Math.log10(20), Math.log10(20480) );
        var rtn = Math.pow( 10, i );
        return rtn;
    },1024);
    return rtn;
}
Tone.CustomGate = function(){
    this.isOpen = false;
    this.target = this;
    this.open = function(){
        this.isOpen = true;
        this.onChange.call( this.target, this.isOpen );
    };
    this.close = function(){
        this.isOpen = false;
        this.onChange.call( this.target, this.isOpen );
    };
    this.disconnect = function(){
        this.target = this;
        this.onChange = function(){};
    }
    this.dispose = function(){}
    this.onChange = function(){};
}
document.onselectstart = function(){return false;}
function setup(){
    var c =  createCanvas( window.innerWidth, window.innerHeight );
    c.canvas.oncontextmenu = ()=>{ return false };

    var mC = moduleController;
    mC.init( addModule );
}
function draw(){
    background(255);
    strokeWeight(1);
    moduleController.update();
}

function mousePressed( e ){ moduleController.mousePressed( e )  };
function mouseReleased( e ){    moduleController.mouseReleased( e ) };

function keyPressed( e ){   moduleController.keyPressed( e );   }
function keyReleased( e ){  moduleController.keyReleased( e );  }


function menuToggle( e ){
    if( e.parentElement.className == "" ){
        e.parentElement.className = "bigMenu";
    }else{
        e.parentElement.className = "";
    }
}
function addModule( e ){
    if (!e) e = window.event;
    if (e.stopPropagation)  e.stopPropagation();
    else    e.cancelBubble = true;


    if( e.button == 0 ){
        var m = moduleController.createModule( this.dataset.index );
        m.setToFollow();
        document.getElementById("menu").className = "";
    }
}
