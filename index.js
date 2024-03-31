const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const httpStatus = require("http-status");

const port = process.env.PORT || 8000;

// Middleware configuration
app.use(cors());

// body pars
app.use(express.json());

// User and password
// task-management
// tloJmLqMjRxXMelU


// MongoBD Connection URL 
const uri = "mongodb+srv://task-management:tloJmLqMjRxXMelU@cluster0.e9wqxpd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";



// Database Connection
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Run Function
async function run() {
  try {
      await client.connect();
      

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "API NOT FOUND",
      },
    ],
  });
  next();
});

// Start Server
app.listen(port, () => {
  console.log(`App is running on port http://localhost:${port}`);
});
