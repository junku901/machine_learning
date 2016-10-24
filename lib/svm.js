/**
 * Created by joonkukang on 2014. 1. 16..
 */

/* References : http://cs229.stanford.edu/materials/smo.pdf . simplified smo algorithm */
var math = require('./utils').math;

let SVM = module.exports = function (options) {
    var self = this;
    self.x = options['x'];
    self.y = options['y'];
};

SVM.prototype.train = function (options) {
    var self = this;
    var C = options['C'] || 1.0;
    var tol = options['tol'] || 1e-4;
    var maxPasses = options['max_passes'] || 20;
    var alphatol = options['alpha_tol'] || 1e-5;

    self.kernel = getKernel(options['kernel']);
    self.alphas = math.zeroVec(self.x.length);
    self.b = 0;
    var passes = 0, i;
    var count=0;
    while(passes < maxPasses) {
        var numChangedAlphas = 0;

        for(i=0; i<self.x.length; i++) {

            var E_i = self.f(self.x[i]) - self.y[i];

            if((self.y[i] * E_i < -tol && self.alphas[i] < C) || (self.y[i] * E_i > tol && self.alphas[i] >0)) {

                // Randomly selects j (i != j)
                var j = math.randInt(0,self.x.length-1);
                if(i==j) j = (j+1) % self.x.length;

                var E_j = self.f(self.x[j]) - self.y[j];
                var alpha_i_old = self.alphas[i], alpha_j_old = self.alphas[j];

                // Compute L,H
                var L,H;
                if(self.y[i] !== self.y[j]) {
                    L = Math.max(0, self.alphas[j] - self.alphas[i]);
                    H = Math.min(C, C + self.alphas[j] - self.alphas[i]);
                } else {
                    L = Math.max(0, self.alphas[j] + self.alphas[i] - C);
                    H = Math.min(C, self.alphas[j] + self.alphas[i]);
                }

                if(L === H)
                    continue;

                // Compute ETA
                var ETA = 2 * self.kernel(self.x[i],self.x[j]) - self.kernel(self.x[i],self.x[i]) - self.kernel(self.x[j],self.x[j]);
                if(ETA >= 0)
                    continue;

                // Clip new value to alpha_j
                self.alphas[j] -= 1.*self.y[j] * (E_i - E_j) / ETA;
                if(self.alphas[j] > H)
                    self.alphas[j] = H;
                else if(self.alphas[j] < L)
                    self.alphas[j] = L;

                if(Math.abs(self.alphas[j] - alpha_j_old) < alphatol)
                    continue;

                // Clip new value to alpha_i
                self.alphas[i] += self.y[i] * self.y[j] * (alpha_j_old - self.alphas[j]);

                // update b
                var b1 = self.b - E_i - self.y[i] * (self.alphas[i] - alpha_i_old) * self.kernel(self.x[i],self.x[i])
                                - self.y[j] * (self.alphas[j] - alpha_j_old) * self.kernel(self.x[i],self.x[j]);
                var b2 = self.b - E_j - self.y[i] * (self.alphas[i] - alpha_i_old) * self.kernel(self.x[i],self.x[j])
                                - self.y[j] * (self.alphas[j] - alpha_j_old) * self.kernel(self.x[j],self.x[j]);

                if(0 < self.alphas[i] && self.alphas[i] < C)
                    self.b = b1;
                else if(0 < self.alphas[j] && self.alphas[j] < C)
                    self.b = b2;
                else
                    self.b = (b1+b2)/2.0;

                numChangedAlphas ++ ;
            } // end-if
        } // end-for
        if(numChangedAlphas == 0)
            passes++;
        else
            passes = 0;
    }
}

SVM.prototype.predict = function(x) {
    var self = this;
    if(self.f(x) >= 0)
        return 1;
    else
        return -1;
}

SVM.prototype.f = function(x) {
    var self = this;
    var f = 0, j;
    for(j=0; j<self.x.length; j++)
        f += self.alphas[j] * self.y[j] * self.kernel(self.x[j],x);
    f += self.b;
    return f;
}

function getKernel (options) {
    if(typeof options === 'undefined') {
        return function(x,y) {
            var sigma = 1.0;
            return Math.exp(-1.*Math.pow(math.getNormVec(math.minusVec(x,y)),2)/(2*sigma*sigma));
        }
    } else if (typeof options === 'function') {
        return options;
    } else if (options['type'] === 'gaussian') {
        return function(x,y) {
            var sigma = options['sigma'];
            return Math.exp(-1.*Math.pow(math.getNormVec(math.minusVec(x,y)),2)/(2*sigma*sigma));
        }
    } else if (options['type'] === 'linear') {
        return function(x,y) {
            return math.dotVec(x,y);
        }
    } else if (options['type'] === 'polynomial') {
        return function(x,y) {
            var c = options['c'];
            var d = options['d'];
            return Math.pow(math.dotVec(x,y) + c, d);
        }
    }
}
