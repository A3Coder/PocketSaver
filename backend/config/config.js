const env = require("dotenv")
env.config()

const sessionSecret = process.env.SESSIONSECRET;

const emailUser = process.env.EMAILUSER;
const emailPassword = process.env.EMAILPASSWORD;

module.exports = {
    sessionSecret,
    emailUser,
    emailPassword
}