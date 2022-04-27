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


// console.log(db.select('*').from('app_user'))








app.use(express.json()) //Middle Ware for parsing your requests to objects in JSON format, when we are passing the request in JSON 

app.use(cors()) //Used so that no other or third party application can connect to our server


app.get('/',(req,res)=>{
})


app.post('/register',(req,res)=>{
    const {name,email} = req.body;
    db('app_user')
    .returning('*') //now we add this returning when we want to return the entry that is being inserted into the database  
    .insert({
        email: email,
        name: name,
        joined: new Date()
    }) //Agar insert operation jo hai hamara vo success hojayega tabhi .then mein jayega varna error mein to jata nhi hai so .then mein ham aage conditions laga sakte hain
        .then(user => {
                res.send(user[0]) //Now this will return the response in json format with our user object
            })
    .catch(err=>{
        res.status(400).json(err)
    })
})


app.post('/signin',(req,res)=>{
    const {email,password} =  req.body
    if(email === database[0].email && password === database[0].password){
    res.status(200).json(database[0])
    }
    else{
        res.status(400).json('Error Logging In')
    }
})


app.put('/image',(req,res)=>{

    

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