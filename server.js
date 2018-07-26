var express = require('express'),
    app = express(),
    controllers = require('./controllers')

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var helmet = require('helmet')
app.use(helmet()) //Seguridad del HTTP

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('title', 'Sorteo Kuroda');

app.set('port', process.env.PORT || 3001)
app.set('node_env', process.env.NODE_ENV || 'development')
app.disable('x-powered-by')

app.use(controllers)

app.listen( app.get('port'), function() {
	console.log('Aplicacion '+ app.get('title') + ' escuchando en el Puerto: ' + app.get('port') + ' En Modo ' + app.get('node_env')  )
})