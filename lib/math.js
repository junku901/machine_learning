/**
 * Created by joonkukang on 2014. 1. 12..
 */
let m = module.exports;

m.randn = function() {
    // generate random guassian distribution number. (mean : 0, standard deviation : 1)
    var v1, v2, s;

    do {
        v1 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
        v2 = 2 * Math.random() - 1;   // -1.0 ~ 1.0 까지의 값
        s = v1 * v1 + v2 * v2;
    } while (s >= 1 || s == 0);

    s = Math.sqrt( (-2 * Math.log(s)) / s );
    return v1 * s;
}

m.shape = function(mat) {
    var row = mat.length;
    var col = mat[0].length;
    return [row,col];
};

m.addVec = function(vec1, vec2) {
    if(vec1.length === vec2.length) {
        var result = [];
        var i;
        for(i=0;i<vec1.length;i++)
            result.push(vec1[i]+vec2[i]);
        return result;
    } else {
        throw new Error("Length Error : not same.")
    }
}

m.minusVec = function(vec1,vec2) {
    if(vec1.length === vec2.length) {
        var result = [];
        var i;
        for(i=0;i<vec1.length;i++)
            result.push(vec1[i]-vec2[i]);
        return result;
    } else {
        throw new Error("Length Error : not same.")
    }
};

m.addMatScalar = function(mat,scalar) {
    var row = m.shape(mat)[0];
    var col = m.shape(mat)[1];
    var i , j,result = [];
    for(i=0 ; i<row ; i++) {
        var rowVec = [];
        for(j=0 ; j<col ; j++) {
            rowVec.push(mat[i][j] + scalar);
        }
        result.push(rowVec);
    }
    return result;
}

m.addMatVec = function(mat,vec) {
    if(mat[0].length === vec.length) {
        var result = [];
        var i;
        for(i=0;i<mat.length;i++)
            result.push(m.addVec(mat[i],vec));
        return result;
    } else {
        throw new Error("Length Error : not same.")
    }
}

m.minusMatVec = function(mat,vec) {
    if(mat[0].length === vec.length) {
        var result = [];
        var i;
        for(i=0;i<mat.length;i++)
            result.push(m.minusVec(mat[i],vec));
        return result;
    } else {
        throw new Error("Length Error : not same.")
    }
}

m.addMat = function (mat1, mat2) {
    if ((mat1.length === mat2.length) && (mat1[0].length === mat2[0].length)) {
        var result = new Array(mat1.length);
        for (var i = 0; i < mat1.length; i++) {
            result[i] = new Array(mat1[i].length);
            for (var j = 0; j < mat1[i].length; j++) {
                result[i][j] = mat1[i][j] + mat2[i][j];
            }
        }
        return result;
    } else {
        throw new Error('Matrix mismatch.');
    }
};

m.minusMat = function(mat1, mat2) {
    if ((mat1.length === mat2.length) && (mat1[0].length === mat2[0].length)) {
        var result = new Array(mat1.length);
        for (var i = 0; i < mat1.length; i++) {
            result[i] = new Array(mat1[i].length);
            for (var j = 0; j < mat1[i].length; j++) {
                result[i][j] = mat1[i][j] - mat2[i][j];
            }
        }
        return result;
    } else {
        throw new Error('Matrix mismatch.');
    }
}

m.transpose = function (mat) {
    var result = new Array(mat[0].length);
    for (var i = 0; i < mat[0].length; i++) {
        result[i] = new Array(mat.length);
        for (var j = 0; j < mat.length; j++) {
            result[i][j] = mat[j][i];
        }
    }
    return result;
};

m.dotVec = function (vec1, vec2) {
    if (vec1.length === vec2.length) {
        var result = 0;
        for (var i = 0; i < vec1.length; i++) {
            result += vec1[i] * vec2[i];
        }
        return result;
    } else {
        throw new Error("Vector mismatch");
    }
};

m.outerVec = function (vec1,vec2) {
    var mat1 = m.transpose([vec1]);
    var mat2 = [vec2];
    return m.mulMat(mat1,mat2);
};

m.mulVecScalar = function(vec,scalar) {
    var i, result = [];
    for(i=0;i<vec.length;i++)
        result.push(vec[i]*scalar);
    return result;
};

