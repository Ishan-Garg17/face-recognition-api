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
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 034b49fff994465a944aa126a4c9ed21");


app.use(express.json()) //Middle Ware for parsing your requests to objects in JSON format, when we are passing the request in JSON 
app.use(cors()) //Used so that no other or third party application can connect to our server


const register = require('./Controllers/register')
const signin = require('./Controllers/signin')
const image = require('./Controllers/image');
const rank = require('./Controllers/rank');

app.post('/register', (req,res)=>{register.handleRegister(req,res,db,bcrypt,saltRounds)});    

app.post('/signin',(req,res)=>{signin.handleSignin(req,res,bcrypt,db)})

app.post('/image',(req,res)=>{image.handleImage(req,res,stub,metadata)})

app.put('/rank',(req,res)=>{rank.handleRank(req,res,db)})  



app.listen(3002 , ()=>{
    console.log("app is running")
})