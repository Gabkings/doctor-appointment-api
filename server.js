const express = require('express')
const { default: connectDB } = require('./config/db')
require('dotenv').config()
const app = express()

const db = require('./config/db')
db()
const userRoutes = require('./route/Userroutes')
const adminRoute = require('./route/Adminroutes')
const doctorRoute = require('./route/Doctorsroutes')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRoutes)
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);

const port = process.env.PORT || 5000

app.listen(port, () => console.log('Server running at port ' + port))

module.exports = app