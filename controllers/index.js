var express = require('express'),
    router = express.Router(),
    request = require('request')

var kapi = require('../models/api.js');
var config = require('../config/config.json');
var urlPath = `http://${config.api.dir.url}:${config.api.dir.port}/${config.api.dir.path}`;
var emailUsuario;
var tiendas;


router.get('/login', function (req, res) {
    res.render('login', {
        bandera: true
    })
})


router.get('/', function (req, res) {
    res.render('index', {
        servicio: true,
        errors: null
    })
})

router.get('/register', function (req, res) {
    res.render('register', {

    })
})

router.get('/validatetickets', function (req, res) {
    if (typeof req.session.userId === "undefined") {
        res.redirect('/.');
    }
    else {
        kapi.getData(`${urlPath}/Cliente/Boleto/Auth`, function (data) {
            if (typeof data === "undefined") {
                res.render('.', {
                    servicio: false
                })
            } else {
                if (data.status == 404) {
                    res.render('validatetickets', {
                        tickets: []
                    })
                } else if (data.status == 200) {
                    res.render('validatetickets', {
                        tickets: data.data
                    })
                } else if (data.status == 500) {
                    res.redirect('/.')
                }
            }
        })
    }
})



router.get('/uploadticket', function (req, res) {
    if (typeof req.session.userId === "undefined") {
        res.redirect('/.');
    } else {
        kapi.getData(`${urlPath}/Tiendas/Catalogo`, function (data) {
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
    }
})

router.post('/validarLogin', function (req, res) {
    req.check('email', 'Es necesario capturar correo').notEmpty();
    req.check('pass', 'Es necesario capturar contraseña').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.render('.', {
            servicio: true,
            errors: errors
        });
    } else {
        var obj = {
            email: req.body.email,
            pass: req.body.pass
        };
        kapi.postData(`${urlPath}/Cliente/LogIn/`, obj, function (data) {
            if (typeof data === "undefined") {
                res.render('.', {
                    servicio: false,
                    errors: null
                })
            } else {
                if (data.status == 200) {
                    req.session.userId = obj.email;
                }
                if (data.status == 200 && data.data == 1) {
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
    }


})

router.post('/registrarCliente', function (req, res) {
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
    kapi.postData(`${urlPath}/Cliente`, obj, function (data) {
        if (typeof data === "undefined") {
            res.render('.', {
                servicio: false
            })
        } else {
            if (data.status == 200) {
                res.redirect('/mytickets');
            } else if (data.status == 400) {
                res.redirect('/register');
            }
        }
    })

})

router.post('/registrarFactura', function (req, res) {
    if (typeof req.session.userId === "undefined") {
        res.redirect('/.');
    } else {
        var captcha = req.body['g-recaptcha-response'];
        if (captcha === undefined ||
            captcha === '' ||
            captcha === null) {
            console.log("SIN PATH W");
        }
        const secretKey = '6LeRx2cUAAAAAGxIqF6lKk6IQMLWAmZcFc4StIXh';
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&
            remoteip=${req.connection.remoteAddress}`;
        request(verifyUrl, (err, response, body) => {
            body = JSON.parse(body);
            if (body.success !== undefined && !body.success) {
                //console.log("TRONO CAPTCHA WWW");
            } else {
                var obj = {
                    email: emailUsuario,
                    cliente: req.body.cliente,
                    factura: req.body.factura,
                    importe: req.body.importe,
                    fecha: req.body.fecha.split('/').reverse().join(''),
                    idTienda: req.body.tiendaPicked,
                }
                kapi.postData(`${urlPath}/Cliente/Boleto`, obj, function (data) {
                    if (typeof data === "undefined") {
                        res.render('.', {
                            servicio: false
                        })
                    } else {
                        if (data.status == 200) {
                            res.redirect('/mytickets');
                        } else if (data.status == 400) {
                            res.render('uploadticket', {
                                error: 400,
                                obj: {},
                                tiendas
                            })
                        } else if (data.status == 404) {
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
    }
})

router.get('/mytickets', function (req, res) {
    if (typeof req.session.userId === "undefined") {
        res.redirect('/.');
    }
    else {
        kapi.getData(`${urlPath}/Cliente/Nombre/${emailUsuario}`, function (nombreUsuario) {
            if (typeof nombreUsuario === "undefined") {
                res.render('.', {
                    servicio: false
                })
            }
            else {
                if (nombreUsuario.status == 200) {
                    kapi.getData(`${urlPath}/Cliente/Boletos/Email/${emailUsuario}`, function (data) {
                        if (typeof data === "undefined") {
                            res.render('.', {
                                servicio: false
                            })
                        }
                        else {
                            if (data.status == 200) {
                                res.render('mytickets', {
                                    datos: data.data,
                                    nombreUsuario: nombreUsuario.data //req.session.nombreCliente
                                })
                            } else {
                                res.render('mytickets', {
                                    datos: [],
                                    nombreUsuario: nombreUsuario.data//req.session.nombreCliente
                                })
                            }
                        }
                    })
                }
            }
        })
    }

})

router.get('/cerrarSesion', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/.');
        }
    });
})

module.exports = router