/* const {
    crearSolicitudes,
    obtenerSolicitudes,
    modificarSolicitudes,
    eliminarSolicitudes
  } = require('../controllers/solicitudes')
  router.get('/solicitudes', obtenerSolicitudes)
  router.post('/solicitudes', crearSolicitudes)
  router.put('/solicitudes/:id', modificarSolicitudes)
  router.delete('/solicitudes/:id', eliminarSolicitudes)
module.exports = router;
 */
const router = require('express').Router();
const {
  crearSolicitud,
  obtenerSolicitud,
  modificarSolicitud,
  eliminarSolicitud
} = require('../controllers/solicitudes')
var auth = require('./auth');

router.get('/', auth.requerido, obtenerSolicitud)
router.get('/:id', auth.requerido, obtenerSolicitud)
router.post('/', auth.requerido, crearSolicitud)
router.put('/:id', auth.requerido, modificarSolicitud)
router.delete('/:id', auth.requerido, eliminarSolicitud)

module.exports = router;