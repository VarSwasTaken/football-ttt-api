import {Request, Response} from 'express';
import db from '../config/database';
import {ObjectId} from 'mongodb';
import {BadRequestError} from '../middleware/errors';

const playersCollection = db.collection('players');
const clubsCollection = db.collection('clubs');

export const getPlayerData = async (req: Request, res: Response) => {
    let playerID = parseInt(req.params.playerID);
    if (isNaN(playerID)) throw new BadRequestError("Wrong parameters provided. 'playerID' parameter must be of type number");

    let playerData = await playersCollection.findOne({_id: playerID as unknown as ObjectId});
    if (!playerData) throw new BadRequestError(`No player found with the ID of: ${playerID}`);
    return res.status(200).json({success: true, data: playerData});
};

export const checkForMatch = async (req: Request, res: Response) => {
    let playerID = parseInt(req.params.playerID);
    if (isNaN(playerID)) throw new BadRequestError("Wrong parameters provided. 'clubID' parameter must be of type number");

    let playerData = await playersCollection.findOne({_id: playerID as unknown as ObjectId});
    if (!playerData) throw new BadRequestError(`No player found with the ID of: ${playerID}`);

    let club1ID = parseInt(req.query.club1 as string);
    let club2ID = parseInt(req.query.club2 as string);
    if (!club1ID || !club2ID) throw new BadRequestError('Too short query given. Exactly 2 clubIDs should be provided as parameters.');
    if (isNaN(club1ID) || isNaN(club2ID)) throw new BadRequestError("Wrong query given. All 'club' query parameters must be of type number");

    let club1data = await clubsCollection.findOne({_id: club1ID as unknown as ObjectId});
    let club2data = await clubsCollection.findOne({_id: club2ID as unknown as ObjectId});
    if (!club1data) throw new BadRequestError(`No club found with the ID of: ${club1ID}`);
    if (!club2data) throw new BadRequestError(`No club found with the ID of: ${club2ID}`);

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
                    wildcard: {
                        query: `*${playerName}*`,
                        path: 'name',
                        allowAnalyzedField: true,
                    },
                },
            },
        ])
        .toArray();
    return res.status(200).json({success: true, data: result});
};