m.mulMatScalar = function(mat,scalar) {
    var row = m.shape(mat)[0];
    var col = m.shape(mat)[1];
    var i , j,result = [];
    for(i=0 ; i<row ; i++) {
        var rowVec = [];
        for(j=0 ; j<col ; j++) {
            rowVec.push(mat[i][j] * scalar);
        }
        result.push(rowVec);
    }
    return result;
};

m.mulMatElementWise = function(mat1, mat2) {
    if (mat1.length === mat2.length && mat1[0].length === mat2[0].length) {
        var result = new Array(mat1.length);

        for (var x = 0; x < mat1.length; x++) {
            result[x] = new Array(mat1[0].length);
        }

        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = mat1[i][j] * mat2[i][j]
            }
        }
        return result;
    } else {
        throw new Error("Matrix shape error : not same");
    }
};

m.mulMat = function (mat1, mat2) {
    if (mat1[0].length === mat2.length) {
        var result = new Array(mat1.length);

        for (var x = 0; x < mat1.length; x++) {
            result[x] = new Array(mat2[0].length);
        }


        var mat2_T = m.transpose(mat2);
        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = m.dotVec(mat1[i],mat2_T[j]);
            }
        }
        return result;
    } else {
        throw new Error("Array mismatch");
    }
};

m.sumVec = function(vec) {
    var sum = 0;
    var i = vec.length;
    while (i--) {
        sum += vec[i];
    }
    return sum;
};

m.sumMat = function(mat) {
    var sum = 0;
    var i = mat.length;
    while (i--) {
        for(var j=0;j<mat[0].length;j++)
          sum += mat[i][j];
    }
    return sum;
};

m.sumMatAxis = function(mat,axis) {
    // default axis 0;
    // axis 0 : mean of col vector . axis 1 : mean of row vector
    if(axis === 1) {
        var row = m.shape(mat)[0];
        var i ;
        var result = [];
        for(i=0 ; i<row; i++)
            result.push(m.sumVec(mat[i]));
        return result;
    } else {
        mat_T = m.transpose(mat);
        return m.sumMatAxis(mat_T,1);
    }
};

m.meanVec = function(vec) {
    return 1. * m.sumVec(vec) / vec.length;
};

m.meanMat = function(mat) {
    var row = mat.length;
    var col = mat[0].length;
    return 1. * m.sumMat(mat) / (row * col);
};

m.meanMatAxis = function(mat,axis) {
    // default axis 0;
    // axis 0 : mean of col vector . axis 1 : mean of row vector
    if(axis === 1) {
        var row = m.shape(mat)[0];
        var i ;
        var result = [];
        for(i=0 ; i<row; i++)
            result.push(m.meanVec(mat[i]));
        return result;
    } else {
        mat_T = m.transpose(mat);
        return m.meanMatAxis(mat_T,1);
    }
};

m.squareVec = function(vec) {
    var squareVec = [];
    var i;
    for(i=0;i<vec.length;i++) {
        squareVec.push(vec[i]*vec[i]);
    }
    return squareVec;
};

m.squareMat = function(mat) {
    var squareMat = [];
    var i;
    for(i=0;i<mat.length;i++) {
        squareMat.push(m.squareVec(mat[i]));
    }
    return squareMat;
};

m.minVec = function(vec) {
    var min = vec[0];
    var i = vec.length;
    while (i--) {
        if (vec[i] < min)
            min = vec[i];
    }
    return min;
};

m.maxVec = function(vec) {
    var max = vec[0];
    var i = vec.length;
    while (i--) {
        if (vec[i] > max)
            max = vec[i];
    }
    return max;
}

m.minMat = function(mat) {
    var min = mat[0][0];
    var i = mat.length;
    while (i--) {
        for(var j=0;j<mat[0].length;j++) {
            if(mat[i][j] < min)
                min = mat[i][j];
        }
    }
    return min;
};

m.maxMat = function(mat) {
    var max = mat[0][0];
    var i = mat.length;
    while (i--) {
        for(var j=0;j<mat[0].length;j++) {
            if(mat[i][j] < max)
                max = mat[i][j];
        }
    }
    return max;
};

m.zeroVec = function(n) {
    var vec = [];
    while(vec.length < n)
        vec.push(0);
    return vec;
};

