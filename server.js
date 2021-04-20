const express = require('express');

const {animals} = require('./data/animals');
const PORT = process.env.PORT || 3001;

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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;

}

//routes 
app.get('/api/animals' , (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//listen for requests 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});