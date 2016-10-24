/**
 * Created by joonkukang on 2014. 1. 16..
 */
var math = require('./utils').math;
let Kmeans = module.exports;

Kmeans.cluster = function(options) {
    var data = options['data'];
    var k = options['k'];
    var distance = getDistanceFunction(options['distance']);
    var epochs = options['epochs'];
    var init_using_data = options['init_using_data'];
    if(typeof init_using_data === "undefined");
        init_using_data = true;
    var means = getRandomMeans(data,k, init_using_data);

    var epoch, i, j, l;
    var clusters = [];
    for(i=0 ; i<k ; i++)
        clusters.push([]);

    for(epoch=0 ; epoch<epochs ; epoch++) {
        clusters = [];
        for(i=0 ; i<k ; i++)
            clusters.push([]);

        // Find which centroid is the closest for each row
        for(i=0 ; i<data.length ; i++) {
            var bestmatch = 0;
            for(j=0 ; j<k ; j++) {
                if(distance(means[j],data[i]) < distance(means[bestmatch],data[i])) bestmatch = j;
            }
            clusters[bestmatch].push(i);
        }

        // Move the centroids to the average of their members
        for(i=0 ; i<k ; i++) {
            var avgs = [];
            for(j=0 ; j<data[0].length ; j++)
                avgs.push(0.0);
            if(clusters[i].length > 0) {
                for(j=0 ; j<clusters[i].length ; j++) {
                    for(l=0 ; l<data[0].length ; l++) {
                        avgs[l] += data[clusters[i][j]][l];
                    }
                }
                for(j=0 ; j<data[0].length ; j++) {
                    avgs[j] /= clusters[i].length;
                }
                means[i] = avgs;
            }
        }
    }
    return {
        clusters : clusters,
        means : means
    };
}

var getRandomMeans = function(data,k, init_using_data) {
    var clusters = [];
    if(init_using_data) {
        var cluster_index = math.range(data.length);
        cluster_index = math.shuffle(cluster_index);
        for(i=0 ; i<k ; i++) {
            clusters.push(data[cluster_index[i]]);
        }
    } else {
        var i,j;
        var ranges = [];
        for(i=0 ; i<data[0].length ; i++) {
            var min = data[0][i] , max = data[0][i];
            for(j=0 ; j<data.length ; j++) {
                if(data[j][i] < min) min = data[j][i];
                if(data[j][i] > max) max = data[j][i];
            }
            ranges.push([min,max]);
        }
        for(i=0 ; i<k ; i++) {
            var cluster = [];
            for(j=0 ; j<data[0].length;j++) {
                cluster.push(Math.random() * (ranges[j][1] - ranges[j][0]) + ranges[j][0]);
            }
            clusters.push(cluster);
        }
    }
    return clusters;
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
