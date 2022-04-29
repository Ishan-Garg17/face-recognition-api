const handleRegister = (req,res,db,bcrypt,saltRounds)=>{
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
}

module.exports = {
    handleRegister: handleRegister
};