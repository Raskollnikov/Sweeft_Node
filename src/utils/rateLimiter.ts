import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 20, 
    message: "too many requests, please try again later.",
});

export default limiter;