/**
 * Created by joonkukang on 2014. 1. 16..
 */
var utils = require('./utils');
var math = utils.math;
let nmf = module.exports;

nmf.factorize = function(options) {
    var fc = options['features'];
    var matrix = options['matrix'];
    var epochs = options['epochs'];
    var row = math.shape(matrix)[0], col = math.shape(matrix)[1];
    var a = math.randMat(row,fc,0,1);
    var b = math.randMat(fc,col,0,1);

    var i;
    for(i=0 ; i<epochs; i++) {
        var ab = math.mulMat(a,b)
      //  cost = difcost(ab,matrix);
      //  if(i % 10 ==0) console.log("cost ",cost);
      //  if(cost == 0) break;
        var bn = math.mulMat(math.transpose(a),matrix);
        var bd = math.mulMat(math.mulMat(math.transpose(a),a),b);

        b = math.activateTwoMat(math.mulMatElementWise(b,bn),bd,function(x,y){return x/y});

        var an = math.mulMat(matrix, math.transpose(b));
        var ad = math.mulMat(math.mulMat(a,b), math.transpose(b));

        a = math.activateTwoMat(math.mulMatElementWise(a,an),ad,function(x,y){return x/y});
    }
    return [a,b];
}

function difcost(mat1,mat2) {
    var row = math.shape(mat1)[0], col = math.shape(mat1)[1];
    var i , j, difcost=0;
    for(i=0;i<row;i++)
        for(j=0;j<col;j++)
            difcost += Math.pow(mat1[i][j] - mat2[i][j],2);
    return difcost;
}
