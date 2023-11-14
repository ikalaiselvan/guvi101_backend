const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
const { sendMail } = require("./sendMail");
dotenv.config();


async function InsertVerifyUser(name, email, password){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const token = generateToken(email);
      const userVerify = await verifyUser.findOne({ email: email });

      if(userVerify){
        await verifyUser.deleteOne({email: email});
      }
      
        const newUser = await verifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token,
        })
        // console.log(newUser);

        // const activationLink = `http://localhost:4000/signin/${token}`;
        const activationLink = `https://guvi101-backend.onrender.com/signin/${token}`;


        const content = `<h4>Hi, there</h4>
        <h5>Welcome to the app</h5>
        <p>Thank you for signing up. click on the below link to activate</p>
        <a href='${activationLink}'>click here</a>
        <p>Regards</p>
        <p>Team</p>`

        const saving = await newUser.save();
        console.log('saving : ', saving);
        sendMail(email, "VerifyUser", content);

    }catch(e){
        console.log(e)
    }
}

function generateToken(email){
    const token = jwt.sign(email, process.env.signup_secret_token);
    return token;
}

async function InsertSignUpUser(token){
    try {
      const userVerify = await verifyUser.findOne({ token: token });
      console.log("verify user : ",userVerify)
      if (userVerify) {
        const newUser = new User({
          name: userVerify.name,
          email: userVerify.email,
          password: userVerify.password,
          forgotPassword: {},
        });

        await newUser.save();
        await verifyUser.deleteOne({ token: token });

        const content = `<h4>Registration successful</h4>
        <h5>Welcome to the app</h5>
        <p>You are successfully registered ...</p>
        <p>Regards</p>
        <p>Team</p>`;

        await sendMail(newUser.email, "Registration successful", content);
        return `<h4>Hi, there</h4>
        <h5>Welcome to the app</h5>
        <p>You are successfully registered ...</p>
        <p>Regards</p>
        <p>Team</p>`;
      }

      return `<h4>Registration failed</h4>
        <p>Link expired ...</p>
        <p>Regards</p>
        <p>Team</p>`;

    } catch (e) {
        console.log(e);
        return `<html>
        <body>
        <h4>Registration failed</h4>
        <p>Unexpected error happened ...</p>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`
    }
}

module.exports = { InsertVerifyUser, InsertSignUpUser };