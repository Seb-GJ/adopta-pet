/* class Solicitud {
    constructor(id, idMascota, fechaDeCreacion, idMascotaAnunciante, idMascotaSolicitante, estado) {
      this.id = id;
      this.idMascota = idMascota;
      this.fechaDeCreacion = fechaDeCreacion;
      this.idMascotaAnunciante = idMascotaAnunciante;
      this.idMascotaSolicitante = idMascotaSolicitante;
      this.estado = estado;
    }
  
  }
  
  module.exports = Solicitud;
   */

   const mongoose = require("mongoose");

var SolicitudSchema = new mongoose.Schema(
  {
    mascota: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Mascota",
    },
    anunciante: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Usuario",
    },
    solicitante: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Usuario",
    },
    estado: { type: String, enum: ["aceptada", "cancelada", "pendiente"] },
  },
  { collection: "solicitudes", timestamps: true }
);

SolicitudSchema.methods.publicData = function(){
  return {
    id: this.id,
    idMascota: this.idMascota,
    fechaCreacion: this.fechaCreacion,
    idAnunciante: this.idAnunciante,
    idSolicitante: this.idSolicitante,
    estado: this.estado
  };
};

mongoose.model('Solicitud', SolicitudSchema)