import express from 'express';
import {getClubData, drawClubs} from '../controllers/clubsController';

const router = express.Router();

router.get('/data/:clubID', getClubData);
router.get('/draw', drawClubs);

export default router;
