import express from 'express';
import handler from './handler';

export default express.Router()
    .get('/', handler.root)