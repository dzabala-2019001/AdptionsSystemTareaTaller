import express from 'express'
import { obtenerA, deleteA, registerA, testA } from './animal.controller.js';

const api = express.Router();

api.get('/testA', testA)
api.post('/registerA', registerA)
api.get('/obtenerA', obtenerA)
api.delete('/deleteA/:id', deleteA)

export default api