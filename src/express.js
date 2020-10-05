const express = require("express");
const fileUpload = require("express-fileupload");
const { Types } = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const User = require("./models/User");
const Media = require("./models/Media");
const compressImage = require("./helpers/media/compressImage");

const app = express();

app.use(fileUpload({
  createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// email confirmation
app.get("/confirm", (req, res) => {
  try {

    if(!req.query.uid || !req.query.confirmation_code)
      return res.send("Bad confirmation link.");

    User.findById(req.query.uid).then((user) => {

      if (!user) return res.send("Bad confirmation link.");

      if(user.email_confirmed)
        return res.send("Account already confirmed. You can close this.");

      // the confirmation code is correct
      if(user.confirmation_code == req.query.confirmation_code) {
        user.email_confirmed = true;
        user.save().then(() => {
          return res.send("Email confirmed successfully. You can now close this.");
        }).catch((e) => {
          
          return res.status(500).send("Error saving user. Please refresh this page or try again later.");
        });
      } else {
        return res.send("Bad confirmation link.");
      }
    }).catch((e) => {
      return res.status(500).send("Error loading confirmation link. Please refresh this page.");
    });
  } catch(e) {
    res.status(500).send("Unexpected error. Please refresh this page.");
  }
});

// media upload
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
        return res.status(403).send(new Error("No access token provided."));

      // get uploader from token
      User.findOne({"access_tokens.value": token, "access_tokens.expiry": { $gt: Date.now() }}).then((user) => {
        if(!user)
          return res.status(500).send(new Error("Invalid access token."));
        
        const media_file = req.files.media;

        const path = `uploads/temp/${media_file.name}`;
        const dest_path = "uploads";
  
        // move media to uploads path
        media_file.mv(path);

        compressImage(path, dest_path).then((image) => {
          const final_path = image.destinationPath;

          fs.unlink(path, (error) => {
            if (error) res.status(500).send(error);

            // save path and uploader in DB
            const media = new Media({
              uploader: user._id,
              path: final_path
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
              
              return res.status(500).send(error);
            });
          });
        }).catch((error) => {
          
          return res.status(500).send(error);
        });        
      }).catch((error) => {
        
        res.status(500).send(error);
      });
    }
  } catch (error) {
    
    res.status(500).send(error);
  }
});

// get media
app.get("/media/:id/:token?", async (req, res) => {
  const media_id = req.params.id;
  const token = req.params.token;
  try {
    // get media from ID
    const query = Media.findById(Types.ObjectId(media_id));
    query.populate("uploader");
    let media = await query.exec();

    let response = {
      error: null
    };

    // no media found by this ID
    if(!media) {
      response.error = "Media not found.";
    }

    // if the uploader has a private account check if the logged in user has permissions
    if(media.uploader.profile_type == "private") {

      if(!token) {
        response.error = "No token provided.";
      }

      const query = User.findOne({"access_tokens.value": token, "access_tokens.expiry": { $gt: Date.now() }});
      query.populate("following");
      let user = await query.exec();

      if(!user) {
        response.error = "Invalid token.";
      }

      // if no errors, check permission
      if(!response.error) {
        user.following = user.following.filter((relation) => relation.follows.equals(media.uploader._id) && relation.accepted);

        if(!user._id.equals(media.uploader._id) && user.following.length == 0) {
          response.error = "Access denied";
        }
      }
    }
    
    if(!response.error)
      return res.sendFile(media.path, { root: "." });
    else
      return res.status(403).send(response);
    
  } catch(error) {
    response.error = error.message;
    return res.status(500).send(response);
  }

});

const port = process.env.EXPRESS_PORT;

app.listen(port, () => {
  console.log(`Express server running at port ${port}`);
});