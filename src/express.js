const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const compressImage = require("./helpers/media/compressImage");
const getUserByToken = require("./helpers/session/getUserByToken");
const redisClient = require("./config/redis");
const mysqlClient = require("./config/mysql");
const deleteFile = require("./helpers/media/deleteFile");
const insertMedia = require("./helpers/controllers/media/insertMedia");
const generateId = require("./helpers/generateId");
const getMediaById = require("./helpers/controllers/media/getMediaById");
const userFollowsUser = require("./helpers/controllers/users/userFollowsUser");
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

  const allowed_formats = ["jpg", "jpeg", "png"];

  // no files were uploaded
  if(!req.files)
    return res.status(400).send("NO_FILE");
  
  // get token from headers
  const token = req.headers.authorization;

  // no token was provided
  if(!token || token == "")
    return res.status(403).send("NO_ACCESS_TOKEN")

  // authenticate user from token
  let user = null;
  try {
    user = await getUserByToken(token, mysqlClient, redisClient);
  } catch(e) {
    return res.status(500).send("AUTHORIZATION_ERROR");
  }

  // the token was not valid
  if(!user)
    return res.status(403).send("BAD_AUTHENTICATION");

  // get media from request args
  const media_file = req.files.media;

  const generated_id = generateId();

  // get file format
  const split_file_name = media_file.name.split(".");
  const format = split_file_name[split_file_name.length - 1];
  if(!allowed_formats.includes(format))
    return res.status(500).send("FORMAT_NOT_ALLOWED");

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
    return res.status(500).send("ERROR_COMPRESSING_IMAGE");
  }

  // delete the temp file
  try {
    await deleteFile(path);
  } catch(e) {
    return res.status(500).send("ERROR_REMOVING_TEMP_FILE");
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
    return res.status(500).send("ERROR_REGISTERING_MEDIA");
  }

  checkNsfw(media);

  return res.status(200).send("FILE_UPLOADED");
});

// get media
app.get("/media/:id/:token?", async (req, res) => {
  
  const media_id = req.params.id;
  const token = req.params.token;

  if(!media_id)
    return res.status(403).send("NO_MEDIA_ID");

  let media = null;
  try {
    media = await getMediaById(media_id, mysqlClient);
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
      user = await getUserByToken(token, mysqlClient);
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