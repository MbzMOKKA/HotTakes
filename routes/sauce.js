//Imports
const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce');
const middlewareAuth = require('../middlewares/auth');
const middlewareMulter = require('../middlewares/multer-config');


//Routes
router.get('/', sauceController.getAllSauces);
router.get('/:id', sauceController.getOneSauce);

router.post('/', middlewareAuth, middlewareMulter, sauceController.uploadSauce);
router.put('/:id', middlewareAuth, middlewareMulter, sauceController.modifySauce);
router.delete('/:id', middlewareAuth, sauceController.deleteSauce);

router.post('/:id/like', middlewareAuth, sauceController.likeSauce);

//Exports
module.exports = router;