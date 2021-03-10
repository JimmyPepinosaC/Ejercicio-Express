const express = require('express');
const router = express.Router();
const joi = require('joi');
const fs = require('fs');
const Joi = require('joi');

const mensajes = [
    {
    "message": "Hola",
    "author": "JP",
    "ts": "1"
    },
    {
        "message": "Hola, como estas?",
        "author": "DP",
        "ts": "2"
    },
];

const leerJson = (callback) =>{
    fs.readFile('./persistencia/mensajes.json', (err, data)=>
    {
        if (err) throw err;
        callback(JSON.parse(data));
    });
    
}

/* GET */
router.get('/', function(req, res, next) {
//   leerJson((data)=>{
//     res.send(data);
//   });
    res.send(mensajes);
  
});

/* GET ts */
router.get('/:ts', function(req, res, next) {
    
    // leerJson((data)=> {
    //     let ts = req.params.ts;
    //     let mensajeTs = json.find((mensaje) => mensaje.ts == ts);
    //     if(!mensajeTs){
    //     return res.status(404).send("The message with the given ts was not found.")
    //     }
    //     res.send(mensajeTs);
    // });
    let ts = req.params.ts;
    let mensajeTs = mensajes.find((mensaje) => mensaje.ts == ts);
    if(!mensajeTs){
    return res.status(404).send("The message with the given ts was not found.")
    }
    res.send(mensajeTs);
  });

  router.post('/', function(req, res, next) {
    //   leerJson((data)=>{
    //     res.send(data);
    //   });
    const {error} = validar(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    res.send(req.body);
    mensajes.push(req.body);
    next();
  });

  router.put('/:ts', function(req, res, next) {
    const {error} = validar(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let ts = req.params.ts;
    let mensajeTs = mensajes.find((mensaje) => mensaje.ts == ts);
    if(!mensajeTs){
    return res.status(404).send("The message with the given ts was not found.")
    }

    mensajeTs.message = req.body.message;
    mensajeTs.author = req.body.author;

    res.status(200).send("The message with the given ts was updated.");
    
      
  })

  router.delete('/:ts', function(req, res, next) {
    //   leerJson((data)=>{
    //     res.send(data);
    //   });
    let ts = req.params.ts;
    let mensajeTs = mensajes.find((mensaje) => mensaje.ts == ts);
    if(!mensajeTs){
    return res.status(404).send("The message with the given ts was not found.")
    }

    const index = mensajes.indexOf(mensajeTs);
    mensajes.splice(index, 1);

    res.send("The message with the given ts was deleted.")
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