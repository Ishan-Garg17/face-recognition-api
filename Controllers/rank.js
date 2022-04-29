const handleRank = (req,res,db)=>{
    const {id} = req.body
    db('app_user').where('id', '=', id)
    .increment('entries', 1)
    .then(entries=>{
        res.json(entries)
    })
}

// NOTES
//must write .then() statement in db commands as it will return a promis and without .then the promise will not get fulfilled

// in order to increment a column value we can use .increment() function of  knex

// as with .update() there is a problem that we have to grab entries first from the databse adn then increase it and then update it so therefore we use .increment() function




module.exports = {
    handleRank: handleRank
};