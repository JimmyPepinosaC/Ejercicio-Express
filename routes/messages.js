const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Message = require('../models/message');


/* GET */
router.get('/', function(req, res, next) {
    Message.findAll().then((result) => {
        res.status(200).send(result);
    }); 
});

/* GET ts */
router.get('/:ts', function(req, res, next) {
    
    let ts = req.params.ts;
    Message.findAll({
        where:{
            ts: ts
    }}).then((result)=>{
        if(result.length === 0){
            return res.status(404).send("The message with the given ts was not found.");
        }
        res.status(200).send(result);
    });
    
  });

  router.post('/', function(req, res, next) {
    const {error} = validar(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const {message, author, ts} = req.body;
    Message.create({
        message: message,
        author: author,
        ts: ts
    }).then((result)=> {
        res.status(200).send(result);
        next();
    });
    
  });

  router.put('/:ts', function(req, res, next) {
    const {error} = validar(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let ts = req.params.ts;
    Message.update(req.body, {
        where:{
            ts: ts
    }
    }).then((result) => {
        if(result[0] === 0){
            return res.status(404).send("The message with the given ts was not found.");
        }
        res.status(200).send("The message with the given ts was updated.");
    });
  });

  router.delete('/:ts', function(req, res, next) {
    let ts = req.params.ts;
    Message.destroy( {
        where:{
            ts: ts
    }
    }).then((result) =>{
        if(result === 0){
            return res.status(404).send("The message with the given ts was not found.");
        }
        res.status(200).send(result + " messages with the given ts were deleted.")
    });
    
  });

const validar = (mensaje) => {
    const schema = Joi.object({
        message: Joi.string().required().min(5),
        author: Joi.string().required().pattern(new RegExp("[a-zA-Z] [a-zA-Z]")),
        ts: Joi.string().required(),
    });
    return schema.validate(mensaje);
};



module.exports = router;