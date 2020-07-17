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
        gradientDescent(initalValues.theta,initalValues.X,initalValues.y,0.03,1000);
    }
})

// Get Data for designing the X matrix and also output of Y as well
// void function
const InitVariables = data => {
    let features = [];
    let output = [];
    data.forEach(element => {
        features.push([1, parseInt(element.data[19])]); 
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
        console.log(math.dotMultiply(math.subtract(predictions,y),X));
        //optimizedTheta = math.subtract(optimizedTheta, math,multiply(alpha*(1/m), hypoSum));
        console.log(`${i} iteration | cost = ${computeCost(optimizedTheta,X,y)}`);
    }
    return optimizedTheta;
}