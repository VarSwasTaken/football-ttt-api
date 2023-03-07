import express from 'express';
import {getPlayerData, checkForMatch, searchPlayers} from '../controllers/playersController';

const router = express.Router();

router.get('/data/:playerID', getPlayerData);
router.get('/match/:playerID', checkForMatch);
router.get('/search/:playerName', searchPlayers);

export default router;
