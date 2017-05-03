moduleController.addModule( function output(){
    Module.call( this );
    this.title = "Output";
    this.in = this.addControll( AudioIn, 0, 60, "In");

    this.AudioObjects = [];
    this.in.onConnect = function(){
        if( this.in.value !== undefined )
            this.in.value.toMaster();
    }
    this.in.onDisconnect = function(){
        if( this.in.value !== undefined )
            this.in.value.disconnect( Tone.Master );
    }
});
