const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//dbuser : resolute
//dbpass : cX3HdAEXD65aT8Tk

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://resolute:cX3HdAEXD65aT8Tk@cluster0.yynsyph.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const studentCollection = client.db("resolute-ai").collection("students");
    // GET == products
    app.get("/students", async (req, res) => {
      const students = await studentCollection.find().toArray();
      res.send(students);
    });

    //Delete Product
    app.delete("/students/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentCollection.deleteOne(query);
      res.send(result);
    });
    //POST PRODUCT
    app.post("/students", async (req, res) => {
      const students = req.body;
      const result = await studentCollection.insertOne(students);
      res.send(result);
    });

    app.put("/students/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedDoc = { $set: data };
      const result = await studentCollection.updateOne(
        filter,
        updatedDoc,
        option
      );
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World ");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
