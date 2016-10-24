/**
 * Created by joonkukang on 2014. 1. 16..
 */
var math = require('./utils').math;
let KNN = module.exports = function (options) {
    var self = this;
    self.data = options['data'];
    self.result = options['result'];
}

KNN.prototype.predict = function(options) {
    var self = this;
    var x = options['x'];
    var k = options['k'] || 3;
    var weightf = getWeightedFunction(options['weightf']);
    var distance = getDistanceFunction(options['distance']);
    var distanceList = [];
    var i;
    for(i=0; i<self.data.length; i++)
        distanceList.push([distance(x,self.data[i]),i]);
    distanceList.sort(function(a,b) {return a[0]-b[0];});
    var avg = 0.0;
    var totalWeight = 0, weight;
    for(i=0; i<k; i++) {
        var dist = distanceList[i][0];
        var idx = distanceList[i][1];
        weight = weightf(dist);
        avg += weight * self.result[idx];
        totalWeight += weight;
    }

    avg /= totalWeight;
    return avg;
};

function getWeightedFunction(options) {
    if(typeof options === 'undefined') {
        return function(x) {
            var sigma = 10.0;
            return Math.exp(-1.*x*x/(2*sigma*sigma));
        }
    } else if(typeof options === 'function') {
        return options;
    } else if(options['type'] === 'gaussian') {
        return function(x) {
            var sigma = options['sigma'];
            return Math.exp(-1.*x*x/(2*sigma*sigma));
        }
    } else if(options['type'] === 'none') {
        return function(dist) {
            return 1.0;
        }
    }
}

function getDistanceFunction(options) {
    if(typeof options === 'undefined') {
        return math.euclidean;
    } else if (typeof options === 'function') {
        return options;
    } else if (options['type'] === 'euclidean') {
        return math.euclidean;
    } else if (options['type'] === 'pearson') {
        return math.pearson;
    }
}
