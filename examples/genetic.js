/**
 * Created by joonkukang on 2014. 1. 19..
 */
var ml = require('../lib/machine_learning');

var costf = function(vec) {
    var cost = 0;
    for(var i =0; i<14;i++) { // 15-dimensional vector
        cost += (0.5*i*vec[i]*Math.exp(-vec[i]+vec[i+1])/vec[i+1])
    }
    cost += (3.*vec[14]/vec[0]);
    return cost;
};

var domain = [];
for(var i=0;i<15;i++)
    domain.push([1,70]); // domain[idx][0] : minimum of vec[idx], domain[idx][1] : maximum of vec[idx].

var vec = ml.optimize.genetic({
    domain : domain,
    costf : costf,
    population : 50,
    elite : 2, // elitism. number of elite chromosomes.
    epochs : 300,
    q : 0.3 // Rank-Based Fitness Assignment. fitness = q * (1-q)^(rank-1)
            // higher q --> higher selection pressure
});

console.log("vec : ",vec);
console.log("cost : ",costf(vec));