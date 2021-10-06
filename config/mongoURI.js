const dotenv = require("dotenv");

dotenv.config();
module.exports = `mongodb+srv://admin:${process.env.MONGOPASSWORD}@classroom-corner.pup7i.mongodb.net/Koderz-CC?retryWrites=true&w=majority`;