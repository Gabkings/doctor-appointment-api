const express = require('express')
require('dotenv').config()
const app = express()

const db = require('./config/db')
db()
const userRoutes = require('./route/Userroutes')
const adminRoute = require('./route/Adminroutes')
const doctorRoute = require('./route/Doctorsroutes')
const { swaggerUi, swaggerSpec } = require('./swagger')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoute)
app.use('/api/doctor', doctorRoute)

const PORT = process.env.PORT || 5000

if (require.main === module) {
  app.listen(PORT, () => console.log('Server running at port ' + PORT))
}

module.exports = app