m.zeroMat = function(row,col) {
    var mat = [];
    while(mat.length < row)
        mat.push(m.zeroVec(col));
    return mat;
};

m.oneVec = function(n) {
    var vec = [];
    while(vec.length < n)
        vec.push(1);
    return vec;
};

m.oneMat = function(row,col) {
    var mat = [];
    while(mat.length < row)
        mat.push(m.oneVec(col));
    return mat;
};

m.randVec = function(n,lower,upper) {
    lower = (typeof lower !== 'undefined') ? lower : 0;
    upper = (typeof upper !== 'undefined') ? upper : 1;
    var vec = [];
    while(vec.length < n)
        vec.push(lower + (upper-lower) * Math.random());
    return vec;
};

m.randMat = function(row,col,lower,upper) {
    lower = (typeof lower !== 'undefined') ? lower : 0;
    upper = (typeof upper !== 'undefined') ? upper : 1;
    var mat = [];
    while(mat.length < row)
        mat.push(m.randVec(col,lower,upper));
    return mat;
};

m.randnVec = function(n,mean,sigma) {
    var vec = [];
    while(vec.length < n)
        vec.push(mean+sigma* m.randn());
    return vec;
};

m.randnMat = function(row,col,mean,sigma) {
    var mat = [];
    while(mat.length < row)
        mat.push(m.randnVec(col,mean,sigma));
    return mat;
};

m.identity = function (n) {
    var result = new Array(n);

    for (var i = 0; i < n ; i++) {
        result[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            result[i][j] = (i === j) ? 1 : 0;
        }
    }

    return result;
};

m.sigmoid = function(x) {
    var sigmoid = (1. / (1 + Math.exp(-x)))
    if(sigmoid ==1) {
     //   console.warn("Something Wrong!! Sigmoid Function returns 1. Probably javascript float precision problem?\nSlightly Controlled value to 1 - 1e-14")
        sigmoid = 0.99999999999999; // Javascript Float Precision Problem.. This is a limit of javascript.
    } else if(sigmoid ==0) {
      //  console.warn("Something Wrong!! Sigmoid Function returns 0. Probably javascript float precision problem?\nSlightly Controlled value to 1e-14")
        sigmoid = 1e-14;
    }
    return sigmoid; // sigmoid cannot be 0 or 1;;
};

m.dSigmoid = function(x){
    a = m.sigmoid(x);
    return a * (1. - a);
};

m.probToBinaryMat = function(mat) {
    var row = m.shape(mat)[0];
    var col = m.shape(mat)[1];
    var i,j;
    var result = [];

    for(i=0;i<row;i++) {
        var rowVec = [];
        for(j=0;j<col;j++) {
            if(Math.random() < mat[i][j])
                rowVec.push(1);
            else
                rowVec.push(0);
        }
        result.push(rowVec);
    }
    return result;
};

m.activateVec = function(vec,activation) {
    var i, result = [];
    for(i=0;i<vec.length;i++)
        result.push(activation(vec[i]));
    return result;
};

m.activateMat = function(mat,activation) {
    var row = m.shape(mat)[0];
    var col = m.shape(mat)[1];
    var i, j,result = [];
    for(i=0;i<row;i++) {
        var rowVec = [];
        for(j=0;j<col;j++)
            rowVec.push(activation(mat[i][j]));
        result.push(rowVec);
    }
    return result;
};

m.activateTwoVec = function(vec1, vec2,activation) {
    if (vec1.length === vec2.length) {
        var result = new Array(vec1.length);
        for (var i = 0; i < result.length; i++) {
            result[i] = activation(vec1[i],vec2[i]);
        }
        return result;
    } else {
        throw new Error("Matrix shape error : not same");
    }
};

m.activateTwoMat = function(mat1, mat2,activation) {
    if (mat1.length === mat2.length && mat1[0].length === mat2[0].length) {
        var result = new Array(mat1.length);

        for (var x = 0; x < mat1.length; x++) {
            result[x] = new Array(mat1[0].length);
        }

        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].length; j++) {
                result[i][j] = activation(mat1[i][j],mat2[i][j]);
            }
        }
        return result;
    } else {
        throw new Error("Matrix shape error : not same");
    }
};

