require('dotenv').config({ path: require('path').join(__dirname, '.env'), override: true })
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5001

const routes = require('./routes')

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

const path = require('path')

app.use('/api', routes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => res.json({ ok: true, msg: 'Daycare API running' }))

app.listen(port, () => console.log(`Server listening on ${port}`))

module.exports = app;
 
