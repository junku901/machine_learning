/**
 * Created by joonkukang on 2014. 1. 12..
 */
var math = require('./utils').math;
let HiddenLayer = module.exports = function (settings) {
    var self = this;
    self.input = settings['input'];

    if(typeof settings['W'] === 'undefined') {
        var a = 1. / settings['n_in'];
        settings['W'] = math.randMat(settings['n_in'],settings['n_out'],-a,a);
    }
    if(typeof settings['b'] === 'undefined')
        settings['b'] = math.zeroVec(settings['n_out']);
    if(typeof settings['activation'] === 'undefined')
        settings['activation'] = math.sigmoid;

    self.W = settings['W'];
    self.b = settings['b'];
    self.activation = settings['activation'];
}

HiddenLayer.prototype.output = function(input) {
    var self = this;
    if(typeof input !== 'undefined')
        self.input = input;

    var linearOutput = math.addMatVec(math.mulMat(self.input,self.W),self.b);
    return math.activateMat(linearOutput,self.activation);
};

HiddenLayer.prototype.linearOutput = function(input) { // returns the value before activation.
    var self = this;
    if(typeof input !== 'undefined')
        self.input = input;

    var linearOutput = math.addMatVec(math.mulMat(self.input,self.W),self.b);
    return linearOutput;
}

HiddenLayer.prototype.backPropagate = function (input) { // example+num * n_out matrix
    var self = this;
    if(typeof input === 'undefined')
        throw new Error("No BackPropagation Input.")

    var linearOutput = math.mulMat(input, math.transpose(self.W));
    return linearOutput;
}

HiddenLayer.prototype.sampleHgivenV = function(input) {
    var self = this;
    if(typeof input !== 'undefined')
        self.input = input;

    var hMean = self.output();
    var hSample = math.probToBinaryMat(hMean);
    return hSample;
}
