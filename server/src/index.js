// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------

// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------

// importing our Node modules
import express from "express"; // the framework that lets us build a web server


import pg from "pg" //pg stands for PostgreSQL, for connecting to the database 

import config from "./config.js" //importing our database connection string 

// connect to our PostgreSQL database, or db for short
const db = new pg.Pool({
    connectionString: config.databaseUrl, //ths contains credentials to access the database. keep this private !!!
    ssl: true
  })

const app = express(); // creating an instance of the express module

app.use(express.json()); // This server will receive and respond in JSON format

const port = 3000; // Setting which port to listen to to receive requests

//defining our port, then turning on our server to listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


// ---------------------------------
// Helper Functions
// ---------------------------------

// helper function gets data from database and return ImageTrack, passing it back to the API endpoint to send the response
// we willuse helper functions here to get data from the database.
// 1. getAllAnimals()

 async function getAllAnimals() {
  const result = await db.query("SELECT * FROM animals")
  console.log (result.rows)
  return result.rows 
//   we need to return rows because rows contain all
// of the actual data 
 }

// 2. getOneAnimalByName(name)

async function getOneAnimalByName(name) {
     // db query() takes in two parameters:
    //  takes in two parameters. first is a string that holds sql command, 
    // second is an array that holds the values for the placeholders starting at $1, then $2, etc....
    const result = await db.query("SELECT * FROM animals WHERE name = $1", [name])
   
    console.log (result.rows[0])
    return result.rows[0]
   }

// 3. getOneAnimalById(id)
async function getOneAnimalById(id) {
    // db query() takes in two parameters:
   //  takes in two parameters. first is a string that holds sql command, 
   // second is an array that holds the values for the placeholders starting at $1, then $2, etc....
   const result = await db.query("SELECT * FROM animals WHERE id = $1", [id])
   console.log (result.rows[0])
   return result.rows[0]
  }


// 4. getNewestAnimal()

async function getNewestAnimal() {
    // db query() takes in two parameters:
   //  takes in two parameters. first is a string that holds sql command, 
   // second is an array that holds the values for the placeholders starting at $1, then $2, etc....
   const result = await db.query("SELECT * FROM animals ORDER BY id DESC LIMIT 1 ") ;
   console.log (result.rows[0])
   return result.rows[0]
  }


// 5. 🌟 BONUS CHALLENGE — getAllMammals()

// 6. 🌟 BONUS CHALLENGE — getAnimalsByCategory(category)

// 7. ---> deleteOneAnimal(id)
// Tiger id = 87
async function deleteOneAnimal(id) {
  // db query() takes in two parameters:
 //  takes in two parameters. first is a string that holds sql command, 
 // second is an array that holds the values for the placeholders starting at $1, then $2, etc....
 const result = await db.query("DELETE FROM animals WHERE id = $1",[id]);
 console.log (result.rows[0])
 return result.rows[0]
}

// 8. addOneAnimal(name, category, can_fly, lives_in)
async function addOneAnimal(name, category, can_fly, lives_in) {
  await db.query(
    "INSERT INTO animals (name, category, can_fly, lives_in) VALUES ($1, $2, $3, $4)",
    [name, category, can_fly, lives_in],
  );
}
// 9. updateOneAnimalName(id, newName)
async function updateOneAnimalName(id, newName) {
  await db.query(
    "UPDATE animals SET name = $1 WHERE id = $2", [newName, id]
  )
}

// 10. ---> updateOneAnimalCategory(id, newCategory)
async function updateOneAnimalCategory(id, newCategory) {
  await db.query(
    "UPDATE animals SET category = $1 WHERE id = $2", [newCategory, id]
  )
}

// 11. 🌟 BONUS CHALLENGE — addManyAnimals(animals)


// ---------------------------------
// API Endpoints
// ---------------------------------

// 1. GET /get-all-animals

app.get("/get-all-animals", async (req, res) => {
    const animals = await getAllAnimals();
    // res.send() sends text data
    // res.json() sends JSON data
    res.json(animals);
  });


// 2. GET /get-one-animal-by-name/:name
app.get("/get-one-animal-by-name/:name", async (req, res) => {
    // get the value of the dynamic parameter
    const name = req.params.name;

    // call the helper function
    const animal = await getOneAnimalByName(name);

    // send the animal name as JSON in the response
    res.json(animal);
  });

// 3. GET /get-one-animal-by-id/:id

 app.get("/get-one-animal-by-id/:id", async (req, res) => {
    // get the value of the dynamic parameter
    const id = req.params.id;

    // call the helper function
    const animal = await getOneAnimalById(id);

    // send the animal name as JSON in the response
    res.json(animal);
  });

// 4. GET /get-newest-animal
app.get("/get-newest-animal", async (req, res) => {
    // get the value of the dynamic parameter
    const name = req.params.name;

    // call the helper function
    const animal = await getOneAnimalByName(name);

    // send the animal name as JSON in the response
    res.json(animal);
  });

// 5. 🌟 BONUS CHALLENGE — GET /get-all-mammals

// 6. 🌟 BONUS CHALLENGE — GET /get-animals-by-category/:category

// 7. --> POST /delete-one-animal/:id
app.post("/delete-one-animal/:id", async (req, res)=>{
  const  { name, category, can_fly, lives_in }= req.body
 
 //  it will await until this function has run 
  await  deleteOneAnimal(name, category, can_fly, lives_in);
 
 //  can use a template literal or string in the message below
  res.send(`Success! ${req.body.name} was updated yay!`)
  })


// 8. POST /add-one-animal
 app.post("/add-one-animal", async (req, res)=>{
 const  { name, category, can_fly, lives_in }= req.body

//  it will await until this function has run 
 await  addOneAnimal(name, category, can_fly, lives_in);

//  can use a template literal or string in the message below
 res.send(`Success! ${req.body.name} was added! yay!`)
 })

// 9. POST /update-one-animal-name
app.post("/update-one-animal-name", async (req, res) => {
  const { id, newName } = req.body;
  await updateOneAnimalName(id, newName);
  res.send("Success, the animal's name was changed!");
})
 

// 10. POST /update-one-animal-category
app.post("/update-one-animal-category", async (req, res) => {
  const {id, newCategory } = req.body;
  await updateOneAnimalName(id, newCategory);
  res.send("Success, the animal category was updated!");
})

// 11. 🌟 BONUS CHALLENGE — POST /add-many-animals
