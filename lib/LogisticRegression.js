/**
 * Created by joonkukang on 2014. 1. 12..
 */
var math = require('./utils').math;
let LogisticRegression = module.exports = function (settings) {
    var self = this;
    self.x = settings['input'];
    self.y = settings['label'];
    self.W = math.zeroMat(settings['n_in'],settings['n_out']);
    self.b = math.zeroVec(settings['n_out']);
    self.settings = {
        'log level' : 1 // 0 : nothing, 1 : info, 2: warn
    };
};

LogisticRegression.prototype.train = function (settings) {
    var self = this;
    var lr = 0.1, epochs = 200;
    if(typeof settings['input'] !== 'undefined')
        self.x = settings['input'];
    if(typeof settings['lr'] !== 'undefined')
        lr = settings['lr'];
    if(typeof settings['epochs'] !== 'undefined')
        epochs = settings['epochs'];
    var i;
    var currentProgress = 1;
    for(i=0;i<epochs;i++) {
        var probYgivenX = math.softmaxMat(math.addMatVec(math.mulMat(self.x,self.W),self.b));
        var deltaY = math.minusMat(self.y,probYgivenX);

        var deltaW = math.mulMat(math.transpose(self.x),deltaY);
        var deltaB = math.meanMatAxis(deltaY,0);

        self.W = math.addMat(self.W,math.mulMatScalar(deltaW,lr));
        self.b = math.addVec(self.b,math.mulVecScalar(deltaB,lr));
        if(self.settings['log level'] > 0) {
            var progress = (1.*i/epochs)*100;
            if(progress > currentProgress) {
                console.log("LogisticRegression",progress.toFixed(0),"% Completed.");
                currentProgress++;
            }
        }
    }
    if(self.settings['log level'] > 0)
        console.log("LogisticRegression Final Cross Entropy : ",self.getReconstructionCrossEntropy());
};

LogisticRegression.prototype.getReconstructionCrossEntropy = function () {
    var self = this;
    var probYgivenX = math.softmaxMat(math.addMatVec(math.mulMat(self.x,self.W),self.b));
    var a = math.mulMatElementWise(self.y, math.activateMat(probYgivenX,Math.log));
    var b = math.mulMatElementWise(math.mulMatScalar(math.addMatScalar(self.y,-1),-1),
        math.activateMat(math.mulMatScalar(math.addMatScalar(probYgivenX,-1),-1),Math.log));
    var crossEntropy = -math.meanVec(math.sumMatAxis(math.addMat(a,b),1));
    return crossEntropy;
};

LogisticRegression.prototype.predict = function (x) {
    var self = this;
    return math.softmaxMat(math.addMatVec(math.mulMat(x,self.W),self.b));
};

LogisticRegression.prototype.set = function(property,value) {
    var self = this;
    self.settings[property] = value;
}
