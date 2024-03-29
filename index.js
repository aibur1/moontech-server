const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const bodyParser= require('body-parser');
const cors = require("cors");
require('dotenv').config();

const port = 5000;


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6jqkzzd.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb://localhost:27017`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
  try {
    const db = client.db("moontech");
    const productCollection = db.collection("product");
    
    
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();
      
      res.send({ status: true, data: product });
    });

    
    

    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
  
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.findOne({_id:ObjectId(id)});
      console.log(result);
      res.send(result);
    });


    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("backend-->",data);
      const result = await productCollection.updateOne({_id  : ObjectId(id)}, {$set: data});
      res.json(result);
    });


  } finally {
  }
};

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


