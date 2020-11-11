/*  Archivo controllers/Solicitud.js
 *  Simulando la respuesta de objetos Solicitud
 *  en un futuro aquí se utilizarán los modelos
 */

/* const Solicitudes = require('../models/Solicitud') */

const mongoose = require("mongoose");
const Usuario = mongoose.model('Usuario')
const Solicitud = mongoose.model('Solicitud')
const Mascota = mongoose.model('Mascota')
mongoose.set('useFindAndModify', false);

function crearSolicitud(req, res, next) { // POST v1/solicitudes?mascota_id=021abo59c96b90a02344...
  // Buscamos la mascota a solicitar
  console.log("Mascota a buscar " + req.query.mascota_id);
  Mascota.findById(req.query.mascota_id, async (err, mascota) => {
    if (!mascota || err) {
      return res.sendStatus(404)
    }
    if (mascota.estado==='adoptado') {
      return res.sendStatus('La mascota ya ha sido adoptada')
    }
    // si está dispobible o pendiente podemos crear la solicitud
    const solicitud = new Solicitud()
    solicitud.mascota = req.query.mascota_id
    solicitud.anunciante = mascota.anunciante
    solicitud.solicitante = req.usuario.id
    solicitud.estado = 'pendiente'
    solicitud.save().then(async s => {
      // antes de devolver respuesta actualizamos el tipo de usuario a anunciante
      await Usuario.findOneAndUpdate({_id: req.usuario.id}, {tipo: 'anunciante'})
      res.status(201).send(s)
    }).catch(next)
  }).catch(next)
}

/* function obtenerSolicitudes(req, res) {
  // Simulando dos Solicitudes y respondiendolos
  var Solicitude1 = new Solicitudes(1, 'Juan', 'Vega', 'juan@vega.com')
  var Solicitude2 = new Solicitudes(2, 'Monserrat', 'Vega', 'mon@vega.com')
  res.send([Solicitude1, Solicitude2])
} */
function obtenerSolicitud(req, res, next) {
  if (!req.params.id) {
    // sin :id, solo enlistaremos las solicitudes dónde el usuario es anunciante o solicitante
    Solicitud.find({ $or: [{ solicitante: req.usuario.id }, { anunciante: req.usuario.id }] }).then(solicitudes => {
      res.send(solicitudes)
    }).catch(next)
  } else {
    // Al obtener una solicitud individual con el :id poblaremos los campos necesarios
    Solicitud.findOne({ _id: req.params.id, $or: [{ solicitante: req.usuario.id }, { anunciante: req.usuario.id }] })
      .then(async (solicitud) => {
        // añadimos información sobre la mascota
        await solicitud.populate('mascota').execPopulate()
        if (solicitud.estado === 'aceptada') {
          // Si la solicitud ha sido aceptada, se mostrará la información de contacto
          await solicitud.populate('anunciante', 'username nombre apellido bio foto telefono email').execPopulate()
          await solicitud.populate('solicitante', 'username nombre apellido bio foto telefono email').execPopulate()
          res.send(solicitud)
        } else {
          res.send(solicitud)
        }
      }).catch(next)
  }
}

/* function modificarSolicitud(req, res) {
  // simulando un Solicitude previamente existente que el Solicitude utili
  var Solicitude1 = new Solicitudes(req.params.id, 'Juan', 'Vega', 'juan@vega.com')
  var modificaciones = req.body
  Solicitude1 = { ...Solicitude1, ...modificaciones }
  res.send(Solicitude1)
} */
function modificarSolicitud(req, res, next) {
  console.log("Solicitud a solicitar: " + req.params.id )
  Solicitud.findById(req.params.id).then(solicitud => {
    if (!solicitud) { return res.sendStatus(401); }
    console.log("Usuario solicita cambio solicitud: " + req.usuario.id);
    console.log("Usuario anunciante mascota: " + solicitud.anunciante);
    if( req.usuario.id == solicitud.anunciante ){
      let nuevaInfo = req.body
      if (typeof nuevaInfo.idMascota !== 'undefined')
        solicitud.idMascota = nuevaInfo.idMascota
      if (typeof nuevaInfo.fechaDeCreacion !== 'undefined')
        solicitud.fechaDeCreacion = nuevaInfo.fechaDeCreacion
      if (typeof nuevaInfo.idUsuarioAnunciante !== 'undefined')
        solicitud.idUsuarioAnunciante = nuevaInfo.idUsuarioAnunciante
      if (typeof nuevaInfo.idUsuarioSolicitante !== 'undefined')
        solicitud.idUsuarioSolicitante = nuevaInfo.idUsuarioSolicitante
      if (typeof nuevaInfo.estado !== 'undefined')
        solicitud.estado = nuevaInfo.estado
      solicitud.save().then(updateSolicitud => {
        res.status(201).json(updateSolicitud.publicData())
      }).catch(next)
    }else{
      return res.sendStatus(401);
    }
  }).catch(next)
}
function eliminarSolicitud(req, res) {
  res.status(200).send(`Solicitude ${req.params.id} eliminado`);
}

module.exports = {
  crearSolicitud,
  obtenerSolicitud,
  modificarSolicitud,
  eliminarSolicitud
}
