import {Request, Response} from 'express';
import db from '../config/database';
import {ObjectId} from 'mongodb';
import {BadRequestError} from '../middleware/errors';

const clubsCollection = db.collection('clubs');

export const getClubData = async (req: Request, res: Response) => {
    let clubID = parseInt(req.params.clubID);
    if (isNaN(clubID)) throw new BadRequestError("Wrong parameters provided. 'clubID' parameter must be of type number");

    let clubData = await clubsCollection.findOne({_id: clubID as unknown as ObjectId});
    if (!clubData) throw new BadRequestError(`No club found with the ID of: ${clubID}`);
    return res.status(200).json({success: true, data: clubData});
};

const compareClubs = async (team1_ID: number, team2_ID: number) => {
    let firstTeamData = await clubsCollection.findOne({_id: team1_ID as unknown as ObjectId});
    let secondTeamData = await clubsCollection.findOne({_id: team2_ID as unknown as ObjectId});

    let firstTeamPlayers: number[] = [];
    let secondTeamPlayers: number[] = [];

    if (firstTeamData) firstTeamPlayers = firstTeamData['players'];
    if (secondTeamData) secondTeamPlayers = secondTeamData['players'];

    let mutualPlayers = firstTeamPlayers.filter((element) => secondTeamPlayers.includes(element)).length;
    if (mutualPlayers < 2) return false;
    return true;
};

export const drawCustom = async (req: Request, res: Response) => {
    let query = req.query.clubs as string[];
    if (!query) throw new BadRequestError('No query given. Provide query with atleast 6 clubIDs as parameters');
    if (query.length < 6) throw new BadRequestError('Too short query given. Atleast 6 clubIDs should be provided as parameters.');

    let clubs = query.map(Number);
    for (let i = 0; i < clubs.length; i++) {
        if (isNaN(clubs[i])) throw new BadRequestError("Wrong query given. All 'clubs' query parameters must be of type number");

        let clubData = await clubsCollection.findOne({_id: clubs[i] as unknown as ObjectId});
        if (!clubData) throw new BadRequestError(`No club found with the ID of: ${clubs[i]}`);
    }

    let drawnClubs: number[] = [];
    while (drawnClubs.length < 6) {
        let num = Math.floor(Math.random() * (clubs.length - 1));
        if (drawnClubs.indexOf(clubs[num]) === -1) {
            drawnClubs.push(clubs[num]);
            clubs.splice(num, 1);
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 3; j <= 5; j++) {
            let correct = await compareClubs(drawnClubs[i], drawnClubs[j]);
            if (!correct) {
                if (clubs.length == 0) return res.status(200).json({success: false, clubs: null});
                while (true) {
                    let num = Math.floor(Math.random() * (clubs.length - 1));
                    if (drawnClubs.indexOf(clubs[num]) === -1) {
                        drawnClubs[i] = clubs[num];
                        clubs.splice(num, 1);
                        break;
                    }
                }
                i--;
                break;
            }
        }
    }

    return res.status(200).json({success: true, clubs: drawnClubs});
};

const drawSet = async (clubs: number[]) => {
    let drawnClubs: number[] = [];
    while (drawnClubs.length < 6) {
        let num = Math.floor(Math.random() * (clubs.length - 1));
        if (drawnClubs.indexOf(clubs[num]) === -1) {
            drawnClubs.push(clubs[num]);
            clubs.splice(num, 1);
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 3; j <= 5; j++) {
            let correct = await compareClubs(drawnClubs[i], drawnClubs[j]);
            if (!correct) {
                while (true) {
                    let num = Math.floor(Math.random() * (clubs.length - 1));
                    if (drawnClubs.indexOf(clubs[num]) === -1) {
                        drawnClubs[i] = clubs[num];
                        clubs.splice(num, 1);
                        break;
                    }
                }
                i--;
                break;
            }
        }
    }

    return drawnClubs;
};

export const drawTopFive = async (req: Request, res: Response) => {
    let queryClubs = await clubsCollection.find({league: {$in: ['Premier League', 'LaLiga', 'Bundesliga', 'Serie A', 'Ligue 1']}}).toArray();
    let clubs: number[] = [];
    for (let i = 0; i < queryClubs.length; i++) {
        clubs[i] = parseInt(queryClubs[i]._id.toString());
    }

    let drawnClubs = await drawSet(clubs);

    return res.status(200).json({success: true, clubs: drawnClubs});
};

export const drawDefault = async (req: Request, res: Response) => {
    let clubs: number[] = [610, 2282, 26, 720, 234, 383, 294, 336, 281, 631, 31, 11, 985, 148, 762, 379, 1003, 418, 131, 13, 681, 1050, 150, 1049, 368, 621, 27, 16, 23826, 15, 24, 18, 82, 5, 46, 6195, 506, 12, 800, 398, 430, 583, 273, 162, 244, 1041, 1082];

    let drawnClubs = await drawSet(clubs);

    return res.status(200).json({success: true, clubs: drawnClubs});
};
