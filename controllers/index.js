var express = require('express'),
    router = express.Router(),
    request = require('request')

var kapi = require('../models/api.js');
var config = require('../config/config.json');
var urlPath = `http://${config.api.dir.url}:${config.api.dir.port}/${config.api.dir.path}`;
var emailUsuario;
var tiendas;


/* ERROR 500 */
router.get('/500', function (req, res) {
    res.render('500', {

    })
})

/* SOPORTE AL CLIENTE */
router.get('/soporte', function (req, res) {
    if (typeof req.session.userId === "undefined") {
        res.redirect('/.');
    } else {
        if (req.session.permiso == 2) {
            kapi.getData(`${urlPath}/Cliente/Nombre/${req.session.userId}`, function (nombreUsuario) {
                if (typeof nombreUsuario === "undefined") {
                    req.session.destroy();
                    res.render('/500');
                } else {
                    if (nombreUsuario.status == 200) {
                        req.session.nombreUsuario = nombreUsuario.data;
                        res.render('soporte', {
                            servicio: true,
                            nombreUsuario: req.session.nombreUsuario,
                            cliente: '',
                            error: '',
                            success: ''
                        })
                    }
                }
            })
        } else {
            res.redirect("/cerrarSesion");
        }
    }
})

router.post('/encontrarCliente', function (req, res) {
    if (typeof req.session.userId === "undefined") {
        res.redirect('/.');
    } else {
        kapi.getData(`${urlPath}/Cliente/Email/${req.body.mail}`, function (data) {
            if (typeof data === "undefined") {
                req.session.destroy();
                res.redirect('/500')
            } else if (data.status == 200) {
                res.render('soporte', {
                    error: '',
                    success: true,
                    cliente: data.data,
                    nombreUsuario: req.session.nombreUsuario
                })
            } else if (data.status == 404) {
                res.render('soporte', {
                    error: 404,
                    success: '',
                    nombreUsuario: req.session.nombreUsuario

                })
            } else if (data.status = 500) {
                res.redirect("/.");
            }
        })
    }
})



/* INICIO DE SESIÓN DEL CLIENTE Y CERRAR SESIÓN */

router.get('/', function (req, res) {
    res.render('index', {
        servicio: true,
        errors: null
    })
})

router.get('/login', function (req, res) {
    res.render('login', {
        sLogin: '',
        nuevoUsuario: ''
    })
})

