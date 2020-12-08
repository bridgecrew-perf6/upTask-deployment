const express = require('express');
const routes = require('./routes');
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
const db = require('./config/db') //Crear Conexion a BD
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

require('dotenv').config({path:'variables.env'});
//Modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');


//  INICIAR CONEXION
db.sync().then(()=>console.log('Conectado')).catch(error => console.log(error));
//  Crear una aplicación de Express
const app = express();
//  Donde cargar los archivos estáticos
app.use(express.static('public'));
//  Habilitar PUG
app.set('view engine','pug');
//  Habilitar bodyparser para leer datos del formulario
app.use(bodyParser.urlencoded({extended:true}))
//  Agregar vistas
app.set('views',path.join(__dirname,'./views'));
// Agregar flash messages
app.use(flash());
app.use(cookieParser());
// Permitira la redirección entre diferentes páginas sin volver a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// Pasar vardump a la aplicación
app.use((req,res,next)=>{
    const fecha = new Date();
    res.locals.usuario = {...req.user} || null;
    res.locals.year = fecha.getFullYear();
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    next();
});


const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

//Importar Rutas
app.use('/',routes());
app.listen(port, host, () =>{
    console.log('El Servidor esta funcionando')
})

/* 
app.listen(3000);*/