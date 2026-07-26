const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()

const db = require('./config/db')
db()
const userRoutes = require('./route/Userroutes')
const adminRoute = require('./route/Adminroutes')
const doctorRoute = require('./route/Doctorsroutes')
const { swaggerUi, swaggerSpec } = require('./swagger')
const swaggerUiDistPath = require('swagger-ui-dist').getAbsoluteFSPath()

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4200',
  'https://doctor-appointment-pwmwpp4ys-gabkings-projects.vercel.app',
  'https://doctor-appointment-4gn6p30cg-gabkings-projects.vercel.app',
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/i.test(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/swagger-ui-dist', express.static(swaggerUiDistPath))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: '/swagger-ui-dist/swagger-ui.css',
  customJs: [
    '/swagger-ui-dist/swagger-ui-bundle.js',
    '/swagger-ui-dist/swagger-ui-standalone-preset.js',
  ],
  customSiteTitle: 'Doctor Appointment API Docs',
}))
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