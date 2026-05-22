require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

const routes = require('./routes')

app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.get('/', (req, res) => res.json({ ok: true, msg: 'Daycare API running' }))

app.listen(port, () => console.log(`Server listening on ${port}`))
