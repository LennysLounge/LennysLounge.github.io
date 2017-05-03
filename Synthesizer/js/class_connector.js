function Connector( parent, x, y, name="" ){
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.xoffset = x;
    this.yoffset = y;
    this.name = name;
    this.size = 10;
    this.connections = [];
    this.isInput = false;
    this.value = undefined;


    this.clicked = false;
    this.mousePressed = function( e ){
        if( this.isMouseOver() ){
            if( e.button == 0 ){
                this.clicked = true;
                moduleController.connectionStart = this;
            }
            if( e.button == 2 ){
                this.disconnect();
            }
            if( e.button == 1 ){
                console.log("info:",(this.value || "undefined").toString() );
            }
        }
    };
    this.mouseReleased = function( e ){
        this.clicked = false;
        if( this.isMouseOver() ){
            moduleController.makeConnection( this );
        }
    };
    this.isMouseOver = function(){
        var dx = mouseX - this.x;
        var dy = mouseY - this.y;
        return sqrt(dx*dx + dy*dy) < this.size/2;
    }

    this.update = function(){
        this.x =this.parent.x + this.xoffset;
        this.y =this.parent.y + this.yoffset;
        this.draw();
    };

    this.onConnect = function(){};
    this.onDisconnect = function(){};
    this.connect = function( inputConnector ){
        this.connections.push( inputConnector );
        inputConnector.onDisconnect.call( inputConnector.parent );
        inputConnector.connections.length = 0;
        inputConnector.connections.push( this );
        inputConnector.updateValue();
        if( this.connections.length == 1 ){
            this.onConnect.call( this.parent );
        }
        inputConnector.onConnect.call( inputConnector.parent );
    }
    this.disconnect = function( connection ){
        if( connection == undefined ){
            this.connections.forEach( (connection)=>{
                connection.disconnect( this );
            });
            this.connections.length = 0;
            this.onDisconnect.call( this.parent );
        }else{
            var i = this.connections.indexOf( connection );
            this.connections.splice( i, 1 );
            if( this.connections.length == 0 ){
                this.onDisconnect.call( this.parent );
            }
        }
        if( this.isInput ){
            this.value = undefined;
            this.onChange.call( this.parent );
        }
    }
    this.setValue = function( value ){
        this.value = value;
        if( !this.isInput ){
            this.connections.forEach( (con)=>{  con.updateValue();  });
        }
        this.onChange.call( this.parent );
    }
    this.updateValue = function(){
        if( this.isInput ){
            this.connections.forEach( (con)=>{  this.value = con.value  });
            this.onChange.call( this.parent );
        }
    }
    this.onChange = function(){};
    this.drawConnections = function(){
        if( this.isInput ){
            this.connections.forEach( (con)=>{
                bezier(
                    this.x+0.5, this.y+0.5,
                    (this.x+con.x)/2, this.y+0.5,
                    (this.x+con.x)/2, con.y+0.5,
                    con.x, con.y+0.5
                );
            });
        }
    }
}
Connector.prototype.draw = function(){
    noFill();
    stroke(0);
    this.drawConnections();
    if( this.isMouseOver() ){
        ellipse( this.x+0.5, this.y+0.5, this.size/1.5, this.size/1.5 );
        textAlign( LEFT, BOTTOM );
        noStroke();
        fill(0);
        if( this.isInput ) textAlign( RIGHT );
        text( this.name, this.x+((this.isInput)? -5 : 5), this.y );
        noFill();
        stroke(0);
    }
    if( this.clicked ){
        line( this.x, this.y, mouseX, mouseY );
    }

}


function AudioIn( parent, x, y, name="" ){
    Connector.call(this, parent, x, y, name );
    this.isInput = true;
    this.connect = undefined;
    this.draw = function(){
        Connector.prototype.draw.call(this);
        bezier(
            this.x+1, this.y-this.size/2+0.5,
            this.x+1+this.size/1.6,this.y-this.size/2+0.5,
            this.x+1+this.size/1.6,this.y+this.size/2+0.5,
            this.x+1,this.y+this.size/2+0.5
        );
        line( this.x, this.y, this.x+this.size/5, this.y );
    }
}
function ControllIn( parent, x, y, name="" ){
    Connector.call(this, parent, x, y, name );
    this.isInput = true;
    this.connect = undefined;
    this.draw = function(){
        Connector.prototype.draw.call(this);
        rect( this.x, this.y-this.size/2, this.size/2, this.size );
        line( this.x, this.y, this.x+this.size/5, this.y );
    }
}
function GateIn( parent, x, y, name="" ){
    Connector.call(this, parent, x, y, name );
    this.isInput = true;
    this.connect = undefined;
    this.draw = function(){
        Connector.prototype.draw.call(this);
        line( this.x, this.y-this.size/2, this.x+this.size/2, this.y );
        line( this.x, this.y+this.size/2, this.x+this.size/2, this.y );
        line( this.x, this.y, this.x+this.size/5, this.y );
    }
}
function AudioOut( parent, x, y, name="" ){
    Connector.call(this, parent, x, y, name );
    this.value = [{ref:this.parent,func:this.parent.newObject}];
    this.draw = function(){
        Connector.prototype.draw.call(this);
        bezier(this.x, this.y-this.size/2+0.5,this.x-this.size/1.6,
            this.y-this.size/2+0.5,this.x-this.size/1.6,
            this.y+this.size/2+0.5,this.x, this.y+this.size/2+0.5 );
        line( this.x, this.y, this.x-this.size/5, this.y );
    }
}
function ControllOut( parent, x, y, name="" ){
    Connector.call(this, parent, x, y, name );
    this.value = [{ref:this.parent,func:this.parent.newObject}];
    this.draw = function(){
        Connector.prototype.draw.call(this);
        rect( this.x, this.y-this.size/2, -this.size/2, this.size );
        line( this.x, this.y, this.x-this.size/5, this.y );
    }
}
function GateOut( parent, x, y, name="" ){
    Connector.call(this, parent, x, y, name );
    this.value = [{ref:this.parent,func:this.parent.newObject}];
    this.draw = function(){
        Connector.prototype.draw.call(this);
        line( this.x, this.y-this.size/2, this.x-this.size/2, this.y );
        line( this.x, this.y+this.size/2, this.x-this.size/2, this.y );
        line( this.x, this.y, this.x-this.size/5, this.y );
    }
}
