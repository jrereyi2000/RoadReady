import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient, ObjectId } from 'mongodb';

import 'dotenv/config'

const api = express.Router();

let conn = null;
let db = null;
let Users = null;
let Logs = null;
let Companies = null;

api.use(bodyParser.json());
api.use(cors());

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.DB_NAME;

// check the MongoDB URI
if (!MONGODB_URI) {
    throw new Error('Define the MONGODB_URI environmental variable');
}

// check the MongoDB DB
if (!MONGODB_DB) {
    throw new Error('Define the MONGODB_DB environmental variable');
}

const isLoggedIn = (request) => {
    return request.session?.user !== undefined;
}

const initApi = async app => {
    app.set("json spaces", 2);
    app.use("/api", api);
    
    conn = await MongoClient.connect(MONGODB_URI);
    db = conn.db(MONGODB_DB);
    Users = db.collection('Users');
    Logs = db.collection('Logs');
    Companies = db.collection('Companies');
};

api.get("/", async (req, res) => {
    res.json({success: true});
});

//Working in Server
api.post('/log', async (req, res) => {
    if (!isLoggedIn(req)) return res.status(401).send("Error. No User Logged In");

    const { engine_pic, dolly_pic, tractor_pic } = req.body;
    if (!engine_pic) return res.status(400).json({error: 'Invalid request. engine_pic is a required property'});
    if (!dolly_pic) return res.status(400).json({error: 'Invalid request. dolly_pic is a required property'});
    if (!tractor_pic) return res.status(400).json({error: 'Invalid request. tractor_pic is a required property'});

    try {
        const response = await Logs.insertOne({ created_by: req.session.user._id, date: new Date(), engine_pic, dolly_pic, tractor_pic });

        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

//Working in Server
api.get('/logs', async (req, res) => {
    const user_id = req.session.user?._id;

    try {
        const logs = await Logs.find({ created_by: user_id }).toArray();
        logs.reverse()
        return res.json(logs);
    } catch (error) {
        return res.status(404).json({ error: 'Could not find Logs' });
    }
});

api.get('/user', async (req, res) => {
    if (!isLoggedIn(req)) return res.status(401).send("Error. No User Logged In");

    const id = req.session.user._id
    if (!id) return res.status(400).json({error: 'Invalid request. id must be sent in the request params'});

    const users = await Users.find({_id: new ObjectId(id)}).toArray();
    if (!users.length) return res.status(404).json({error: `No user with _id: ${id} found.`});

    const user = users[0];
    req.session.user = user;
    res.json({user});
});

//Working in Server
api.post("/signin", async (req, res) => {
    const { mobile_num } = req.body;

    if (!mobile_num) return res.status(400).json({error: 'Invalid request. mobile_num is a required property'});

    const users = await Users.find({mobile_num}).toArray();
    if (!users.length) return res.status(404).json({error: `No user with number: ${mobile_num} found.`});

    const user = users[0];

    req.session.user = user;
    res.json({user});
});

api.post("/signup", async (req, res) => {
    const { badge_id, mobile_num } = req.body;

    if (!badge_id) return res.status(400).json({error: 'Invalid request. badge_id is a required property'});

    try {
        await Users.updateOne({ user_id: badge_id }, { $set: { mobile_num }});
    } catch (error) {
        return res.status(404).json({ error });
    }
    
    const users = await Users.find({mobile_num}).toArray();
    if (!users.length) return res.status(404).json({error: `No user with badge id: ${badge_id} found.`});

    const user = users[0];

    req.session.user = user;
    res.json({user});
});

//Working in Server
api.post("/signout", async (req, res) => {
    if (!isLoggedIn(req)) return res.json();

    req.session.destroy(err => err ? 
        res.status(400).send("Cannot Log Out") 
        : 
        res.status(200).send()
    );
});

export default initApi;