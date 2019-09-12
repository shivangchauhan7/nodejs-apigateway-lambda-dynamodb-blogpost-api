const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const validateBody = body => {
  let isValid = true;
  try {
    Object.values(body).forEach(el => {
      if (!el) isValid = false;
    });
  } catch (e) {
    isValid = false;
  }
  return isValid;
};

const sendResponse = (statusCode, message) => {
  const response = {
    statusCode: statusCode,
    body: message,
    headers: { "Content-Type": "text/plain" }
  };
  return response;
};

const signJwt = payload => {
  try {
    return new Promise((resolve, reject) => {
      const token = jwt.sign(payload, "secret", { expiresIn: "24h" });
      if (token) {
        resolve(token);
      } else {
        reject(false);
      }
    });
  } catch (e) {
    reject(false);
  }
};

createHash = password => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(
        password === "" ? undefined : password,
        10
      );
      resolve(hashedPassword);
    } catch (e) {
      reject(false);
    }
  });
};

const checkHash = (password, hash) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPassword = await bcrypt.compare(password, hash);
      resolve(checkPassword);
    } catch (e) {
      reject(false);
    }
  });
};

const verifyJwt = async token => {
  return new Promise((resolve, reject) => {
    try {
      const tokenData = jwt.verify(token, "secret");
      resolve(tokenData);
    } catch (e) {
      reject(false);
    }
  });
};

const generatePolicy = (tokenData, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = tokenData;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports = {
  validateBody,
  sendResponse,
  signJwt,
  createHash,
  checkHash,
  verifyJwt,
  generatePolicy
};
