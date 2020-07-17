const fs = require('fs');
const math = require('mathjs');
const Papa = require('papaparse');

console.log('Sanity Check');

// Setting up the variables about to be used
const file= fs.createReadStream('housing.csv');

var setup = {
    theta: 'something',
    X: 'something',
    y: 'something',
}

// Setup theta that reads size of y and returns a # of zeros for theta
// might need a json for this
// some func
Papa.parse(file, {
    worker: true,
    step: result => {

    },
    complete: (result, file) => {
        console.log('ey, this does something!');
        //setup.X = designMatrix(result.data);
        console.log(result);
    }
})

// Get Data for designing the X matrix
// void function
const designMatrix = data => {
    let features = [];
    for(houses in data) {
        features.push([1, parseInt(data["data"][19]), 
                        parseInt(data["data"][data["data"].length-1])
                      ]);
    }
    return features;
}

// Get data for designing the Y matrix
// void function

// Compute cost on how bad the error was
// float function

// Gradient descent that changes theta