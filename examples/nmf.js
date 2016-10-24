/**
 * Created by joonkukang on 2014. 1. 19..
 */
var ml = require('../lib/machine_learning');
var matrix = [[22,28],
              [49,64]];

var result = ml.nmf.factorize({
    matrix : matrix,
    features : 3,
    epochs : 100
});

console.log("First Matrix : ",result[0]);
console.log("Second Matrix : ",result[1]);