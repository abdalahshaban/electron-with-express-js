const getAddress = require('./token.getAddress');
// const openSession = require("./test")
const openSession = require("./token.openSession")
const checkIfTokenInserted = require("./token.checkIfTokenInserted")
const VerifyRND = require("./token.verifyRND")



module.exports = {
    getAddress,
    openSession,
    checkIfTokenInserted,
    VerifyRND
};