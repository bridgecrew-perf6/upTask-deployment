const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Referencia al modelo a autenticar
const Usuarios = require('../models/Usuarios');

// Login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        //Por default passport espera un usuario y un password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email,password,done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where:{
                        email,
                        activo : 1
                    }
                });
                // El usuario existe,password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message: 'El Password es Incorrecto'
                    });
                }
                // El E-mail existe y el password Correcto
                return done(null,usuario);

            } catch (error) {
                // Usuario no existe
                return done(null,false,{
                    message: 'Error esa cuenta no existe'
                });
            }
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario,callback)=>{
    callback(null,usuario);
})


// Desearializar el usuario
passport.deserializeUser((usuario,callback)=>{
    callback(null,usuario);
});

module.exports = passport;