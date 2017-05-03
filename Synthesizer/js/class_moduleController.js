var moduleController = {
    connectionStart: undefined,
    MODULES: [],
    modules: [],
    init: function( onmousedown ){
        var list = document.getElementById("list");
        for( var name in this.MODULES ){
            var node = document.createElement("LI");
            node.innerText = name;
            node.dataset["index"] = name;
            node.onmousedown = onmousedown;
            list.appendChild( node );
        }
    },
    createModule: function( module ){
        if(typeof module == "string" )  module = this.MODULES[module];
        if(typeof module == "function" ){
            var m = new module();
            moduleController.modules.push( m );
            return m;
        }
        return false;
    },
    update: function(){
        this.modules.forEach( (module)=>{   module.update();    });
    },
    draw: function(){
        this.modules.forEach( (module)=>{   module.draw();  });
    },
    mousePressed: function( e ){
        this.modules.forEach( (module)=>{   module.mousePressed( e );  });
    },
    mouseReleased: function( e ){
        this.modules.forEach( (module)=>{   module.mouseReleased( e ); });
        this.connectionStart = undefined;
    },
    keyPressed: function( e ){
        this.modules.forEach( (module)=>{   module.keyPressed( e ); });
    },
    keyReleased: function( e ){
        this.modules.forEach( (module)=>{   module.keyReleased( e ); });
    },
    addModule: function( module ){
        this.MODULES[ module.name ] = module;
    },
    deleteModule: function( module ){
        console.log( module );
        var i = this.modules.indexOf( module );
        if( i >= 0 ){
            this.modules.splice( i, 1 );
        }
    },
    makeConnection: function( connector ){
        if( this.connectionStart !== undefined ){
            if( connector.isInput != this.connectionStart.isInput ){
                var output = (connector.isInput)?this.connectionStart:connector;
                var input = (connector.isInput)?connector:this.connectionStart;
                output.connect( input );
                //input.updateValue();
            }
        }
    }
};