m.fillVec = function(n,value) {
    var vec = [];
    while(vec.length < n)
        vec.push(value);
    return vec;
};

m.fillMat = function(row,col,value) {
    var mat = [];
    while(mat.length < row) {
        var rowVec = [];
        while(rowVec.length < col)
            rowVec.push(value);
        mat.push(rowVec);
    }
    return mat;
};

m.softmaxVec = function(vec) {
    var max = m.maxVec(vec);
    var preSoftmaxVec = m.activateVec(vec,function(x) {return Math.exp(x - max);})
    return m.activateVec(preSoftmaxVec,function(x) {return x/ m.sumVec(preSoftmaxVec)})
};

m.softmaxMat = function(mat) {
    var result=[], i;
    for(i=0 ; i<mat.length ; i++)
        result.push(m.softmaxVec(mat[i]));
    return result;
};

m.randInt = function(min,max) {
  var rand = Math.random() * (max - min + 0.9999) + min
  return Math.floor(rand);
}

m.normalizeVec = function(vec) {
    var i;
    var newVec = [],tot = 0;
    for(i=0; i<vec.length; i++)
        tot += vec[i];
    for(i=0; i<vec.length;i++)
        newVec.push(1.*vec[i]/tot);
    return newVec;
};

m.euclidean = function(x1,x2) {
    var i;
    var distance = 0;
    for(i=0 ; i<x1.length; i++) {
        var dx = x1[i] - x2[i];
        distance += dx * dx;
    }
    return Math.sqrt(distance);
};

m.pearson = function(x, y)
{
    var xy = [];
    var x2 = [];
    var y2 = [];

    for(var i=0; i<x.length; i++)
    {
        xy.push(x[i] * y[i]);
        x2.push(x[i] * x[i]);
        y2.push(y[i] * y[i]);
    }

    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_x2 = 0;
    var sum_y2 = 0;

    for(var i=0; i<x.length; i++)
    {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += xy[i];
        sum_x2 += x2[i];
        sum_y2 += y2[i];
    }

    var step1 = (x.length * sum_xy) - (sum_x * sum_y);
    var step2 = (x.length * sum_x2) - (sum_x * sum_x);
    var step3 = (x.length * sum_y2) - (sum_y * sum_y);
    var step4 = Math.sqrt(step2 * step3);
    var answer = step1 / step4;

    return answer;
};

m.getNormVec = function(vec) {
    var i;
    var sqsum = 0;
    for(i=0; i<vec.length; i++)
        sqsum += vec[i] * vec[i];
    return Math.sqrt(sqsum);
}

m.gaussian = function(x, sigma) {
    sigma = sigma || 10.0;
    return Math.exp(-1.*x*x/(2*sigma*sigma));
}

m.meanVecs = function(vecs) {
    var sum = m.zeroVec(vecs[0].length);
    var i;
    for(i=0; i<vecs.length; i++)
        sum = m.addVec(sum,vecs[i]);
    return m.activateVec(sum,function(x) {return 1.*x/vecs.length;});
};

m.covarianceVecs = function(vecs) {
    var mat = m.zeroMat(vecs[0].length,vecs[0].length);
    var meanVec = m.meanVecs(vecs);
    var i;
    for(i=0; i<vecs.length; i++) {
        var a = m.minusVec(vecs[i],meanVec);
        mat = m.addMat(mat, m.mulMat(m.transpose([a]),[a]));
    }
    return m.activateMat(mat,function(x) { return 1.*x/(vecs.length-1);});
};

m.shuffle = function(arr){
    var o = [];
    for(var i=0;i<arr.length;i++)
        o.push(arr[i]); // deep copy
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

m.range = function(start, end, step) {
    var ret = [];
    if(typeof step === "undefined")
        step = 1;
    if(typeof end === "undefined") {
        end = start;
        start = 0;
    }
    for(var i=start;i<end;i+=step)
        ret.push(i);
    return ret;
};
// For CRBM
/*
m.phi = function(mat,vec,low,high) {
    var i;
    var result = [];
    for(i=0;i<mat.length;i++) {
        result.push(m.activateTwoVec(mat[i],vec,function(x,y){return low+(high-low)* m.sigmoid(x*y);}))
    }
    return result;
}
*/
