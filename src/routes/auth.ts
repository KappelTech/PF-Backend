import express from 'express';
import User from '../models/user';
import Token from '../models/token';
import crypto from 'crypto';
import sendEmail from '../middleware/email';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Exercise from '../models/exercise';
import SearchHistory from '../models/searchHistory';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

export const generateCode = () => {
  // Generate a 4-digit random number
  return crypto.randomInt(1000, 9999).toString();
};

const findUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 5 requests per `windowMs`
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// send email with verification code: create a new user with the email.
router.post('/find-user', findUserLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      // User found
      if (user.active) {
        res.status(200).json({
            message: 'User found',
          user,
        });
      } else {
        // User is not active
        const code = generateCode();
        await Token.create({
          email: user.email,
          code: code,
          expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes from now
        });
        sendEmail(user.email, code);
        res.status(200).json({
          message: 'User found, not Active',
          user,
        });
      }
    } else {
      res.status(200).json({
        message: 'No user',
        user,
      });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/send-code', async (req, res) => {
  
  try {
    const { email } = req.body;

    // const newUser = new User({ email });
  
    // const savedUser = await newUser.save();

    const code = generateCode();
    console.log('code:', code)
    await Token.create({
      email: email,
      code: code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes from now
    });
    sendEmail(email, code);
    return res.status(200).json({
      message: 'Email sent',
      // user: savedUser,
    });
  } catch (error) {
    console.log(error)
  }
});

// verify code with persons email // have the user create a password

router.post('/create-user', async (req, res, next) => {
  try {
    const { email, code, firstName, lastName, password } = req.body;

    // Find the token associated with the email
    const token = await Token.findOne({ email, code });

    if (!token) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // If token is valid, find the user
    // const user = await User.findOne({ email });

    // if (!user) {
    //   return res.status(404).json({ message: 'User not found.' });
    // }

    // Update user details
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      active: true
    })

    const savedUser = await newUser.save();

    // Generate JWT
    const tokenPayload = { email: savedUser.email, userId: savedUser._id }; // Include any additional user info as needed
    const jwtToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Expires in 3600 seconds

    // Optionally, remove the token after verification
    await Token.deleteOne({ email, code });

    return res
      .status(200)
      .json({ message: 'User activated successfully.', user:savedUser, token: jwtToken, expiresIn: 3600 });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/resend-code', async (req, res, next) => {
  try {
    const { email } = req.body;

    // Generate a new verification code
    const code = generateCode();

    // Check if a token already exists for this email
    let token = await Token.findOne({ email });

    if (token) {
      // Update the existing token with the new code and reset expiresAt
      token.code = code;
      token.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      await token.save();
    } else {
      // Create a new token
      token = new Token({
        email,
        code,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes from now
      });
      await token.save();
    }

    // Send the new code via email
    sendEmail(email, code);

    return res.status(200).json({ message: 'Verification code resent successfully.' });
  } catch (error) {
    console.error('Error resending verification code:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email }).select('+password'); // Include password in the query

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT
    const tokenPayload = {
      userId: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' }); // 1-hour expiration

    return res.status(200).json({
      message: 'Login successful.',
      token,
      expiresIn: 3600, // 3600 seconds = 1 hour
      user,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// EXERCISE STUFF

router.get('/exercises/autocomplete', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Please provide a search query parameter ?name=' });
  }

  try {
    // Perform a case-insensitive search using a regular expression to match names starting with the query
    const exercises = await Exercise.find({
      name: { $regex: `${name}`, $options: 'i' },
    })
      //   .select('name') // Only return the 'name' field
      .limit(10);

    res.status(200).json(exercises);
  } catch (err) {
    console.error('Error performing autocomplete search:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to save selected exercise to recent searches
router.post('/users/:userId/exercise-searched', async (req, res) => {
  const { userId } = req.params;
  const { exerciseId, exerciseName } = req.body;

  if (!exerciseId || !exerciseName) {
    return res.status(400).json({ message: 'Exercise ID and name are required.' });
  }

  try {
    // Find the user (optional if you just want to verify that user exists)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the SearchHistory collection
    const existingHistory = await SearchHistory.findOne({ userId, exerciseId });

    if (existingHistory) {
      // Increment the search count and update lastSearchedAt
      existingHistory.searchCount += 1;
      existingHistory.lastSearchedAt = new Date();
      await existingHistory.save();
    } else {
      // Create a new search history record
      const newSearchHistory = new SearchHistory({
        userId,
        exerciseId,
        exerciseName,
        searchCount: 1,
      });
      await newSearchHistory.save();
    }

    res.status(200).json({ message: 'Exercise saved to search history.' });
  } catch (err) {
    console.error('Error saving to search history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/:userId/recent-searches', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find search history for the user sorted by searchCount in descending order
    const mostSearchedExercises = await SearchHistory.find({ userId })
      .sort({ searchCount: -1 })
      .limit(10); // Limit to the top 10 most searched exercises

    res.status(200).json(mostSearchedExercises);
  } catch (err) {
    console.error('Error fetching most searched exercises:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/:userId/top-exercises', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the top 5 most used exercises for the user, sorted by searchCount
    const topExercises = await SearchHistory.find({ userId })
      .sort({ searchCount: -1 }) // Sort by search count in descending order
      .limit(5) // Limit the results to the top 5
      .select('exerciseName searchCount -_id'); // Select only the exercise name and search count

    // If no exercises are found, return an empty array but still with 200 OK
    if (topExercises.length === 0) {
      return res.status(200).json([]); // Return an empty array
    }

    // Return the top exercises with a 200 OK status
    return res.status(200).json(topExercises);
  } catch (err) {
    console.error('Error fetching top exercises:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

const generateWorkout = async (userPreferences, selectedEquipment, duration) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a fitness coach that generates workout plans.' },
          // `Generate a concise varied CrossFit-style "For Time" workout plan using the following equipment: ${selectedEquipment.join(', ')}. Please limit the response to 3 exercises and keep it brief.` }
          {
            role: 'user',
            content: `Generate a concise CrossFit-style ${duration} duration ${userPreferences} workout with the following equipment: ${selectedEquipment.join(', ')}. Include only the workout exercises, without any warm-up or cool-down instructions.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GPT_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating workout:', error);
    throw error;
  }
};

router.post('/users/generate-workout', async (req, res) => {
  const { preferences, equipment, duration } = req.body;
  console.log(req.body);
  try {
    const workoutPlan = await generateWorkout(preferences, equipment, duration);
    // res.json(workoutPlan);
    res.status(200).json(workoutPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error generating workout' });
  }
});

const Auth = router;
export default Auth;
