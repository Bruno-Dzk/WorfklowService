import { CognitoJwtVerifier } from "aws-jwt-verify";

const APP_CLIENT_ID = "3icm227trvfbhbsar1vhtfe51p";
const USER_POOL_ID = "eu-central-1_FSieqcZdy";

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "id",
  clientId: APP_CLIENT_ID,
});

// Middleware to verify the JWT token
export async function authorizeJwt(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const payload = await verifier.verify(token);
    res.locals.organizations = payload["cognito:groups"];
    return next();
  } catch {
    return res.sendStatus(401);
  }
}
