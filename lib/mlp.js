/**
 * Created by joonkukang on 2014. 1. 14..
 */
var math = require('./utils').math;
let HiddenLayer = require('./HiddenLayer');
let MLP = module.exports = function (settings) {
    var self = this;
    self.x = settings['input'];
    self.y = settings['label'];
    self.sigmoidLayers = [];
    self.nLayers = settings['hidden_layer_sizes'].length;
    self.settings = {
        'log level' : 1 // 0 : nothing, 1 : info, 2: warn
    };
    var i;
    for(i=0 ; i<self.nLayers+1 ; i++) {
        var inputSize, layerInput;
        if(i == 0)
            inputSize = settings['n_ins'];
        else
            inputSize = settings['hidden_layer_sizes'][i-1];

        if(i == 0)
            layerInput = self.x;
        else
            layerInput = self.sigmoidLayers[self.sigmoidLayers.length-1].sampleHgivenV();

        var sigmoidLayer;
        if(i == self.nLayers) {
            sigmoidLayer = new HiddenLayer({
                'input' : layerInput,
                'n_in' : inputSize,
                'n_out' : settings['n_outs'],
                'activation' : math.sigmoid,
                'W' : (typeof settings['w_array'] === 'undefined')? undefined : settings['w_array'][i],
                'b' : (typeof settings['b_array'] === 'undefined')? undefined : settings['b_array'][i]
            });
        } else {
            sigmoidLayer = new HiddenLayer({
                'input' : layerInput,
                'n_in' : inputSize,
                'n_out' : settings['hidden_layer_sizes'][i],
                'activation' : math.sigmoid,
                'W' : (typeof settings['w_array'] === 'undefined')? undefined : settings['w_array'][i],
                'b' : (typeof settings['b_array'] === 'undefined')? undefined : settings['b_array'][i]
            });
        }
        self.sigmoidLayers.push(sigmoidLayer);
    }
};

MLP.prototype.train = function(settings) {
    var self = this;
    var lr = 0.6, epochs = 1000;
    if(typeof settings['lr'] !== 'undefined')
        lr = settings['lr'];
    if(typeof settings['epochs'] !== 'undefined')
        epochs = settings['epochs'];


    var epoch;
    var currentProgress = 1;
    for(epoch=0 ; epoch < epochs ; epoch++) {

        // Feed Forward
        var i;
        var layerInput = [];
        layerInput.push(self.x);
        for(i=0; i<self.nLayers+1 ; i++) {
            layerInput.push(self.sigmoidLayers[i].output(layerInput[i]));
        }
        var output = layerInput[self.nLayers+1];
        // Back Propagation
        var delta = new Array(self.nLayers + 1);
        delta[self.nLayers] = math.mulMatElementWise(math.minusMat(self.y, output),
            math.activateMat(self.sigmoidLayers[self.nLayers].linearOutput(layerInput[self.nLayers]), math.dSigmoid));

        /*
         self.nLayers = 3 (3 hidden layers)
         delta[3] : ouput layer
         delta[2] : 3rd hidden layer, delta[0] : 1st hidden layer
         */
        for(i = self.nLayers - 1; i>=0 ; i--) {
            delta[i] = math.mulMatElementWise(self.sigmoidLayers[i+1].backPropagate(delta[i+1]),
                math.activateMat(self.sigmoidLayers[i].linearOutput(layerInput[i]), math.dSigmoid));
        }
        // Update Weight, Bias
        for(var i=0; i<self.nLayers+1 ; i++) {
            var deltaW = math.activateMat(math.mulMat(math.transpose(layerInput[i]),delta[i]),function(x){return 1. * x / self.x.length;})
            var deltaB = math.meanMatAxis(delta[i],0);
            self.sigmoidLayers[i].W = math.addMat(self.sigmoidLayers[i].W,deltaW);
            self.sigmoidLayers[i].b = math.addVec(self.sigmoidLayers[i].b,deltaB);
        }

        if(self.settings['log level'] > 0) {
            var progress = (1.*epoch/epochs)*100;
            if(progress > currentProgress) {
                console.log("MLP",progress.toFixed(0),"% Completed.");
                currentProgress+=8;
            }
        }
    }
    if(self.settings['log level'] > 0)
        console.log("MLP Final Cross Entropy : ",self.getReconstructionCrossEntropy());
};

MLP.prototype.getReconstructionCrossEntropy = function() {
    var self = this;
    var reconstructedOutput = self.predict(self.x);
    var a = math.activateTwoMat(self.y,reconstructedOutput,function(x,y){
        return x*Math.log(y);
    });

    var b = math.activateTwoMat(self.y,reconstructedOutput,function(x,y){
        return (1-x)*Math.log(1-y);
    });

    var crossEntropy = -math.meanVec(math.sumMatAxis(math.addMat(a,b),1));
    return crossEntropy
}

MLP.prototype.predict = function(x) {
    var self = this;
    var output = x;
    for(i=0; i<self.nLayers+1 ; i++) {
        output = self.sigmoidLayers[i].output(output);
    }
    return output;
};

MLP.prototype.set = function(property,value) {
    var self = this;
    self.settings[property] = value;
}
