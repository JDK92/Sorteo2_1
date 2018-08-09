var express = require('express'),
    app = express(),
    controllers = require('./controllers'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    //redis = require("redis"),
    //client  = redis.createClient(),
    expressValidator = require('express-validator');


var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var helmet = require('helmet')
app.use(helmet()) //Seguridad del HTTP

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var sessionRedis = session({
    store: new RedisStore({
        host: '192.168.13.209',
        port: 6379,
        pass: 'S0l0Kur0d4#',
        //client: client,
        ttl: 60 * 15
    }),
    name: "Redis",
    secret: "pruebaRedis",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        domain: "localhost"
    }
});
app.use(sessionRedis);

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('title', 'Sorteo Kuroda');

app.set('port', process.env.PORT || 3001)
app.set('node_env', process.env.NODE_ENV || 'development')
app.disable('x-powered-by')

app.use(controllers)

app.listen(app.get('port'), function() {
    console.log('Aplicacion ' + app.get('title') + ' escuchando en el Puerto: ' + app.get('port') + ' En Modo ' + app.get('node_env'))
})