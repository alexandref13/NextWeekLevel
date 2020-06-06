import express from 'express'
import multer from 'multer'
import { celebrate, Joi } from 'celebrate';

import multerConfig from './config/multer'

import ItensController from './controller/ItensController'
import PointsController from './controller/PointsController'

const routes = express.Router()
const upload = multer(multerConfig)

routes.get('/itens', ItensController.index)

routes.post('/points', 
    upload.single('image'), 
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().max(2).required(),
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false,
    }),
    PointsController.store)
routes.get('/points/:id', PointsController.show)
routes.get('/points', PointsController.index)

export default routes