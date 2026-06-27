const express = require('express');
const router = express.Router();
const Request = require('../RequestSchema');
const User = require('../UserSchema');
const checkauth = require('../middleware/checkauth');

router.post('/book',checkauth,async (req,res)=>
{
    try{
        const{workerId, serviceNeeded, address, date}=req.body;

        const newRequest = new Request({
            client:req.user.id,
            worker:workerId,
            serviceNeeded,
            address,
            date
        });

        await newRequest.save();
        res.status(201).json({message:"Booking Request sent successfully"});
    }catch(error){
        console.error("Booking Error:",error.message);
        res.status(500).send("Server Error");
    }
});

router.get('/myrequest', checkauth, async(req,res)=>{

    try{
        const requests=await Request.find({worker:req.user.id})
        .populate('client','name phone email');

        res.json(requests);

    }catch(error){
        console.error("Fetch Requests Error:",error.message);
        res.status(500).send("Server Error");

    }
});

router.put('/updatestatus/:id',checkauth, async(req,res)=>
{
    try{
        const{status} = req.body;

        let request = await Request.findById(req.params.id);
        if(!request){
            return res.status(404).send("Request not found");
        }
        if(request.worker.toString()!== req.user.id){
            return res.status(404).send("Not allowed to update");
        }

        request = await Request.findByIdAndUpdate(
            req.params.id,
            {$set:{status:status}},
            {new:true},
            { returnDocument: 'after' }
        );

        res.json({message:"Request status update",request});


    }catch(error){
        console.error("Update Status Error:",error.message);
        res.status(500).send("Server Error");


    }
});

router.get('/mybookings',checkauth,async (req,res)=>
{
    try{
        const booking = await Request.find({client:req.user.id})
        .populate('worker','name phone email');

        res.json(booking);

    }catch(error){
        console.error("Fetch Booking Error:",error.message);
        res.status(500).send("Server Error");


    }
});

module.exports=router;