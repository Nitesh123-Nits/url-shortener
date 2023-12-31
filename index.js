const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute= require('./routes/staticRouter')
const URL = require("./models/url");
const path=require('path')

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("Mongodb connected")
);


app.set("view engine","ejs")
app.set('views',path.resolve("./views"))
app.use(express.json()); //ham json data bhi support karenge
app.use(express.urlencoded({extended:false})) // ham for ka data bhi support karenge


app.use("/url", urlRoute);
app.use('/',staticRoute)
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
