const express = require('express');
const User = require('../UserSchema');
const router = express.Router();

router.get('/all', async (req,res)=>
{
    try{
        const workers = await User.find({role:'worker'}).select('-password');

        res.json(workers);

    }catch(error){

        console.error("Fetch Workers Error:",error.message);
        res.status(500).send("Server Error");

    }
});

module.exports = router;