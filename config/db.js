const dotenv = require("dotenv");

const mongoose = require("mongoose");

dotenv.config();

const url = process.env.MONGO_URL;

// async function connectDB() {
//     await mongoose
//         .connect(url, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         })
//         .then(() => {
//             console.log("Connected to the database!");
//         })
//         .catch((err) => {
//             console.log("Cannot connect to the database!", err);
//             process.exit();
//         });
// }


const connectDB = async() => {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`Database Connected  hosted by ${conn.connection.host}`)
}

module.exports = connectDB;