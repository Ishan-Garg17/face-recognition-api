const handleSignin = (req,res,bcrypt,db)=>{
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
}

module.exports = {
    handleSignin: handleSignin
};