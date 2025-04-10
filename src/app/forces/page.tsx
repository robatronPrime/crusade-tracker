import { getForces } from "../actions";

export default async function Home() {
  const fetchForces = await getForces();
  
 console.log(fetchForces);

 const { MongoClient, ServerApiVersion } = require('mongodb');
 const uri = process.env.MONGODB_URI;
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
     await client.close();
   }
 }
 run().catch(console.dir);
 
  return (
    <>
      <h2>Forces</h2>
      {/* {forces.map(force => (
        <div key={force.id}>
          <h3>{force.name}</h3>
        </div>
      ))} */}
    </>
  );
}
