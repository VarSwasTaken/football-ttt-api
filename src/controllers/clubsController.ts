import {Request, Response} from 'express';
import db from '../config/database';

const clubsCollection = db.collection('clubs');

export const getClubData = async (req: Request, res: Response) => {
    let clubID = parseInt(req.params.clubID);
    if (isNaN(clubID)) return res.status(400).json({success: false, error: `Wrong params provided`});

    let clubData = await clubsCollection.findOne({_id: clubID});
    if (clubData == null) return res.status(400).json({success: false, error: `No club found with the ID of: ${clubID}`});
    return res.status(200).json({success: true, data: clubData});
};

const compareClubs = async (team1_ID: number, team2_ID: number) => {
    let firstTeamData = await clubsCollection.findOne({_id: team1_ID});
    let secondTeamData = await clubsCollection.findOne({_id: team2_ID});

    let firstTeamPlayers: number[] = [];
    let secondTeamPlayers: number[] = [];

    if (firstTeamData != null) firstTeamPlayers = firstTeamData['players'];
    if (secondTeamData != null) secondTeamPlayers = secondTeamData['players'];

    let mutualPlayers = firstTeamPlayers.filter((element) => secondTeamPlayers.includes(element)).length;
    if (mutualPlayers < 3) return false;
    return true;
};

export const drawClubs = async (req: Request, res: Response) => {
    let query = req.query.clubs as string[];
    if (query.length < 6) return res.status(400).json({success: false, error: `Too small amount of clubs given`});

    let clubs = query.map(Number);
    for (let i = 0; i < clubs.length; i++) {
        if (isNaN(clubs[i])) return res.status(400).json({success: false, error: `Wrong queries provided`});

        let clubData = await clubsCollection.findOne({_id: clubs[i]});
        if (clubData == null) return res.status(400).json({success: false, error: `No club found with the ID of: ${clubs[i]}`});
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
                if (clubs.length == 0) return res.status(400).json({success: false, error: `Could not draw 6 matching clubs using current filter`});
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
