const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

const knex = require('knex')


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'ishan',
      database : 'postgres'
    }
});



const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const res = require('express/lib/response');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 034b49fff994465a944aa126a4c9ed21");








app.use(express.json()) //Middle Ware for parsing your requests to objects in JSON format, when we are passing the request in JSON 

app.use(cors()) //Used so that no other or third party application can connect to our server


app.get('/',(req,res)=>{
})


app.post('/register',(req,res)=>{
    const {name,email,password} = req.body;
    const hash = bcrypt.hashSync(password,saltRounds); //using bcrypt for converting plain text password to hashed code and this we have used synchronous
    
    db.transaction((trx)=>{
        db.insert({
            hash: hash,
            email: email
        })
        .returning('email')  //we add this returning when we want to return the entry that is being inserted into the database
        .into('login')
        .transacting(trx)
        .then(loginEmail =>{
           return db('app_user').returning('*')
            .insert({
                email: loginEmail[0].email,  //because loginEmail will be passed as array of object object so we have to write [0].email
                name: name,
                joined: new Date()
            }) 
            .then(user=>res.json(user[0]))   //Now this will return the response in json format with our user object, we have used user[0] because user will be returned as an array of object and we will have our user object at 0th position of that array

            //Agar insert operation jo hai hamara vo success hojayega tabhi .then mein jayega varna error mein to jata nhi hai so .then mein ham aage conditions laga sakte hain
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
})

       

app.post('/signin',(req,res)=>{
    const {email,password} =  req.body
    db('login').where('email','=',email).select('hash')
    .then(data=>{ //now this data will come as an array of object
        // console.log(data)
      const isvalid =  bcrypt.compareSync(password, data[0].hash);
      if(isvalid){
         return db('app_user').where('email','=',email).select('*')
        .then(user => res.json(user[0]))
      }
      else{
          throw Error()
      }
    })
    .catch(err => res.status(404).json(err))
})




//IMAGE ROUTE


const handleApiCall  = (req,res)=>{
    console.log(req.body.imageURL)
stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "a403429f2ddf4b49b307e318f00e528b",
        inputs: [{data: {image: {url: `${req.body.imageURL}`}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }
        // .outputs[0].data.regions[0].region_info.bounding_box 
        res.json(response.outputs[0].data.regions[0].region_info.bounding_box);
    }
);
}



app.put('/image',(req,res)=>{

  handleApiCall(req,res);
   
})

app.put('/rank',(req,res)=>{

    const {id} = req.body
    console.log(id)
    db('app_user').where('id', '=', id)
    .increment('entries', 1)
    .then(entries=>{
        res.json(entries)
    })  //must write .then() statement in db commands as it will return a promis and without .then the promise will not get fulfilled

    // in order to increment a column value we can use .increment() function of  knex

    // as with .update() there is a problem that we have to grab entries first from the databse adn then increase it and then update it so therefore we use .increment() function

   
})












// :id can be used as url params as after : the name is considered as variable name and we can access it using req.params
app.get('/profile/:id',(req,res)=>{
    
    const {id} = req.params;
    // Why we need :id along with route? -> because we need to update the entries of that particular user in our data base also we need to fetch that particular user if needed
    console.log(id)
   
})





app.listen(3002 , ()=>{
    console.log("app is running")
})