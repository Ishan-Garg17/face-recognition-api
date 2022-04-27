const express = require('express');
const cors = require('cors')

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


const bcrypt = require('bcrypt');
const { use } = require('bcrypt/promises');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';




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


app.put('/image',(req,res)=>{

    const {id} = req.body

    // in order to increment a column value we can use .increment() function of  knex
    // as with .update() there is a problem that we have to grab entries first from the databse adn then increase it and then update it so therefore we use .increment() function

    db('app_user').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0].entries))





})




// :id can be used as url params as after : the name is considered as variable name and we can access it using req.params
app.get('/profile/:id',(req,res)=>{
    
    const {id} = req.params;
    // Why we need :id along with route? -> because we need to update the entries of that particular user in our data base also we need to fetch that particular user if needed

    db('app_user').where({
        id : id
      }).select('*').then(user => {
          res.json(user)
      })
})





app.listen(3002 , ()=>{
    console.log("app is running")
})