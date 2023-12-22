const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors());


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
    // await client.connect();


    const benefitsCollection = client.db('taskDB').collection('benefits')
const taskCollection = client.db('taskDB').collection('allTask')


// -------------post a task----------------- 
app.post('/api/task-post', async (req, res) => {
    const task = req.body
    const result = await taskCollection.insertOne(task)
    res.send(result)
})

// ---------------get all task ---------------
app.get("/api/tasks", async (req, res) => {
    try {
      const userEmail = req.query.userEmail;
      const query = {userEmail: userEmail}
      const result = await taskCollection.find(query).sort({ deadline: 1 }) .toArray();
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  });

// -------------update a task----------------- 
app.put('/api/task-update', async (req, res) => {
  const id = req.query.id
  const taskData = req.body
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      deadline: taskData.deadline,
      status: taskData.status
    },
  };
  const result = await taskCollection.updateOne(filter,updateDoc,options)
  res.send(result)
})

// -------------update a status----------------- 
app.put('/api/task-updateStatus', async (req, res) => {
  const id = req.query.id
  const {status} = req.body
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const updateDoc = {
    $set: {
     
      status
    },
  };
  const result = await taskCollection.updateOne(filter,updateDoc,options)
  res.send(result)
})



// -------------delete a task----------------- 
app.delete('/api/task-delete', async (req, res) => {
    const id = req.query.id
    const query = {_id: new ObjectId(id)}
    const result = await taskCollection.deleteOne(query)
    res.send(result)
})




// benefit data 
app.get("gi", async (req, res) => {
  try {
    const result = await benefitsCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});










    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
