const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 8000;

// Middleware configuration
app.use(cors());

// body pars
app.use(express.json());

// User and password for assignment purposes
// task-management
// tloJmLqMjRxXMelU

// Secret key for jwt authorization , this file will only be in env file. I did not put it for Assignment purposes.
const secretKey =
  "fd69d36be8184e89943729e9a70ec4905fd602c4b4ddf4ca4a1a1fdae6c6102be3e407ca704d8b1ff8e2df200ab742ddb40b82279b7b9f336947ce9709a3b489";

// MongoBD Connection URL
const uri =
  "mongodb+srv://task-management:tloJmLqMjRxXMelU@cluster0.e9wqxpd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Database Connection
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Run Function
async function run() {
  try {
    // connect to Database
    const taskCollection = client.db("task-DB").collection("task-listing");
    // Connect to client server
    await client.connect();

    // Middleware for verifying token
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "forbidden access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "forbidden access" });
        }
        req.decoded = decoded;
        next();
      });
    };

    // Create JWT authorization
    app.post("/api/v1/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
      res.send({ token });
    });

    app.post("/api/v1/task-create", verifyToken, async (req, res) => {
      const taskInfo = req.body;
      const result = await taskCollection.insertOne(taskInfo);
      res.send(result);
    });

    // Get api For task Listing
    app.get("/api/v1/task-listing", async (req, res) => {
      // pagination
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const skip = (page - 1) * limit;

      const result = await taskCollection
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();
      // Count data
      const total = await taskCollection.estimatedDocumentCount();
      res.send({
        total,
        result,
      });
    });

    // get by Id For Task Listing
    app.get("/api/v1/task-list/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    // Update task Listing
    app.patch("/api/v1/task-update/:id", async (req, res) => {
      const id = req.params.id;
      const taskInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateTask = {
        $set: {
          name: taskInfo.name,
          image: taskInfo.image,
          title: taskInfo.title,
          description: taskInfo.description,
          price: taskInfo.price,
          postTime: new Date(),
          // arrays: [taskInfo.arrays],
        },
      };
      const result = await taskCollection.updateOne(filter, updateTask);
      res.send(result);
    });

    // deleted task
    app.delete("/api/v1/task-list/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    // ---------------------------------------------------end----------------------------

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Route call
app.get("/", (req, res) => {
  res.send(
    `<h1 style="color:#242B2E;font-size:62px; text-align:center;margin-top:200px">Welcome to Task server</h1>`
  );
});

// Handle Not Found Route
// app.use((req, res) => {
//   res.status(httpStatus.NOT_FOUND).json({
//     success: false,
//     message: "Not Found",
//     errorMessage: [
//       {
//         path: req.originalUrl,
//         message: "API NOT FOUND",
//       },
//     ],
//   });
// });

// Start Server
app.listen(port, () => {
  console.log(`App is running on port http://localhost:${port}`);
});
