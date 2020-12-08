const passport = require('passport');
const Usuario = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');
const Op = Sequelize.Op;

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage: 'Ambos Campos son obligatorios'
});

// Funcion para revisar si el usuario esta loggeado
exports.usuarioAutenticado = (req,res,next) =>{
    //Si esta autenticado
    if(req.isAuthenticated()){
        return next();
    }
    // Si no
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req,res) =>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    })
}

//Genera un token si el usuario es válido
exports.enviarToken = async (req,res,next) =>{
    const usuario = await Usuario.findOne({
        where:{
            email : req.body.email
        }
    })
    if(!usuario){
        req.flash('error','No existe esa cuenta');
        res.redirect('/reestablecer');
    }
    //si el usuario existe brindar un Token!
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    await usuario.save();
    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    // Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo : 'reestablecer-password'
    });
    req.flash('correcto','Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async(req,res) =>{
    const usuario = await Usuario.findOne({
        where:{
            token: req.params.token
        }
    });
    //Si no encuenta el usuario
    if(!usuario){
        req.flash('error','No Válido');
        res.redirect('/reestablecer');

    }
    //Formulario
    res.render('resetPassword',{
        nombrePagina : 'Reestablecer Contraseña'
    });
}

exports.actualizarPassword = async (req,res) =>{
    const usuario = await Usuario.findOne({
        where:{
            token : req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    if(!usuario){
        req.flash('error','No válido');
        res.redirect('/reestablecer');
    }
    //Fecha de expiración valida y correo, nuevo password
    usuario.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    //eliminar token y fecha de expiracion
    usuario.token = null;
    usuario.expiracion = null;
    await usuario.save();
    req.flash('correcto','Tu password se ha modificado Correctamente');
    res.redirect('/iniciar-sesion');
}