import dotenv from 'dotenv';
dotenv.config();

import mongoDB from 'mongodb';

const url = process.env.DB_URL || '';
const client = new mongoDB.MongoClient(url);

const connect = async () => {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('footballttt');
    return db;
};

export default await connect();
