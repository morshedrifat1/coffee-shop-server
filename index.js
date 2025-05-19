const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.qxglz45.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      const coffeeCollection = client.db('coffeeDB').collection("coffees")
      
      app.post('/coffees', async (req, res) => {
          const newCoffee = req.body;
          const result = await coffeeCollection.insertOne(newCoffee);
          res.send(result)
          console.log(newCoffee);
    })

      app.get('/coffees', async (req, res) => {
        const cursor = coffeeCollection.find();
          const allValues = await cursor.toArray();
          res.send(allValues)
      })

      app.delete('/coffees/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await coffeeCollection.deleteOne(query);
          res.send(result)
      })
      app.get('/coffees/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await coffeeCollection.findOne(query);
          res.send(result);
      })
      app.put('/coffees/:id', async (req, res) => {
          const id = req.params.id;
          const updatedCoffee = req.body;
          const options = { upsert: true };
          const filter = { _id: new ObjectId(id) };
          const updateDoc = {$set:updatedCoffee}
          const result = await coffeeCollection.updateOne(filter, updateDoc, options);
          res.send(result)
      })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log(`serveris running ${port}`);
})