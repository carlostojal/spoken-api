const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const checkNsfw = require("./helpers/media/checkNsfw");
const app = express();

app.use(fileUpload({
  createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// serve the NSFW classification model statically
app.use("/nsfw_model", express.static(path.join(__dirname, "models/nsfw")));

// media upload
app.post("/upload", async (req, res) => {

  const compressImage = require("./helpers/media/compressImage");
  const getUserByToken = require("./helpers/session/getUserByToken");
  const deleteFile = require("./helpers/media/deleteFile");
  const insertMedia = require("./helpers/controllers/media/insertMedia");
  const generateId = require("./helpers/generateId");

  const allowed_formats = ["jpg", "jpeg", "png"];

  let result = {
    media_id: null,
    result: null,
    status: 200
  };

  // no files were uploaded
  if(!req.files) {
    result.result = "NO_FILE";
    result.status = 400;
    return res.status(result.status).send(result);
  }
  
  // get token from headers
  const token = req.headers.authorization;

  // no token was provided
  if(!token || token == "") {
    result.result = "NO_ACCESS_TOKEN";
    result.status = 403;
    return res.status(result.status).send(result);
  }
    
  // authenticate user from token
  let user = null;
  try {
    user = await getUserByToken(token);
  } catch(e) {
    result.result = "AUTHORIZATION_ERROR";
    result.status = 500;
    return res.status(result.status).send(result);
  }

  // the token was not valid
  if(!user) {
    result.result = "BAD_AUTHENTICATION";
    result.status = 403;
    return res.status(result.status).send(result);
  }

  // get media from request args
  const media_file = req.files.media;

  const generated_id = generateId();

  // get file format
  const split_file_name = media_file.name.split(".");
  const format = split_file_name[split_file_name.length - 1];
  if(!allowed_formats.includes(format)) {
    result.result = "FORMAT_NOT_ALLOWED";
    result.status = 400;
    return res.status(result.status).send(result);
  }

  // path to store the media
  const path = `uploads/temp/${generated_id}.${format}`;
  const dest_path = "uploads";

  // move the media file to the temp path
  media_file.mv(path);

  // compress the media (and move to destination path)
  let image = null;
  try {
    image = await compressImage(path, dest_path);
  } catch(e) {
    console.error(e);
    result.result = "ERROR_COMPRESSING_MEDIA";
    result.status = 500;
    return res.status(result.status).send(result);
  }

  // delete the temp file
  try {
    await deleteFile(path);
  } catch(e) {
    result.result = "ERROR_REMOVING_TEMP_FILE";
    result.status = 500;
    return res.status(result.status).send(result);
  }

  const media = {
    id: generated_id,
    user_id: user.id,
    path: image.destinationPath,
    time: Date.now(),
    keywords: null,
    is_nsfw: null,
    nsfw_cause: null,
    review_status: "pending"
  };

  // save media in DB
  try {
    await insertMedia(media);
  } catch(e) {
    result.result = "ERROR_REGISTERING_MEDIA";
    result.status = 500;
    return res.status(result.status).send(result);
  }

  try {
    checkNsfw(media);
  } catch(e) {

  }

  result.result = "FILE_UPLOADED";
  result.media_id = media.id;
  return res.status(result.status).send(result);
});

// get media
app.get("/media/:id/:token?", async (req, res) => {

  const getMediaById = require("./helpers/controllers/media/getMediaById");
  const getUserByToken = require("./helpers/session/getUserByToken");
  const userFollowsUser = require("./helpers/controllers/users/userFollowsUser");
  
  const media_id = req.params.id;
  const token = req.params.token;

  if(!media_id)
    return res.status(403).send("NO_MEDIA_ID");

  let media = null;
  try {
    media = await getMediaById(media_id);
  } catch(e) {
    return res.status(500).send("ERROR_GETTING_MEDIA");
  }

  if(!media)
    return res.status(404).send("MEDIA_NOT_FOUND");

  if(media.uploader_profile_type == "private") {

    if(!token)
      return res.status(403).send("NO_ACCESS_TOKEN");

    let user = null;
    try {
      user = await getUserByToken(token);
    } catch(e) {
      return res.status(500).send("ERROR_AUTHORIZING_USER");
    }

    if(!user)
      return res.status(401).send("BAD_TOKEN");

    const user_allowed = await userFollowsUser(user.id, media.uploader_id);

    if(user.id != media.uploader_id && !user_allowed)
      return res.status(401).send("CONTENT_VIEW_NOT_ALLOWED");
  }

  return res.sendFile(media.path, { root: "." });
});

const port = process.env.EXPRESS_PORT;

app.listen(port, () => {
  console.log(`Express server running at port ${port}`);
});