import express from 'express';
import {getClubData, drawCustom, drawTopFive, drawDefault} from '../controllers/clubsController';

const router = express.Router();

router.get('/data/:clubID', getClubData);
router.get('/draw/custom', drawCustom);
router.get('/draw/topfive', drawTopFive);
router.get('/draw/default', drawDefault);

export default router;
