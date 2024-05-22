
// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 5000; // Corrected the typo here
// const mongoose = require("mongoose")
// const { mongoUrl } = require("./keys")
// const cors = require('cors')
// const path = require('path')

// app.use(cors())

// require('./models/models')
// require("./models/post")
// app.use(express.json())
// app.use(require("./routes/auth"))
// app.use(require("./routes/createPost"))
// app.use(require("./routes/user"))

// mongoose.connect(mongoUrl);
// mongoose.connection.on("connected", () => {
//     console.log("successfully connects the mongo");
// })
// mongoose.connection.on("error", () => {
//     console.log("not connected to mongo db");
// })

// // serving frontend
// app.use(express.static(path.join(_dirname, "./instagram/dist")))

// app.get("*", (req, res) => {
//     res.sendFile(
//         path.join(_dirname, "./instagram/dist/index.html"),
//         function (err)=> {
//         res.status(500).send(err)

//     }
//     )
// })

// app.listen(PORT, () => {
//     console.log("surver is running on port " + " " + PORT);
// })

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const cors = require('cors');
const path = require('path');

app.use(cors());

require('./models/models');
require("./models/post");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
    console.log("Successfully connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.error("Error connecting to MongoDB: ", err);
});

// Serving frontend
app.use(express.static(path.join(__dirname, "./instagram/dist")));

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "./instagram/dist/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
                console.error(err);
            }
        }
    );
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
