const User = require("../models/User");
const bcript = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../redis");
const dotenv = require("dotenv");
dotenv.config();

async function checkUser(email) {
  try {
    const user = await User.findOne({ email: email });
    console.log("collection login.js page : ", user);
    if (user) {
      return true;
    }
    return false;
  } catch (e) {
    return "Server Busy";
  }
}

async function AuthenticateUser(email, password) {
  try {
    const userCheck = await User.findOne({ email: email });
    const validPassword = await bcript.compare(password, userCheck.password);
    console.log("validPassword :", validPassword);
    if (validPassword) {
      const token = jwt.sign({ email }, process.env.signin_secret_password);

      const response = {
        id: userCheck._id,
        name: userCheck.name,
        email: userCheck.email,
        token: token,
        status: true,
      };
      await client.set(`key-${email}`, JSON.stringify(response));

      await User.findOneAndUpdate(
        { email: userCheck.email },
        { $set: { token: token } },
        { new: true }
      );

      return response;
    }
    return "Invalid User name and Password";
  } catch (e) {
    console.log(e);
    return "Server Busy";
  }
}

async function AuthorizeUser(token) {
  try {
    const decodedToken = await jwt.verify(
      token,
      process.env.signin_secret_password
    );

    if (decodedToken) {
      const email = decodedToken.email;
      const auth = await client.get(`key-${email}`);
      // console.log("one", JSON.parse(auth));
      // console.log("two", await User.findOne({ email: email }));
      if (auth) {
        const data = JSON.parse(auth);
        return data;
      } else {
        const data = await User.findOne({ email: email });
        return data;
      }
    }
    return false;
  } catch (e) {
    console.log(e);
  }
}

module.exports = { checkUser, AuthenticateUser, AuthorizeUser };
