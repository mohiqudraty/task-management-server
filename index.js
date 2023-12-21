const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors());



// const uri = "mongodb+srv://task-manager:kh3BcEKLtiDUKa58@cluster0.yu66mpe.mongodb.net/?retryWrites=true&w=majority";
const uri = process.env.MONGO_DB_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('Welcome to Task Management Server!!!')
})

app.listen(port, () => {
  console.log(`Task Management app listening on port ${port}`)
})