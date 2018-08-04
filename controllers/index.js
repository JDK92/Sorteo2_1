var express = require('express'),
    router = express.Router(),
    request = require('request')

var kapi = require('../models/api.js')
var emailUsuario;
var tiendas;


router.get('/login', function(req, res) {
    res.render('login', {
        bandera: true
    })
})


router.get('/', function(req, res) {
    res.render('index', {
        servicio: true
    })
})

router.get('/register', function(req, res) {
    res.render('register', {

    })
})

router.get('/validatetickets', function(req, res) {
    kapi.getData(`http://192.168.13.103:8080/60Aniversario/Cliente/Boleto/Auth`, function(data) {
        if (typeof data === "undefined") {
            console.log("EL SERVICIO SE CHURIÓ");
            res.render('.', {
                servicio: false
            })
        } else {
            console.log(data);
            if (data.status == 404) {
                res.render('validatetickets', {
                    tickets: []
                })
            } else if (data.status == 200) {
                res.render('validatetickets', {
                    tickets: data.data
                        // tickets: []
                })
            } else if (data.status == 500) {
                res.redirect('/.')
            }
        }
    })
})



router.get('/uploadticket', function(req, res) {
    kapi.getData(`http://192.168.13.103:8080/60Aniversario/Tiendas/Catalogo`, function(data) {
        if (typeof data === "undefined") {
            console.log("EL SERVICIO SE CHURIÓ");
            res.render('.', {
                servicio: false
            })
        } else {
            if (data.status == 200) {
                tiendas = data.data;
                res.render('uploadticket', {
                    error: 0,
                    tiendas,
                    factura: '',
                    cliente: '',
                    fecha: '',
                    importe: '',
                    nombreTienda: ''
                });
            } else if (data.status == 404) {
                res.redirect('/mytickets');
            }
        }
    })
})


// router.post('/validarLogin', function(req, res) {
//     kapi.postData(`http://192.168.13.103:8080/60Aniversario/Cliente/LogIn/Email/${req.body.email}/Pass/${req.body.pass}`, function(data) {
//         console.log(data)
//         if (data.status == 200) {
//             emailUsuario = req.body.email;
//             res.redirect('/mytickets');
//         } else {
//             res.render('login', {
//                 bandera: false
//             })
//         }
//     })
// })

router.post('/validarLogin', function(req, res) {
    var obj = {
        email: req.body.email,
        pass: req.body.pass
    };
    kapi.postData(`http://192.168.13.103:8080/60Aniversario/Cliente/LogIn/`, obj, function(data) {
        if (typeof data === "undefined") {
            console.log("EL SERVICIO SE CHURIÓ");
            res.render('.', {
                servicio: false
            })
        } else {
            console.log(data);
            if (data.status == 200 && data.data == 1) {
                emailUsuario = req.body.email;
                res.redirect('/mytickets');
            } else if (data.status == 200 && data.data == 0) {
                res.redirect('/validatetickets')
            } else {
                res.render('login', {
                    bandera: false
                })
            }
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
    kapi.postData(`http://192.168.13.103:8080/60Aniversario/Cliente`, obj, function(data) {
        if (typeof data === "undefined") {
            console.log("EL SERVICIO SE CHURIÓ");
            res.render('.', {
                servicio: false
            })
        } else {
            console.log(data)
            if (data.status == 200) {
                res.redirect('/mytickets');
            } else if (data.status == 400) {
                res.redirect('/register');
            }
        }
    })
})

router.post('/registrarFactura', function(req, res) {
    var captcha = req.body['g-recaptcha-response'];
    console.log(captcha);
    if (captcha === undefined ||
        captcha === '' ||
        captcha === null) {
        console.log("SIN PATH W");
    }
    const secretKey = '6LeRx2cUAAAAAGxIqF6lKk6IQMLWAmZcFc4StIXh';
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
    console.log(verifyUrl);
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            console.log("TRONO CAPTCHA WWW");
        } else {
            var obj = {
                email: emailUsuario,
                cliente: req.body.cliente,
                factura: req.body.factura,
                importe: req.body.importe,
                fecha: req.body.fecha.split('/').reverse().join(''),
                idTienda: req.body.tiendaPicked,
            }
            kapi.postData(`http://192.168.13.103:8080/60Aniversario/Cliente/Boleto`, obj, function(data) {
                if (typeof data === "undefined") {
                    console.log("EL SERVICIO SE CHURIÓ");
                    res.render('.', {
                        servicio: false
                    })
                } else {
                    if (data.status == 200) {
                        console.log('FUE 200');
                        res.redirect('/mytickets');
                    } else if (data.status == 400) {
                        console.log('Factura ya registrada');
                        res.render('uploadticket', {
                            error: 400,
                            obj: {},
                            tiendas
                        })
                    } else if (data.status == 404) {
                        console.log('No encontró factura');
                        res.render('uploadticket', {
                            error: 404,
                            factura: obj.factura,
                            cliente: obj.cliente,
                            importe: obj.importe,
                            fecha: obj.fecha,
                            nombreTienda: obj.idTienda,
                            tiendas
                        });
                    } else if (data.status == 500) {
                        console.log('Error interno del servidor');
                        res.redirect('/uploadticket', {
                            error: 500,
                            factura: obj.factura,
                            cliente: obj.cliente,
                            importe: obj.importe,
                            fecha: obj.fecha,
                            nombreTienda: obj.idTienda,
                            tiendas
                        });
                    }
                }
            })
        }
    })
})



router.get('/mytickets', function(req, res) {
    kapi.getData(`http://192.168.13.103:8080/60Aniversario/Cliente/Nombre/${emailUsuario}`, function(nombreUsuario) {

        if (typeof nombreUsuario === "undefined") {
            console.log("EL SERVICIO SE CHURIÓ");
            res.render('.', {
                servicio: false
            })
        } else {
            if (nombreUsuario.status == 200) {
                kapi.getData(`http://192.168.13.103:8080/60Aniversario/Cliente/Boletos/Email/${emailUsuario}`, function(data) {
                    if (data.status == 200) {
                        res.render('mytickets', {
                            datos: data.data,
                            nombreUsuario: nombreUsuario.data
                        })
                    } else {
                        res.render('mytickets', {
                            datos: [],
                            nombreUsuario: nombreUsuario.data
                        })
                    }
                })
            }
        }
    })


})

router.get('/mytickets', function(req, res) {
    var objValidator = true
    if (objValidator) {
        console.log("VERDADERO");
        res.render('mytickets', {
            objValidator: true
        });
    } else if (objValidator == false) {
        console.log("FALSO");
    }
})


module.exports = router