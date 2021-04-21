const express = require('express');
const fs = require('fs');
const path = require('path');

const {animals} = require('./data/animals');
const PORT = process.env.PORT || 3001;

//instantiate the server 
const app = express();

//parse incoming string or array data 
app.use(express.urlencoded({eextended: true}));
//parse incoming JSON data
app.use(express.json());

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

//function that accepts POST route's request body 
function createNewAnimal(body, animalsArray) {
    const animal = body;
    //push new animals to array
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        //null means we don't edit exisiting data, 2 means create whitespace between values for readbalilty
        JSON.stringify({animals: animalsArray}, null, 2)
    );

    //return finished code to post route for repsonse
    return body;
}

//validate data before writing to json 
function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string'){
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string') {
        return false ;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true; 
}

//GET requests
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

//POST Requests 
app.post('/api/animals', (req, res) => {
    //set id based on what the next index of the array will be 
    req.body.id = animals.length.toString();

    //if any data in req.body isincorrect send 400 error back 
    if(!validateAnimal(req.body)) {
        res.status(404).send('The animal is not properly formated.');
    } else {
        //add animals to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }

 
});

//listen for requests 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});