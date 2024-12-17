const dotenv = require('dotenv');

dotenv.config();
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbID = process.env.DB_ID;


module.exports = {
    cloud: {
        database: `mongodb+srv://${dbUser}:${dbPass}@${dbID}/cloud?retryWrites=true&w=majority`
    }
}