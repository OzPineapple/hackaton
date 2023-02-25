const path = require ('path');
const Usuario = require ('../Modelos/Usuario');

exports.create = function (req, res){
    var newUsuario = new Usuario(req.body);
    //Validacion de los datos recibidos en consola
    newUsuario.save(function(err){
        if (err){
            res.status(400).send('Hemos en el guardado de los datos');
        }else{
            console.log('Hemos logrado guardar los datos');
        }

    });
}
