const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_KEY}@cluster0.tbtpug1.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const serviceCollection = client.db("crossTheBorder").collection("services");
        const reviewCollection = client.db("crossTheBorder").collection("reviews");

        //for 3 service in home page
        app.get("/topThreeService", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).sort({ x: -1 }).limit(3);
            const services = await cursor.toArray();

            res.send(services);
        })

        //for all service
        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).sort({ x: -1 });
            const services = await cursor.toArray();

            res.send(services);
        })

        //get specific service
        app.get("/serviceDetails/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);

            res.send(service);
        })

        //add service
        app.post("/services", async (req, res) => {
            const service = req.body;

            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        //add review
        app.post("/reviews", async (req, res) => {
            const review = req.body;

            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        //get review
        app.get("/reviews/:id", async (req, res) => {
            const id = req.params.id;

            let query = [];

            if (id.includes("@")) {
                query = { email: id }
            }
            else {
                query = { serviceId: id };
            }
            // console.log(query)
            const cursor = reviewCollection.find(query).sort({ x: 1 });
            const reviews = await cursor.toArray();

            res.send(reviews);
        });

        //delete review
        app.delete("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


    } finally {

    }
}
run().catch(er => console.log(er));



app.get("/", (req, res) => {
    res.send("cross the border api running");
});

app.listen(port, () => {
    console.log(`cross the border api running on port ${port}`);
});