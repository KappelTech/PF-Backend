const express = require("express");
const multer = require("multer");
const {authUser} = require("../middleware/check-auth")

const router = express.Router();

const Post = require("../models/post");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// router.post(
//   "",
//   authUser,
//   multer({ storage: storage }).single("image"),
//   (req, res, next) => {
//     const post = new Post({
//       title: req.body.title,
//       content: req.body.content,
//       creator: req.userData.userId
//     });

//     post.save().then((createdPost) => {
//       res.status(201).json({
//         message: "Post Added Successfully",
//         postId: createdPost._id,
//       });
//     });
//   }
// );

router.post("",authUser,(req, res, next) => {
  console.error(req)
    // const post = new Post({
    //   title: req.body.title,
    //   content: req.body.content,
    //   creator: req.userData.userId
    // });
    Post.create(req.body, (err,post) => {
      if (err) return next(err);
      res.status(201).json({
        message: "Post successfully Added",
        post: post
      })
    })

    // Post.save(req.body, (err,post)=> {
    //   if (err) return next(err);
    //   res.json(post)
    // })

    // post.save().then((createdPost) => {
    //   res.status(201).json({
    //     message: "Post Added Successfully",
    //     postId: createdPost._id,
    //   });
    // });
  }
);

router.put(
  "/:id",
  authUser,
  (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then((result) => {
    if(result.nModified > 0) {
    res.status(200).json({ message: "Update Successful" });
    } else {
    res.status(401).json({ message: "Not Authorized" });
    }
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
});

router.delete("/:id", authUser, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    console.error(result)
    if(result.n > 0) {
      res.status(200).json({ message: "Deletion Successful" });
      } else {
      res.status(401).json({ message: "Not Authorized" });
      }
  });
});

module.exports = router;
