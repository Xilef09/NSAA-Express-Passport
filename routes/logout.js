const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    req.logout();
    res.clearCookie('auth');
    res.redirect('login');
});

module.exports = router;