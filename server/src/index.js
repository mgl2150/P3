require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const nocache = require('nocache')
const mongoose = require('mongoose')

// Import routes
// const userRoutes = require('./routes/user.js')
// const authRoutes = require('./routes/auth.js')
const customerRoutes = require('./routes/customer.js')
const bikeRoutes = require('./routes/bike.js')
const orderRoutes = require('./routes/order.js')
const serviceRoutes = require('./routes/service.js')
const scheduleRoutes = require('./routes/schedule.js')

const app = express()

// Middleware
app.use(express.json())
app.set('json spaces', 2)

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ["'none'"],
        'frame-ancestors': ["'none'"],
      },
    },
    frameguard: {
      action: 'deny',
    },
  })
)

app.use((req, res, next) => {
  res.contentType('application/json; charset=utf-8')
  next()
})
app.use(nocache())

app.use(
  cors({
    // origin: CLIENT_ORIGIN_URL,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400,
  })
)

// Routes
// app.use('/api/users', userRoutes)
// app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/bikes', bikeRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/schedule', scheduleRoutes)

// Start the server
const port = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((err) => console.error(err))