router.post('/validarLogin', function (req, res) {
    var obj = {
        email: req.body.email,
        pass: req.body.pass
    };
    var sLogin;
    kapi.postData(`${urlPath}/Cliente/LogIn/`, obj, function (data) {
        if (typeof data === "undefined") {
            req.session.destroy();
            res.redirect('/500')
        } else {
            if (data.status == 200) {
                req.session.userId = obj.email;
                req.session.permiso = data.data;
            }
            if (data.status == 200 && data.data == 1) {
                res.redirect('/mytickets');
            } else if (data.status == 200 && data.data == 0) {
                res.redirect('/validatetickets')
            } else if (data.status == 200 && data.data == 2) {
                res.redirect('/soporte');
            } else {
                res.render('login', {
                    sLogin: data.status,
                    nuevoUsuario: ''
                })
            }
        }
    })
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

/* ADMIN PARA VALIDAR FACTURAS FUERAS DE SAP */
router.get('/validatetickets', function (req, res) {
    if (typeof req.session.userId === "undefined") {
        res.redirect('/.');
    } else {
        if (req.session.permiso == 0) {
            kapi.getData(`${urlPath}/Cliente/Boleto/Auth`, function (data) {
                if (typeof data === "undefined") {
                    req.session.destroy();
                    res.render('/500')
                } else {
                    if (data.status == 404) {
                        res.render('validatetickets', {
                            tickets: [],
                            nombreUsuario: req.session.nombreUsuario
                        })
                    } else if (data.status == 200) {
                        res.render('validatetickets', {
                            tickets: data.data,
                            nombreUsuario: req.session.nombreUsuario
                        })
                    } else if (data.status == 500) {
                        res.redirect('/.')
                    }
                }
            })
        } else {
            res.redirect("/cerrarSesion");
        }

    }
})

router.post('/validarFactura', function (req, res) {
    var obj;
    if (req.session.userId === "undefined") {
        res.redirect('/.');
    }
    else {
        if (req.body.accion === undefined) {
            res.redirect('/validatetickets');
        }
        else {
            obj = {
                email: req.body.email,
                factura: req.body.factura,
                idTienda: req.body.sucursal.substring(0, 4),
                boletosAutorizados: 0,
                importeAutorizado: 0,
                usuarioAutorizo: req.session.userId,
                opcion: Number(req.body.accion)
            };
            kapi.putData(`${urlPath}/Cliente/Boleto/Auth`, obj, function (data) {
                if (typeof data === "undefined") {
                    req.session.destroy();
                    res.render('.', {
                        servicio: false
                    })
                }
                else {
                    if (data.status == 200) {
                        res.redirect('/validatetickets');
                    }
                    else if (data.status == 500) {

                    }
                }
            });
        }
    }
});


/* REGISTRO DE NUEVOS USUARIOS*/
router.get('/register', function (req, res) {
    res.render('register', {
        servicio: true,
        errors: null,
        usuarioRegistrado: ''
    })
})

router.post('/registrarCliente', function (req, res) {
    req.check('nombre', 'El nombre debe de incluir sólo texto').matches(/^([^0-9]*)$/);

    req.check('apellidoPaterno', 'El apellido paterno debe de incluir sólo texto').matches(/^([^0-9]*)$/);

    req.check('apellidoMaterno', 'El apellido materno debe de incluir sólo texto').matches(/^([^0-9]*)$/);

    req.check('nomCiudad', 'La ciudad debe de incluir sólo texto').matches(/^([^0-9]*)$/);

    req.check('nomEstado', 'El estado debe de incluir sólo texto').matches(/^([^0-9]*)$/);

    req.check('codigoPostal', 'El código postal debe incluir sólo números').matches(/^\d{1,6}$/);

    req.check('numTelefono', 'El teléfono debe incluir sólo números').matches(/^\d{1,10}$/);

    req.check('numCelular', 'El celular debe incluir sólo números').matches(/^\d{1,10}$/);


    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            servicio: true,
            errors: errors,
            usuarioRegistrado: ''
        });
    } else {
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
                req.session.destroy();
                res.render('/500')
            } else {
                if (data.status == 200) {
                    res.render('login', {
                        sLogin: '',
                        nuevoUsuario: true
                    });
                } else if (data.status == 400) {
                    res.render('register', {
                        usuarioRegistrado: true,
                        servicio: true,
                        errors: ''
                    });
                }
            }
        })
    }
})

/* FACTURA Y REGISTRO DE FACTURAS DEL CLIENTE */

