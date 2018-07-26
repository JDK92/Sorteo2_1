var express = require('express'),
    router = express.Router()

var emailUsuario;


var kapi = require('../models/api.js')


router.get('/login', function(req, res) {
    res.render('login', {
        bandera: true
    })
})


router.get('/', function(req, res) {
    res.render('index', {

    })
})
router.get('/register', function(req, res) {
    res.render('register', {

    })
})

router.get('/login', function(req, res) {
    res.render('login', {

    })
})

router.get('/uploadticket', function(req, res) {
    kapi.getData(`http://192.168.34.182:8080/60Aniversario/Tiendas/Catalogo`, function(data) {
        console.log(data);
        if (data.status == 200) {
            res.render('uploadticket', {
                tiendas: data.data
            });
        } else if (data.status == 404) {
            res.redirect('/mytickets');
        }
    })
})


router.post('/validarLogin', function(req, res) {
    kapi.getData(`http://192.168.34.182:8080/60Aniversario/Cliente/LogIn/Email/${req.body.email}/Pass/${req.body.pass}`, function(data) {
        console.log(data)
        if (data.status == 200) {
            emailUsuario = req.body.email;
            res.redirect('/mytickets');
        } else {
            res.render('login', {
                bandera: false
            })
        }
    })
})

router.post('/registrarCliente', function(req, res) {
    var obj = {
        nomCliente: req.body.nomCliente,
        apellidoPaterno: req.body.apellidoPaterno,
        apellidoMaterno: req.body.apellidoMaterno,
        nomCalle: req.body.nomCalle,
        numExterior: req.body.numExterior,
        numInterior: req.body.numInterior,
        nomColonia: req.body.nomColonia,
        codigoPostal: req.body.codigoPostal,
        nomCiudad: req.body.nomCiudad,
        nomEstado: req.body.nomEstado,
        numTelefono: req.body.numTelefono,
        numCelular: req.body.numCelular,
        email: req.body.email,
        password: req.body.password
    }
    console.log(obj);
    kapi.postData(`http://192.168.34.182:8080/60Aniversario/Cliente`, obj, function(data) {
        console.log(data)
        if (data.status == 200) {
            res.redirect('/mytickets');
        } else if (data.status == 400) {
            res.redirect('/register');
        }
    })
})

router.post('/registrarFactura', function(req, res) {
    var obj = {
        email: emailUsuario,
        cliente: req.body.cliente,
        factura: req.body.factura,
        importe: req.body.importe,
        fecha: req.body.fecha,
        idTienda: req.body.tiendaPicked
    }

    kapi.postData(`http://192.168.34.182:8080/60Aniversario/Cliente/Boleto`, obj, function(data) {
        console.log(data)
        if (data.status == 200) {
            console.log('FUE 200');
            res.redirect('/mytickets');
        } else if (data.status == 400) {
            console.log('FUE 400');
            res.render('uploadticket', {
                bandera: false,
                datos: 0,
            })
        } else if (data.status == 404) {
            console.log('FUE 404');
            res.render('uploadticket', {
                bandera: false,
                datos: 0
            })
        } else if (data.status == 500) {
            console.log('FUE 500');
            res.redirect('/mytickets');
        }
    })
})




router.get('/mytickets', function(req, res) {
    kapi.getData(`http://192.168.34.182:8080/60Aniversario/Cliente/Boletos/Email/${emailUsuario}`, function(data) {
        console.log(data);
        if (data.status == 200) {
            res.render('mytickets', {
                nombre: 'Karent ',
                apellido: 'Matus',
                personas: ['Mokay', 'Araoz', 'Sanchez', 'Morales'],
                miColor: 'red',
                miOtroColor: 'miEstiloAzul',
                datos: data.data
            })
        } else {
            res.render('mytickets', {
                nombre: 'Karent ',
                apellido: 'Matus',
                personas: ['Mokay', 'Araoz', 'Sanchez', 'Morales'],
                miColor: 'red',
                miOtroColor: 'miEstiloAzul',
                datos: []
            })
        }
    })
})



module.exports = router