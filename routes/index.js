const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const { body } = require('express-validator');

module.exports = function(){
    //Rutas Proyecto
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectoHome
    );

    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );

    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );
    
    //TAREAS    
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );
    router.patch('/tareas/:id', //La direfencie entre update y patch es que patch solo cambia una porcion del registro
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    ); 
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    //NUEVA CUENTA
    router.get('/crear-cuenta',
        usuariosController.formCrearCuenta
    );
    router.post('/crear-cuenta',
        usuariosController.crearCuenta
    );

    //INICIAR SESION
    router.get('/iniciar-sesion',
        usuariosController.formIniciarSesion
    );
    router.post('/iniciar-sesion',
        authController.autenticarUsuario
    );

    //CERRAR SESION
    router.get('/cerrar-sesion',
        authController.cerrarSesion
    );

    //RESTABLECER
    router.get('/reestablecer',
        usuariosController.formRestablecerPassword
    );
    router.post('/reestablecer',
        authController.enviarToken
    );
    router.get('/reestablecer/:token',
        authController.validarToken
    );
    router.post('/reestablecer/:token',
        authController.actualizarPassword
    );
    router.get('/confirmar/:correo',
        usuariosController.confirmarCuenta
    );

    return router;
}


