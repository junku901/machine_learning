/**
 * Created by joonkukang on 2014. 1. 16..
 */
var math = require('./utils').math;
let optimize = module.exports;

optimize.hillclimb = function(options){
    var domain = options['domain'];
    var costf = options['costf'];

    var i;
    var vec = [];
    for(i=0 ; i<domain.length ; i++)
        vec.push(math.randInt(domain[i][0],domain[i][1]));

    var current, best;

    while(true) {
        var neighbors = [];
        var i,j;

        for(i=0 ; i<domain.length ; i++) {
            if(vec[i] > domain[i][0]) {
                var newVec = [];
                for(j=0 ; j<domain.length ; j++)
                    newVec.push(vec[j]);
                newVec[i]-=1;
                neighbors.push(newVec);
            } else if (vec[i] < domain[i][1]) {
                var newVec = [];
                for(j=0 ; j<domain.length ; j++)
                    newVec.push(vec[j]);
                newVec[i]+=1;
                neighbors.push(newVec);
            }
        }

        current = costf(vec);
        best = current;
        for(i=0 ; i<neighbors.length ; i++) {
            var cost = costf(neighbors[i]);
            if(cost < best) {
                best = cost;
                vec = neighbors[i];
            }
        }
        if(best === current)
            break;
    }
    return vec;
}

optimize.anneal = function(options){
    var domain = options['domain'];
    var costf = options['costf'];
    var temperature = options['temperature'];
    var cool = options['cool'];
    var step = options['step'];
    var callback

    var i;
    var vec = [];
    for(i=0 ; i<domain.length ; i++)
        vec.push(math.randInt(domain[i][0],domain[i][1]));

    while(temperature > 0.1) {
        var idx = math.randInt(0,domain.length - 1);
        var dir = math.randInt(-step,step);
        var newVec = [];
        for(i=0; i<vec.length ; i++)
            newVec.push(vec[i]);
        newVec[idx]+=dir;
        if(newVec[idx] < domain[idx][0]) newVec[idx] = domain[idx][0];
        if(newVec[idx] > domain[idx][1]) newVec[idx] = domain[idx][1];

        var ea = costf(vec);
        var eb = costf(newVec);
        var p = Math.exp(-1.*(eb-ea)/temperature);
        if(eb < ea || Math.random() < p)
            vec = newVec;

        temperature *= cool;
    }

    return vec;
}

optimize.genetic = function(options){
    var domain = options['domain'];
    var costf = options['costf'];
    var population = options['population'];
    var q = options['q'] || 0.3;
    var elite = options['elite'] || population * 0.04;
    var epochs = options['epochs'] || 100;

    var i,j;
    // Initialize population array
    var pop =[];
    for(i=0; i<population; i++) {
        var vec = [];
        for(j=0; j<domain.length; j++)
            vec.push(math.randInt(domain[j][0],domain[j][1]));
        pop.push(vec);
    }
    pop.sort(function(a,b){return costf(a) - costf(b);});

    for(i=0 ; i<epochs ; i++) {
        // elitism
        var newPop = [];
        for(j=0;j<elite;j++)
            newPop.push(pop[j]);

        // compute fitnesses
        var fitnesses = [];
        for(j=0; j<pop.length; j++)
            fitnesses[j] = q * Math.pow(1-q,j);
        fitnesses = math.normalizeVec(fitnesses);

        // crossover, mutate
        for(j=0; j<pop.length - elite;j++) {
            var idx1 = rouletteWheel(fitnesses);
            var idx2 = rouletteWheel(fitnesses);
            var crossovered = crossover(pop[idx1],pop[idx2]);
            var mutated = mutate(crossovered);
            newPop.push(mutated);
        }

        // replacement
        pop = newPop;
        pop.sort(function(a,b){return costf(a) - costf(b);});
       //console.log("Current Cost : ",costf(pop[0]));
    }
    return pop[0];

    function mutate(vec) {
        var idx = math.randInt(0,domain.length - 1);
        var newVec = [];
        var i;
        for(i=0; i<domain.length ; i++)
            newVec.push(vec[i]);
        newVec[idx] += (Math.random() < 0.5) ? 1 : -1;
        if(newVec[idx] < domain[idx][0]) newVec[idx] = domain[idx][0];
        if(newVec[idx] > domain[idx][1]) newVec[idx] = domain[idx][1];
        return newVec;
    }
    function crossover(vec1,vec2) {
        var idx = math.randInt(0,domain.length - 2);
        var newVec = [];
        var i;
        for(i=0; i<idx ; i++)
            newVec.push(vec1[i]);
        for(i=idx; i<domain.length; i++)
            newVec.push(vec2[i]);
        return newVec;
    }
    function rouletteWheel(vec) {
        var a = [0.0];
        var i;
        for(i=0;i<vec.length;i++) {
            a.push(a[i] + vec[i]);
        }
        var rand = Math.random();
        for(i=0;i< a.length;i++) {
            if(rand > a[i] && rand <= a[i+1])
                return i;
        }
        return -1;
    }
};
