const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const path = require('path');

router.post('/', userController.register);

router.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,"register.html"));
});

module.exports = router;