router.get('/mytickets', function (req, res) {
    if (typeof req.session.userId === "undefined") {
        res.redirect('/.');
    } else {
        if (req.session.permiso == 1) {
            kapi.getData(`${urlPath}/Cliente/Nombre/${req.session.userId}`, function (nombreUsuario) {
                if (typeof nombreUsuario === "undefined") {
                    req.session.destroy();
                    res.render('/500');
                } else {

                    kapi.getData(`${urlPath}/Boleto/Cancelados/${req.session.userId}`, function (boletosCancelados) {
                        if (typeof boletosCancelados === "undefined") {
                            req.session.destroy();
                            res.render('/500');
                        } else {
                            if (boletosCancelados.status === 500) {
                                req.session.destroy();
                                res.render('/500');
                            }
                            else {
                                req.session.objBoletosCancelados = boletosCancelados.data;
                            }
                        }
                        if (nombreUsuario.status == 200) {
                            req.session.nombreUsuario = nombreUsuario.data;
                            kapi.getData(`${urlPath}/Cliente/Boletos/Email/${req.session.userId}`, function (data) {
                                if (typeof data === "undefined") {
                                    req.session.destroy();
                                    res.redirect('/500');
                                } else {
                                    if (data.status == 200) {
                                        res.render('mytickets', {
                                            success: '',
                                            datos: data.data,
                                            nombreUsuario: req.session.nombreUsuario,
                                            cancelados: req.session.objBoletosCancelados
                                        })
                                    } else {
                                        res.render('mytickets', {
                                            success: '',
                                            datos: [],
                                            nombreUsuario: req.session.nombreUsuario,
                                            cancelados: req.session.objBoletosCancelados
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            })
        } else {
            res.redirect("/cerrarSesion");
        }
    }
})

router.get('/uploadticket', function (req, res) {
    if (typeof req.session.userId === "undefined") {
        res.redirect('/.');
    } else {
        kapi.getData(`${urlPath}/Tiendas/Catalogo`, function (data) {
            if (typeof data === "undefined") {
                req.session.destroy();
                res.render('/500');
            } else {
                if (data.status == 200) {
                    tiendas = data.data;
                    res.render('uploadticket', {
                        error: 0,
                        errors: '',
                        tiendas: tiendas,
                        factura: '',
                        cliente: '',
                        fecha: '',
                        importe: '',
                        nombreTienda: '',
                        servicio: true,
                        nombreUsuario: req.session.nombreUsuario
                    });
                } else if (data.status == 404) {
                    res.redirect('/mytickets');
                }
            }
        })
    }
})

router.post('/registrarFactura', function (req, res) {
    var metodo;
    var obj;
    req.check('factura', 'Debes ingresar sólo números en factura').matches(/^\d{1,45}$/);
    req.check('cliente', 'Debes ingresar sólo números # de cliente').matches(/^\d{1,45}$/);
    req.check('importe', 'Debes ingresar sólo números en importe').matches(/^[0-9]+(\.[0-9]{1,2})?$/);

    var errors = req.validationErrors();
    if (errors) {
        res.render('uploadticket', {
            error: 0,
            errors: errors,
            tiendas: tiendas,
            factura: '',
            cliente: '',
            fecha: '',
            importe: '',
            nombreTienda: '',
            servicio: true,
            nombreUsuario: req.session.nombreUsuario
        });
    } else {
        if (typeof req.session.userId === "undefined") {
            res.redirect('/.');
        } else {
            var captcha = req.body['g-recaptcha-response'];
            if (captcha === undefined ||
                captcha === '' ||
                captcha === null) {

            }
            const secretKey = '6LeRx2cUAAAAAGxIqF6lKk6IQMLWAmZcFc4StIXh';
            const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&
            remoteip=${req.connection.remoteAddress}`;
            request(verifyUrl, (err, response, body) => {
                body = JSON.parse(body);
                if (body.success !== undefined && !body.success) {

                } else {
                    if (req.body.tiendaPicked.includes("MZ")) {
                        obj = {
                            email: req.session.userId,
                            factura: req.body.factura,
                            fechaFactura: req.body.fecha.split('/').reverse().join(''),
                            importe: req.body.importe,
                            cantBoletos: 0,
                            idTienda: req.body.tiendaPicked,
                        };
                        metodo = "Cliente/Boleto/Auth";
                    } else {
                        var obj = {
                            email: emailUsuario,
                            cliente: req.body.cliente,
                            factura: req.body.factura,
                            importe: req.body.importe,
                            fecha: req.body.fecha.split('/').reverse().join(''),
                            idTienda: req.body.tiendaPicked,
                        };
                        metodo = "Cliente/Boleto";
                    }


                    kapi.postData(`${urlPath}/${metodo}`, obj, function (data) {
                        if (typeof data === "undefined") {
                            req.session.destroy();
                            res.render('.', {
                                servicio: false
                            })
                        } else {
                            if (data.status == 200) {
                                res.redirect('/mytickets');

                            } else if (data.status == 400) {
                                console.log("Error 400");
                                res.render('uploadticket', {
                                    error: 400,
                                    obj: {},
                                    servicio: true,
                                    errors: '',
                                    nombreUsuario: req.session.nombreUsuario,
                                    tiendas: tiendas
                                })
                            } else if (data.status == 404) {
                                console.log("Error 404");
                                res.render('uploadticket', {
                                    error: 404,
                                    factura: obj.factura,
                                    cliente: obj.cliente,
                                    importe: obj.importe,
                                    fecha: obj.fecha,
                                    nombreTienda: obj.idTienda,
                                    servicio: true,
                                    errors: '',
                                    nombreUsuario: req.session.nombreUsuario,
                                    tiendas: tiendas
                                });
                            } else if (data.status == 500) {
                                console.log("Error 500");
                                res.redirect('/uploadticket', {
                                    error: 500,
                                    factura: obj.factura,
                                    cliente: obj.cliente,
                                    importe: obj.importe,
                                    fecha: obj.fecha,
                                    nombreTienda: obj.idTienda,
                                    servicio: true,
                                    errors: '',
                                    nombreUsuario: req.session.nombreUsuario,
                                    tiendas: tiendas
                                });
                            }
                        }
                    })
                }
            })
        }
    }
})


module.exports = router