const Proyectos = require("../models/Proyectos");
const Tareas = require('../models/Tareas');

exports.proyectoHome = async (req, res) => {
  const proyectos = await Proyectos.findAll({
    where:{
        usuarioId : res.locals.usuario.id
    }
  });
  res.render("index", {
    nombrePagina: "Proyectos",
    proyectos,
  });
};

exports.formularioProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll({
    where:{
        usuarioId : res.locals.usuario.id
    }
  });
  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
    proyectos,
  });
};

exports.nuevoProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll({
    where:{
        usuarioId : res.locals.usuario.id
    }
  });
  const { nombre } = req.body;
  let errores = [];
  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre al Proyecto" });
  }
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      proyectos,
      errores,
    });
  } else {
    //Si no hay erroes insertar en la BD.
    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({
      nombre,
      usuarioId,
    });
    res.redirect("/");
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const proyectosPromise = Proyectos.findAll({
    where:{
      usuarioId : res.locals.usuario.id
    }
  });
  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId : res.locals.usuario.id
    },
  });
  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);
  //Consultar tareas del proyecto actual
  const tareas = await Tareas.findAll({
    where:{
       proyectoId : proyecto.id
    }
    /*include:[
      {
        model: Proyectos
      }
    ]*/
  });
  
  if (!proyecto) return next();
  res.render("tareas", {
    nombrePagina: "Tareas del Proyecto",
    proyecto,
    proyectos,
    tareas
  });
};

exports.formularioEditar = async (req, res) => {
  const proyectosPromise = Proyectos.findAll({
    where:{
        usuarioId : res.locals.usuario.id
    }
  });
  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId : res.locals.usuario.id
    },
  });
  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  res.render("nuevoProyecto", {
    nombrePagina: "Editar Proyecto",
    proyectos,
    proyecto,
  });
};

exports.actualizarProyecto = async (req, res) => {
  const proyectos = await Proyectos.findAll({
    where:{
        usuarioId : res.locals.usuario.id
    }
  });
  const { nombre } = req.body;
  let errores = [];
  if (!nombre) {
    errores.push({ texto: "Agrega un Nombre al Proyecto" });
  }
  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      proyectos,
      errores,
    });
  } else {
    await Proyectos.update(
      { nombre },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.redirect("/");
  }
};

exports.eliminarProyecto = async (req,res,next) => {
    const {urlProyecto} = req.query;
    console.log(urlProyecto);
    const resultado = await Proyectos.destroy({
      where : {
        url : urlProyecto
      }
    });
    if(!resultado) return next();
    res.status(200).send('Proyecto Eliminado Correctamente');
}
