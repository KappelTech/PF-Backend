import express from 'express';
const router = express.Router();

router.get('',(req, res, next) => {
    res.status(201).json({
        message: `Your're pinging, I'm here!!!!, helloo?`,
    });
})

const Ping = router;
export default Ping;