const express = require("express");
const { getAddress, openSession, checkIfTokenInserted, VerifyRND } = require('./controllers');

const router = express.Router();


router.get("/token/check-token", checkIfTokenInserted);
router.get("/token/get-address", getAddress);
router.post("/token/open-session", openSession);
router.get("/token/verify", VerifyRND);


module.exports = router;





