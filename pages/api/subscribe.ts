import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient, Db } from 'mongodb';
import url from 'url';


let cachedDb: Db = null;

async function ConnectToDatabase(uri: string) {

    if (cachedDb)
        return cachedDb;

    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const dbName = url.parse(uri).pathname.substr(1);

    cachedDb = client.db(dbName);

    return cachedDb;

}


export default async (request: NowRequest, response: NowResponse) => {
    const { email } = request.body;

    const db = await ConnectToDatabase(process.env.MONGODB_URI);

    const collection = db.collection("emails");

    await collection.insertOne({
        email,
        subcribedAt: new Date()
    });

    return response.status(201).json({ ok: true });
}   