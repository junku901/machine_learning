/**
 * Created by joonkukang on 2014. 1. 19..
 */
var ml = require('../lib/machine_learning');
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