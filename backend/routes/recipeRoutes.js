const express = require("express");
const router = express.Router();
const {
  postRecipe,
  getMyRecipes,
  editRecipe,
  getRecipeById,
  getRecipes,
  deleteRecipeById,
  getLastThree,
  postComment,
  getAllComments,
} = require("../controllers/recipesController");

const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./frontend/public/uploads");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);

//     cb(null, file.originalname);
//     // UNUQIE FILENAME
//     //cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const storage = new GridFsStorage({
//   url: process.env.MONGO_URI,
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg"];

//     if (match.indexOf(file.mimetype) === -1) {
//       const filename = `${Date.now()}-cook-master-${file.originalname}`;
//       return filename;
//     }

//     return {
//       bucketName: "photos",
//       filename: `${Date.now()}-cook-master-${file.originalname}`,
//     };
//   },
// });

// const upload = multer({ storage: storage });

// TODO image upload ACADEMIND
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

// POST, EDIT and DELETE recipes
router.post("/", protect, upload.single("photos"), postRecipe);
router.put("/:id", protect, upload.single("photos"), editRecipe);
router.delete("/:id", protect, deleteRecipeById);

// GET list of user's recipes
router.get("/myRecipes", getMyRecipes);

// GET public recipes and single recipe
router.get("/", getRecipes);
router.get("/lastThree", getLastThree);
router.get("/:id", getRecipeById);

// GET, POST and DELETE comments
router.post("/comments", protect, postComment);
router.get("/:id/comments", getAllComments);

module.exports = router;
