const express = require('express');

const {animals} = require('./data/animals');

//instantiate the server 
const app = express();











function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    //save animal array as filteresd results 
    let filteredResults = animalsArray;

    if (query.personalityTraitsArray) {
        //save personailtytrais as a dedeicated array 
        //if personality traits is a string, place it ino a new array and save
        if (typeof query.personalityTraitsArray === 'string'){
            personalityTraitsArray = [query.personalityTraitsArray];
        } else {
            personalityTraitsArray = query.personalityTraitsArray;
        }
        
        //Loop through each traing in the personailtyTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

app.get('/api/animals' , (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//listen for requests 
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
});