const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())
console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqq4klv.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db('ServiceCollection')
    const ServiceCollection = database.collection('services')

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    app.get('/service', async(req,res)=>{
        const cursor = ServiceCollection.find()
        const result = await cursor.toArray()
        res.send(result)

    })

    app.get('/service/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id) }
      const result = await ServiceCollection.findOne(query)
      res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res) =>{
    res.send('port is ongoing')
})

app.listen(port, ()=>{
    console.log(`server is running at port ${port}`);
})