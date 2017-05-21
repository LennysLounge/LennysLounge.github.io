var file = `806,44,806,94
769.89,44,769.89,94
715.21,44,715.21,94
646.86,44,646.86,94
569.74,44,569.74,94
488.75,44,488.75,94
408.78,44,408.78,94
334.72,44,334.72,94
271.47,44,271.47,94
223.93,44,223.93,94
195.44,44.05,198.56,93.95
165.05,48.12,177.97,96.43
138.05,60.08,164.91,102.26
117.52,78.56,156.42,109.98
104.58,101.55,151.50,118.81
99.76,126.86,149.74,128.14
103.34,152.40,150.98,137.23
115.46,175.90,155.20,145.55
135.70,194.80,162.94,152.87
162.76,206.88,175.62,158.57
193.46,210.95,196.54,161.05
222.73,211.03,222.80,161.03
272.38,211.10,272.46,161.10
338.45,211.22,338.54,161.22
415.47,211.35,415.56,161.35
497.96,211.50,498.04,161.50
580.44,211.65,580.53,161.65
657.46,211.78,657.55,161.78
723.54,211.90,723.62,161.90
773.19,211.97,773.27,161.97`;
var track = [];
function splitFile(){
    var lines = file.split(/\n/);
    var numbers;
    lines.forEach((line)=>{
        var numbers = line.split(",");
        var obj = {
            x1: parseInt(numbers[0]),
            y1: parseInt(numbers[1]),
            x2: parseInt(numbers[2]),
            y2: parseInt(numbers[3]),
        };
        obj.x = ( obj.x1 + obj.x2 ) / 2;
        obj.y = ( obj.y1 + obj.y2 ) / 2;
        track.push( obj );
    });
}
splitFile();
function drawTrack(){
    var prev = track[0];
    track.forEach((pos)=>{
        stroke(255);
        strokeWeight(4);
        point( pos.x, pos.y );
        strokeWeight(1);
        line( prev.x1, prev.y1, pos.x1, pos.y1 );
        line( prev.x2, prev.y2, pos.x2, pos.y2 );
        stroke(100);
        line( pos.x1, pos.y1, pos.x2, pos.y2 );

        prev = pos;
    });
}
function getDirection( x1, y1, x2, y2 ){
    return atan2( x1-x2, y1-y2 );
}
