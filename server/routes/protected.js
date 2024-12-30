const express=require('express')
const router=express.Router();
router.use(express.json());
const db=require('../config/db');
const verifyToken=require('../services/jwtService');
const verify=(req,res,next)=>{
    try{
        const response = verifyToken.verifyToken(req.headers.authorization.split(' ')[1])
        req.user=response
        next()
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'Server error',error})
    }
}
router.get('/',verify,(req,res)=>{
    console.log("hello")
    db.all(`SELECT * FROM vehicles WHERE user = ?`, [req.user.name], (err, vehicles) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err });
        } else {
            res.json({ success: true, users: req.user, vehicles: vehicles });
        }
    });
    
})
router.get('/data',(req,res)=>{
    db.all(`SELECT data FROM mqtt_data WHERE topic='Pleasure/ADC'`,(err,data)=>{
        if(err){
            console.log(err)
            res.status(500).json({message:'Server error',error:err})
        }
        else{
            res.json({success:true,data})
        }
    })

})

router.post('/add-vehicle',verify,(req,res)=>{
    const {name,type,model}=req.body;
    console.log(req.body)
    db.sql`
    USE DATABASE vehicle-tracking-analytics;
    INSERT INTO vehicles (user,name,type,model) VALUES (${req.user.name},${name},${type},${model});
    `
    .then(()=>{
        console.log('Vehicle added successfully')
        res.json({success:true,message:'Vehicle added successfully'})
    })
    .catch((error)=>{
        console.log(error)
        res.status(500).json({message:'Server error',error})
    })

})

module.exports=router;