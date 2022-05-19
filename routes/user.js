const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authUser, authRole } = require("../middleware/check-auth")
const { nanoid } = require("nanoid");
const sendEmail = require("../middleware/email")


const User = require("../models/user");
const Token = require("../models/token")

const router = express.Router();

//Create
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
    });
    user.save().then((result) => {
      // console.error(result)
      // res.status(201).json({
      //   message: "User Created!",
      //   result: result,
      // });

      function betweenRandomNumber() {
        return Math.floor(
          Math.random() * (9999 - 1000 + 1) + 1000
        ).toString()
      }
      let code = betweenRandomNumber()
      console.error('code:', code)

      let id = nanoid()

      let token = new Token({
        userId: user._id,
        // token: id,
        token: code,
      })
      token.save().then((result) => {
        console.error(result)

       
        // console.error(res)

        // const message = `http://localhost:3000/api/user/verify/${user.id}/${token.token}`;
        // sendEmail(user.email, "Verify Email", message)
        // res.status(201).json({
        //   message: 'An email was sent to you to verify'
        // })
        const message = code;
        sendEmail(user.email, "Verify Email", message)
        res.status(201).json({
          message: 'An email was sent to you to you with a verification code'
        })

      }).catch((err) => {
        console.error('token error', err)
      })


    })
      .catch((err) => {
        console.error(err)
        if (err.kind = 'unique') {
          console.error('thats an error')
          res.status(401).json({
            title: 'Account Error',
            message: 'A user with that email address already exists'
          })
        } else {
          res.status(500).json({
            error: err,
          });
        }

      });
  });
});


// router.get("/verify/:id/:token", async (req, res) => {
//   User.findOne({_id: req.params.id}).then((user)=> {
//     console.error('user', user)
//     if (!user){

//     }
//   })
// });

router.get("/verify/:code", (req, res, next) => {
  console.error(req.params.code)
  Token.findOne({ token: req.params.code }).then((token) => {
    if (!token) {
      return res.status(401).json({
        error: 'error',
        title: 'Unable to Verify',
        message: 'You entered an invalid verification code'
      })
    }
    User.findOne({ _id: token.userId }).then((user) => {
      console.error(user)
      if (!user) {
        res.status(401).json({
          title: 'Error',
          message: 'No User found'
        })
      }
      User.updateOne(
        { _id: user._id },
        {
          $set:
            { active: true }
        }
      ).then((verifiedUser) => {
        console.error('verified user:', verifiedUser)
        if (verifiedUser.nModified > 0){
          Token.findByIdAndDelete(token._id).then(deleted => {
            console.error('deleted:', deleted)
          })
          
          res.status(200).json({ 
            message: "Update Successful",
            user: user
           });
        } else {
          res.status(401).json({ message: "Something went wrong" });
        }

      })
    })
  })
})

router.get("/resendCode/:email", (req,res,next)=> {
  let email = req.params.email
    User.findOne({email: email}).then((user)=> {
      console.error(user)
      if (!user) {
        return res.status(402).json({
          title: 'Error',
          message: " No User with that email address",
        });
      }
      Token.findOne({userId: user._id}).then((token)=> {
        console.error(token)
        if(!token){
          console.error('NOOO token')
          res.status(401).json({
            title:'Error',
            message:"No code found, please contact progressional fitness"
          })
        }
        sendEmail(user.email, "Verify Email", token.token)
        res.status(201).json({
          message: 'An email was sent to you to you with your verification code'
        })



      })
    })
})




router.post("/login", (req, res, next) => {
  
  // console.error('hello', req.body)
  let fetchedUser;
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(402).json({
        title: 'Error',
        message: " No User with that email address",
      });
    }
    fetchedUser = user
    return bcrypt.compare(req.body.password, user.password);
  }).then((result) => {
    if (!result) {
      return res.status(402).json({
        title: 'Error',
        message: "Incorrect Password",
      });
    }
    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      "secret_this_should_be_longer",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      active: fetchedUser.active,
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      role: fetchedUser.role
    });
  })
    .catch((err) => {
      return res.status(402).json({
        message: "Auth Failedddd",
      });
    });
});

//Read
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find();
  let fetchedUsers;
  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  userQuery
    .then((documents) => {
      fetchedUsers = documents;
      return User.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Users fetched successfully!",
        users: fetchedUsers,
        maxUsers: count,
      });
    });
});

router.post("/newUser", authUser, (req, res, next) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role
  });

  user.save().then((createdUser) => {
    res.status(201).json({
      message: "User Added Successfully",
      userId: createdUser._id,
    });
  });
}
);

//Update
router.put(
  "/:id", authUser, authRole(),
  (req, res, next) => {
    console.error(req)
    const user = new User({
      _id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role
    });
    User.updateOne({ _id: req.params.id }, user).then((result) => {
      console.error(result)
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update Successful" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    });
  });

// Update specific
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id).select('-password').then((user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

//Delete
router.delete("/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then((result) => {
    console.error(result)
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion Successful" });
    } else {
      res.status(401).json({ message: "Not Authorized" });
    }
  });
});

module.exports = router;
