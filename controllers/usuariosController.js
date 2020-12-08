const Usuarios = require("../models/Usuarios");
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear Cuenta en UpTask",
  });
};
exports.crearCuenta = async (req, res) => {
  const { email, password } = req.body;
  try {
    await Usuarios.create({
      email,
      password,
    });

    //Crear una Url de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
    //Crear objeto de usuario
    const usuario = {
      email
    }
    //Enviar email
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirma tu cuenta UpTask',
      confirmarUrl,
      archivo : 'confirmar-cuenta'
  });
    //Redirigir al usuario
    req.flash('correcto','Enviamos un Correo Confirma tu cuenta')
    res.redirect("/iniciar-sesion");

  } catch (error) {
    req.flash('error',error.errors.map(error => error.message))
    res.render("crearCuenta", {
        nombrePagina: "Crear Cuenta en UpTask",
        mensajes : req.flash(),
        email,
        password
      });
  }
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes
  res.render("iniciarSesion", {
    nombrePagina: "Inicia Sesión en UpTask",
    error
  });
};

exports.formRestablecerPassword = (req,res) =>{
  res.render('reestablecer',{
    nombrePagina: 'Restablece tu Contraseña'
  })
}

exports.confirmarCuenta = async(req,res) =>{
    const usuario = await Usuarios.findOne({
      where:{
        email : req.params.correo
      }
    });
    if(!usuario){
      req.flash('error','No válido')
      res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto','Cuenta activada Correctamente');
    res.redirect('/iniciar-sesion');
}

