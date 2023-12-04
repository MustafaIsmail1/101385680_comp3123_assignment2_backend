const express = require("express");
const cors = require("cors"); 

const employeeRoutes = require("./routes/employees");
const userRoutes = require("./routes/users");
const mongoose = require("mongoose");

const app = express();
const SERVER_PORT = 8585;

app.use(express.json());
app.use(express.urlencoded());


app.use(cors());

const DB_CONNECTION_STRING =
"mongodb+srv://mustafaismailmab:mumu123@cluster0.kmefq4m.mongodb.net/?retryWrites=true&w=majority"
mongoose
  .connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the MongoDB Atlas Server");
  })
  .catch((err) => {
    console.log(
      "Could not connect to the database. Exiting now...",
      err
    );
    process.exit();
  });

app.use("/api/v1/emp", employeeRoutes);
app.use("/api/v1/", userRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Pay Load application </h1>");
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});
