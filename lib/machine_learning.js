/**
 * Created by joonkukang on 2014. 1. 18..
 */

'use strict';

let ml = module.exports;

ml.kmeans = require('./kmeans');

ml.KNN = require('./knn');

ml.SVM = require('./svm');

ml.nmf = require('./nmf');

ml.optimize = require('./optimize');

ml.MLP = require('./mlp');

ml.DecisionTree = require('./DecisionTree');

ml.LogisticRegression = require('./LogisticRegression');
