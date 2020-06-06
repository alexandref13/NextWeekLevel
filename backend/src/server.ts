import express from 'express'
import { resolve } from 'path'
import cors from 'cors'
import { errors } from 'celebrate'

import routes from './routes'

import './database/connection'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')))
app.use('/tmp/uploads', express.static(resolve(__dirname, '..','tmp', 'uploads')))
app.use(errors())

app.listen(3333)