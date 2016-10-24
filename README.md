# machine_learning

Machine learning library for node.js. You can also use this library in browser.

[Demo in Browser!](http://joonku.com/project/machine_learning)

[API Documentation](http://joonku.com/project/machine_learning/apidoc)
## Installation

Node.js
```
$ npm install machine_learning
```

To use this library in browser, include [machine_learning.min.js](http://joonku.com/js/machine_learning.min.js) file.

```html
<script src="/js/machine_learning.min.js"></script>
```

[Demo in Browser!](http://joonku.com/project/machine_learning)

Here is the [API Documentation](http://joonku.com/project/machine_learning/apidoc). (Still in progress)
## Features

  * Logistic Regression
  * MLP (Multi-Layer Perceptron)
  * SVM (Support Vector Machine)
  * KNN (K-nearest neighbors)
  * K-means clustering
  * 3 Optimization Algorithms (Hill-Climbing, Simulated Annealing, Genetic Algorithm)
  * Decision Tree
  * NMF (non-negative matrix factorization)

## Implementation Details

SVM is using Sequential Minimal Optimization (SMO) for its training algorithm.

For Decision Tree, Classification And Regression Tree (CART) was used for its building algorithm.

# Usage

## Logistic Regression
```javascript
var ml = require('machine_learning');
var x = [[1,1,1,0,0,0],
         [1,0,1,0,0,0],
         [1,1,1,0,0,0],
         [0,0,1,1,1,0],
         [0,0,1,1,0,0],
         [0,0,1,1,1,0]];
var y = [[1, 0],
         [1, 0],
         [1, 0],
         [0, 1],
         [0, 1],
         [0, 1]];

var classifier = new ml.LogisticRegression({
    'input' : x,
    'label' : y,
    'n_in' : 6,
    'n_out' : 2
});

classifier.set('log level',1);

var training_epochs = 800, lr = 0.01;

classifier.train({
    'lr' : lr,
    'epochs' : training_epochs
});

x = [[1, 1, 0, 0, 0, 0],
     [0, 0, 0, 1, 1, 0],
     [1, 1, 1, 1, 1, 0]];

console.log("Result : ",classifier.predict(x));
```

## MLP (Multi-Layer Perceptron)
```javascript
var ml = require('machine_learning');
var x = [[0.4, 0.5, 0.5, 0.,  0.,  0.],
         [0.5, 0.3,  0.5, 0.,  0.,  0.],
         [0.4, 0.5, 0.5, 0.,  0.,  0.],
         [0.,  0.,  0.5, 0.3, 0.5, 0.],
         [0.,  0.,  0.5, 0.4, 0.5, 0.],
         [0.,  0.,  0.5, 0.5, 0.5, 0.]];
var y = [[1, 0],
         [1, 0],
         [1, 0],
         [0, 1],
         [0, 1],
         [0, 1]];

var mlp = new ml.MLP({
    'input' : x,
    'label' : y,
    'n_ins' : 6,
    'n_outs' : 2,
    'hidden_layer_sizes' : [4,4,5]
});

mlp.set('log level',1); // 0 : nothing, 1 : info, 2 : warning.

mlp.train({
    'lr' : 0.6,
    'epochs' : 20000
});

a = [[0.5, 0.5, 0., 0., 0., 0.],
     [0., 0., 0., 0.5, 0.5, 0.],
     [0.5, 0.5, 0.5, 0.5, 0.5, 0.]];

console.log(mlp.predict(a));
```

## SVM (Support Vector Machine)
```javascript
var ml = require('machine_learning');
var x = [[0.4, 0.5, 0.5, 0.,  0.,  0.],
         [0.5, 0.3,  0.5, 0.,  0.,  0.01],
         [0.4, 0.8, 0.5, 0.,  0.1,  0.2],
         [1.4, 0.5, 0.5, 0.,  0.,  0.],
         [1.5, 0.3,  0.5, 0.,  0.,  0.],
         [0., 0.9, 1.5, 0.,  0.,  0.],
         [0., 0.7, 1.5, 0.,  0.,  0.],
         [0.5, 0.1,  0.9, 0.,  -1.8,  0.],
         [0.8, 0.8, 0.5, 0.,  0.,  0.],
         [0.,  0.9,  0.5, 0.3, 0.5, 0.2],
         [0.,  0.,  0.5, 0.4, 0.5, 0.],
         [0.,  0.,  0.5, 0.5, 0.5, 0.],
         [0.3, 0.6, 0.7, 1.7,  1.3, -0.7],
         [0.,  0.,  0.5, 0.3, 0.5, 0.2],
         [0.,  0.,  0.5, 0.4, 0.5, 0.1],
         [0.,  0.,  0.5, 0.5, 0.5, 0.01],
         [0.2, 0.01, 0.5, 0.,  0.,  0.9],
         [0.,  0.,  0.5, 0.3, 0.5, -2.3],
         [0.,  0.,  0.5, 0.4, 0.5, 4],
         [0.,  0.,  0.5, 0.5, 0.5, -2]];

var y =  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1];

var svm = new ml.SVM({
    x : x,
    y : y
});

svm.train({
    C : 1.1, // default : 1.0. C in SVM.
    tol : 1e-5, // default : 1e-4. Higher tolerance --> Higher precision
    max_passes : 20, // default : 20. Higher max_passes --> Higher precision
    alpha_tol : 1e-5, // default : 1e-5. Higher alpha_tolerance --> Higher precision

    kernel : { type: "polynomial", c: 1, d: 5}
    // default : {type : "gaussian", sigma : 1.0}
    // {type : "gaussian", sigma : 0.5}
    // {type : "linear"} // x*y
    // {type : "polynomial", c : 1, d : 8} // (x*y + c)^d
    // Or you can use your own kernel.
    // kernel : function(vecx,vecy) { return dot(vecx,vecy);}
});

console.log("Predict : ",svm.predict([1.3,  1.7,  0.5, 0.5, 1.5, 0.4]));
```

## KNN (K-nearest neighbors)
```javascript
var ml = require('machine_learning');

var data = [[1,0,1,0,1,1,1,0,0,0,0,0,1,0],
            [1,1,1,1,1,1,1,0,0,0,0,0,1,0],
            [1,1,1,0,1,1,1,0,1,0,0,0,1,0],
            [1,0,1,1,1,1,1,1,0,0,0,0,1,0],
            [1,1,1,1,1,1,1,0,0,0,0,0,1,1],
            [0,0,1,0,0,1,0,0,1,0,1,1,1,0],
            [0,0,0,0,0,0,1,1,1,0,1,1,1,0],
            [0,0,0,0,0,1,1,1,0,1,0,1,1,0],
            [0,0,1,0,1,0,1,1,1,1,0,1,1,1],
            [0,0,0,0,0,0,1,1,1,1,1,1,1,1],
            [1,0,1,0,0,1,1,1,1,1,0,0,1,0]
           ];

var result = [23,12,23,23,45,70,123,73,146,158,64];

var knn = new ml.KNN({
    data : data,
    result : result
});

var y = knn.predict({
    x : [0,0,0,0,0,0,0,1,1,1,1,1,1,1],
    k : 3,

    weightf : {type : 'gaussian', sigma : 10.0},
    // default : {type : 'gaussian', sigma : 10.0}
    // {type : 'none'}. weight == 1
    // Or you can use your own weight f
    // weightf : function(distance) {return 1./distance}

    distance : {type : 'euclidean'}
    // default : {type : 'euclidean'}
    // {type : 'pearson'}
    // Or you can use your own distance function
    // distance : function(vecx, vecy) {return Math.abs(dot(vecx,vecy));}
});

console.log(y);
```

## K-means clustering
```javascript
var ml = require('machine_learning');

var data = [[1,0,1,0,1,1,1,0,0,0,0,0,1,0],
            [1,1,1,1,1,1,1,0,0,0,0,0,1,0],
            [1,1,1,0,1,1,1,0,1,0,0,0,1,0],
            [1,0,1,1,1,1,1,1,0,0,0,0,1,0],
            [1,1,1,1,1,1,1,0,0,0,0,0,1,1],
            [0,0,1,0,0,1,0,0,1,0,1,1,1,0],
            [0,0,0,0,0,0,1,1,1,0,1,1,1,0],
            [0,0,0,0,0,1,1,1,0,1,0,1,1,0],
            [0,0,1,0,1,0,1,1,1,1,0,1,1,1],
            [0,0,0,0,0,0,1,1,1,1,1,1,1,1],
            [1,0,1,0,0,1,1,1,1,1,0,0,1,0]
           ];

var result = ml.kmeans.cluster({
    data : data,
    k : 4,
    epochs: 100,

    distance : {type : "pearson"}
    // default : {type : 'euclidean'}
    // {type : 'pearson'}
    // Or you can use your own distance function
    // distance : function(vecx, vecy) {return Math.abs(dot(vecx,vecy));}
});

console.log("clusters : ", result.clusters);
console.log("means : ", result.means);
```

## Hill-Climbing
```javascript
var ml = require('machine_learning');

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

var vec = ml.optimize.hillclimb({
    domain : domain,
    costf : costf
});

console.log("vec : ",vec);
console.log("cost : ",costf(vec));
```

## Simulated Annealing
```javascript
var ml = require('machine_learning');

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

var vec = ml.optimize.anneal({
    domain : domain,
    costf : costf,
    temperature : 100000.0,
    cool : 0.999,
    step : 4
});

console.log("vec : ",vec);
console.log("cost : ",costf(vec));
```

## Genetic Algorithm
```javascript
var ml = require('machine_learning');

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
```

## Decision Tree
```javascript
// Reference : 'Programming Collective Intellignece' by Toby Segaran.

var ml = require('machine_learning');

var data =[['slashdot','USA','yes',18],
           ['google','France','yes',23],
           ['digg','USA','yes',24],
           ['kiwitobes','France','yes',23],
           ['google','UK','no',21],
           ['(direct)','New Zealand','no',12],
           ['(direct)','UK','no',21],
           ['google','USA','no',24],
           ['slashdot','France','yes',19],
           ['digg','USA','no',18,],
           ['google','UK','no',18,],
           ['kiwitobes','UK','no',19],
           ['digg','New Zealand','yes',12],
           ['slashdot','UK','no',21],
           ['google','UK','yes',18],
           ['kiwitobes','France','yes',19]];
var result = ['None','Premium','Basic','Basic','Premium','None','Basic','Premium','None','None','None','None','Basic','None','Basic','Basic'];

var dt = new ml.DecisionTree({
    data : data,
    result : result
});

dt.build();

// dt.print();

console.log("Classify : ", dt.classify(['(direct)','USA','yes',5]));

dt.prune(1.0); // 1.0 : mingain.
dt.print();
```

## NMF (Non-negative matrix factorization)
```javascript
var ml = require('machine_learning');
var matrix = [[22,28],
              [49,64]];

var result = ml.nmf.factorize({
    matrix : matrix,
    features : 3,
    epochs : 100
});

console.log("First Matrix : ",result[0]);
console.log("Second Matrix : ",result[1]);
```

##License

(The MIT License)

Copyright (c) 2014 Joon-Ku Kang &lt;junku901@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
