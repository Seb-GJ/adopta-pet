
var router = require('express').Router();

router.get('/', (req, res)=>{
  res.send('welcome to adoptapet api');
});

router.use ('/usuarios',require('./usuarios.js'));
router.use ('/mascotas', require('./mascotas.js'));
router.use('/solicitudes', require('./solicitudes.js'));

 module.exports = router;
