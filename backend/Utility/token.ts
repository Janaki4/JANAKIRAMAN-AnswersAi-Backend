import jwt from 'jsonwebtoken';

function createToken(user: any) {
  const secret = (process.env.JWT_KEY || "")?.replace?.(/\\n/gi, '\n');
  const claims = {
    user
  };

  const tokenExpiry: number = Number(process.env?.TOKEN_EXPIRY || 300000000);
  const refreshTokenExpiry: number = Number(process.env?.TOKEN_EXPIRY || 50000000);
  const token = jwt.sign(claims, secret, {
    algorithm: "HS512",
    expiresIn: tokenExpiry,
  });

  const refreshToken = jwt.sign(claims, secret, {
    algorithm: "HS512",
    expiresIn: refreshTokenExpiry,
  });
  return {
    accessToken: token,
    refreshToken,
    accessTokenExpiresAt: Date.now() + (tokenExpiry * 1000),
    refreshTokenExpiresAt: Date.now() + (refreshTokenExpiry * 1000),
  };
}

function validateToken(req: any, token: any) {
  try {
    const secret = (process.env.JWT_PUBLIC_KEY || "")?.replace?.(/\\n/gi, '\n');
    req.userDetails = jwt.verify(token, secret, {
      algorithms: ["HS512"]
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// function createSessionToken(details){
//     try {
//         const secret = process.env.JWT_PUBLIC_KEY.replaceAll('\\n', '\n');
//         const tokenExpiry = process.env?.TOKEN_EXPIRY || 30000;

//         const refreshToken = jwt.sign(details,secret,{
//             algorithm: "HS512",
//             expiresIn: tokenExpiry,
//         })
//         return refreshToken
//     } catch (error) {
//         console.log(error);
//         throw new Error("Session token creation error")
//     }
// }

export {
  createToken,
  validateToken
}
