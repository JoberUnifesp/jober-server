const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./databaseConnection')
const bcrypt = require('bcryptjs')

const company = require("./routes/company.js");
const userProfile = require("./routes/userProfile.js");
const vacancy = require("./routes/vacancy.js");
const interaction = require("./routes/interaction.js");
const index = require("./routes/index.js");

app.use(express.json())
app.use(cors())

app.use("/company", company);
app.use("/UserProfile", userProfile);
app.use("/vacancy", vacancy);
app.use("/interaction", interaction);
app.use("/index", index);

module.exports = app