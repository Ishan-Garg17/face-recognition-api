const express = require('express');
const { use } = require('express/lib/application');
const req = require('express/lib/request');
const res = require('express/lib/response');

const app = express();

app.use(express.json()) //Middle Ware for parsing your requests to objects in JSON format, when we are passing the request in JSON 

const database = [
    {
        name: "Ishan",
        email: "ishang17@gmail.com",
        password: "cookies",
        entries: 0
    }, 
    {
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
    res.status(200).json("Success")
    }
    else{
        res.status(400).json("Error Logging in")
    }
})

// :id can be used as url params as after : the name is considered as variable name and we can access it using req.params
app.put('/image:id',(req,res)=>{
    res.send(req.params)
})

app.listen(3000 , ()=>{
    console.log("app is running")
})