const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const User = require("../models/User");
const Media = require("../models/Media");
const { Types } = require("mongoose");

const app = express();

app.use(fileUpload({
  createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(morgan("dev"));

app.post("/upload", async (req, res) => {
  try {
    if(!req.files) {
      res.send({
        status: false,
        message: "No files uploaded."
      });
    } else {

      const token = req.headers.authorization;

      if(!token || token == "")
        return res.status(500).send(new Error("No access token provided."));

      // get uploader from token
      User.findOne({"access_tokens.value": token, "access_tokens.expiry": { $gt: Date.now() }}).then((user) => {
        if(!user)
          return res.status(500).send(new Error("Invalid access token."));
        
        const media_file = req.files.media;

        const path = `uploads/${media_file.name}`;
  
        // move media to uploads path
        media_file.mv(path);
  
        // save path and uploader in DB
        const media = new Media({
          uploader: user._id,
          path
        });
  
        media.save().then((media) => {
          res.send({
            status: true,
            message: "File uploaded.",
            data: {
              id: media._id
            }
          });
        }).catch((error) => {
          res.status(500).send(error);
        });
        
      }).catch((error) => {
        res.status(500).send(error);
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/media/:id/:token?", async (req, res) => {
  const media_id = req.params.id;
  const token = req.params.token;
  // get media from ID
  const query = Media.findById(Types.ObjectId(media_id));
  query.populate("uploader");
  query.exec((error, media) => {

    if(error) return res.status(500).send(error);

    // no media found by this ID
    if(!media)
      return res.status(404).send(new Error("Media not found."));

    let should_send = false;

    // if the uploader has a private account check if the logged in user has permissions
    if(media.uploader.profile_type == "private") {

      if(!token)
        return res.status(403).send(error);

      const query = User.findOne({"access_tokens.value": token, "access_tokens.expiry": { $gt: Date.now() }});
      query.populate("following");
      query.exec((error, user) => {
        if(error) return res.status(500).send(error);

        if(!user) return res.status(403).send(new Error("Access denied."));

        user.following = user.following.filter((relation) => relation.follows.equals(media.uploader._id) && relation.accepted);

        if(user.following.length == 1)
          should_send = true;
      });
    } else {
      should_send = true;
    }
    
    if(should_send)
      return res.sendFile(media.path, { root: "." });
    else
      return res.status(403).send(new Error("Access denied."))
  })
});

const port = process.env.EXPRESS_PORT;

app.listen(port, () => {
  console.log(`Express server running at port ${port}`);
});