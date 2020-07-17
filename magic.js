const fs = require('fs');
const math = require('mathjs');
const Papa = require('papaparse');
const { multiply } = require('mathjs');

console.log('Sanity Check');

// Setting up the variables about to be used
const file= fs.createReadStream('housing.csv');

var unfilteredData = []; //where all the data will be stored
var initalValues;

// Setup theta that reads size of y and returns a # of zeros for theta
// might need a json for this
// some func
Papa.parse(file, {
    worker: true,
    step: result => {
        unfilteredData.push(result);
    },
    complete: (result, file) => {
        initalValues = InitVariables(unfilteredData); // values used in the start of it
        //console.log(math.multiply(initalValues.X, initalValues.theta));
        initalValues.X = math.concat(math.ones(1460,1), normalizeData(initalValues.X));
        //initalValues.theta = gradientDescent(initalValues.theta,initalValues.X,initalValues.y,1,10);
        initalValues.theta = normalEqt(initalValues.X, initalValues.y);
        console.log(`Theta Values are now ${initalValues.theta}`);
    }
})

// Get Data for designing the X matrix and also output of Y as well
// void function
const InitVariables = data => {
    let features = [];
    let output = [];
    data.forEach(element => {
        features.push([parseInt(element.data[19])]); 
        output.push([parseInt(element.data[element.data.length-1])]);
    });
    features.shift();
    output.shift();
    return {
        theta: math.matrix([[0],[0]]),
        X: math.matrix(features),
        y: math.matrix(output)
    };
}

// Compute cost on how bad the error was
// float function
const computeCost = (theta, X, y) => {
    let m = y.size()[0];
    prediction = math.multiply(X, theta);
    error = (1/(2*m)) * math.sum(math.dotPow(math.subtract(prediction,y),2)); 
    return error;
}

// Gradient descent that changes theta
const gradientDescent = (theta, X, y, alpha,iterations) => {
    let m = y.size()[0];
    let optimizedTheta = theta;
    for(var i=0; i < iterations; ++i) {
        let predictions = math.multiply(X, optimizedTheta);
        let derivedError = math.subtract(predictions,y);
        let firstThetaRow = math.multiply((1/m),math.sum(math.dotMultiply(derivedError,math.column(X,0))));
        let secondThetaRow = math.multiply((1/m),math.sum(math.dotMultiply(derivedError,math.column(X,1))));
        optimizedTheta = math.subtract(optimizedTheta, math.multiply(alpha, math.matrix([[firstThetaRow],[secondThetaRow]])));
        //console.log(`X's first column is ${math.column(X,1)}`)
        //console.log(`first theta is ${firstThetaRow}, second theta is ${secondThetaRow}`)
        //console.log(`${i+1} iteration | cost = ${computeCost(optimizedTheta,X,y)}`);
    }
    return optimizedTheta;
}

// Function that normalizes the data when put through
const normalizeData = X => {
    let mean = math.mean(math.column(X,0));
    let std = math.std(math.column(X,0));
    return math.dotDivide(math.subtract(X,mean),std);
}

const normalEqt = (X,y) => {
    return math.multiply(math.inv(math.multiply(math.transpose(X),X)), math.multiply(math.transpose(X),y));
}