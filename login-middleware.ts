import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

export const applyMiddleware = (middleware) => (request, response) =>
  new Promise((resolve, reject) => {
    middleware(request, response, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });

const getIP = (request) => {
  const xff = request.headers["x-forwarded-for"];
  const ipA = xff ? xff.split(",")[0] : "127.0.0.1";
  const ipAB = xff ? xff.split(",")[0] : request.connection.remoteAddress;

  return request.ip || ipAB || request.headers["x-real-ip"];
};

export const getRateLimitMiddlewares = ({
  limit = 10,
  windowMs = 60 * 1000,
  delayAfter = Math.round(10 / 2),
  delayMs = 500,
} = {}) => [
  slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
  rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
];

const middlewares = getRateLimitMiddlewares();

async function applyRateLimit(request, response) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      .map((middleware) => middleware(request, response))
  );
}

export default applyRateLimit;
