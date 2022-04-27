const express = require('express');
const cors = require('cors')

const app = express();

const knex = require('knex')


const postgress = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'ishan',
      database : 'postgres'
    }
});


console.log(postgress.select('*').from('app_user'))








app.use(express.json()) //Middle Ware for parsing your requests to objects in JSON format, when we are passing the request in JSON 

app.use(cors()) //Used so that no other or third party application can connect to our server

const database = [
    {
        id: 1,
        name: "Ishan",
        email: "i",
        password: "c",
        entries: 0
    }, 
    {
        id: 2,
        name: "Rahul",
        email: "rahul17@gmail.com",
        password: "donkies",
        entries: 0
    }
]

app.get('/',(req,res)=>{
    res.json(database)
})


app.post('/register',(req,res)=>{
    const {name,email,password} = req.body;
    user = {
            id: database.length+1,
            name: name,
            email: email,
            password: password,
            entries: 0
    }
    database.push(user);
    res.json(database[database.length-1])
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

// :id can be used as url params as after : the name is considered as variable name and we can access it using req.params
app.put('/image:id',(req,res)=>{

    // Why we need :id along with route? -> because we need to update the entries of that particular user in our data base also

    res.send(req.params)
})

app.listen(3002 , ()=>{
    console.log("app is running")
})