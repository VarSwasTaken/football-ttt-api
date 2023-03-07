import {Request, Response} from 'express';
import db from '../config/database';

const playersCollection = db.collection('players');
const clubsCollection = db.collection('clubs');

export const getPlayerData = async (req: Request, res: Response) => {
    let playerID = parseInt(req.params.playerID);
    if (isNaN(playerID)) {
        return res.status(400).json({success: false, error: `Wrong params provided`});
    }

    let playerData = await playersCollection.findOne({_id: playerID});
    if (playerData == null) return res.status(400).json({success: false, error: `No player found with the ID of: ${playerID}`});
    return res.status(200).json({success: true, data: playerData});
};

export const checkForMatch = async (req: Request, res: Response) => {
    let playerID = parseInt(req.params.playerID);
    if (isNaN(playerID)) {
        return res.status(400).json({success: false, error: `Wrong params provided`});
    }

    let playerData = await playersCollection.findOne({_id: playerID});
    if (playerData == null) return res.status(400).json({success: false, error: `No player found with the ID of: ${playerID}`});

    let club1ID = parseInt(req.query.club1 as string);
    let club2ID = parseInt(req.query.club2 as string);
    if (club1ID == null || club2ID == null || isNaN(club1ID) || isNaN(club2ID)) return res.status(400).json({success: false, error: `Wrong queries provided`});

    let club1data = await clubsCollection.findOne({_id: club1ID});
    let club2data = await clubsCollection.findOne({_id: club2ID});
    if (club1data == null) return res.status(400).json({success: false, error: `No club found with the ID of: ${club1ID}`});
    if (club2data == null) return res.status(400).json({success: false, error: `No club found with the ID of: ${club2ID}`});

    let clubs: number[] = [];
    clubs = playerData['clubs'];
    if (clubs.includes(club1ID) && clubs.includes(club2ID)) return res.status(200).json({success: true, clubs: [club1data.name, club2data.name], match: true});
    return res.status(200).json({success: true, clubs: [club1data.name, club2data.name], match: false});
};

export const searchPlayers = async (req: Request, res: Response) => {
    let playerName = req.params.playerName;
    let result = await playersCollection
        .aggregate([
            {
                $search: {
                    index: 'searchPlayers',
                    text: {
                        query: `\"${playerName}\"`,
                        path: 'name',
                        fuzzy: {
                            maxEdits: 1,
                        },
                    },
                },
            },
        ])
        .toArray();
    return res.status(200).json({success: true, data: result});
};
