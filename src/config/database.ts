import dotenv from 'dotenv';
dotenv.config();

import mongoDB from 'mongodb';

const url = process.env.DB_URL || '';
const client = new mongoDB.MongoClient(url);

const connect = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('footballttt');
        return db;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default await connect();
