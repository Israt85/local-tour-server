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
    const BookingCollection = database.collection('Booking')

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // app.get('/service', async(req,res)=>{
    //     const cursor = ServiceCollection.find()
    //     const result = await cursor.toArray()
    //     res.send(result)

    // })
    app.get('/service', async(req,res)=>{
      console.log(req.query.email);
      let query ={};
      if(req.query?.email){
        query = {email: req.query.email}
      }

      const result= await ServiceCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/service/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id) }
      const result = await ServiceCollection.findOne(query)
      res.send(result)
    })
    
    

    app.post('/service', async(req,res)=>{
      const user = req.body
      console.log(user);
      const result = await ServiceCollection.insertOne(user)
      res.send(result)
    })
    app.put('/service/:id', async(req,res)=>{
      const id = req.params.id
      const updateUser = req.body
      console.log(updateUser);
      const filter = {_id : new ObjectId(id)}
      const update = {
          $set:{
            // service_price:updateUser.price, 
            // service_name:updateUser.service ,
            //  service_description: updateUser.description,
            //   service_area: updateUser.address, 
            //   service_image:updateUser.photo,
            ...updateUser
          }
      }
      const result = await ServiceCollection.updateOne(filter,update,{
        upsert: true
      })
      res.send(result)
  })

   app.delete('/service/:id', async(req,res)=>{
    const id = req.params.id
    const query = {_id : new ObjectId(id)}
    const result = await ServiceCollection.deleteOne(query)
    res.send(result)
   })
  app.get('/booking', async(req,res)=>{
        const cursor = BookingCollection.find()
        const result = await cursor.toArray()
        res.send(result)
  })

   app.post('/booking', async(req,res)=>{
    const user = req.body
    console.log(user);
    const result = await BookingCollection.insertOne(user)
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