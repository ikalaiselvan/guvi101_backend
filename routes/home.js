const express = require("express");
const { AuthorizeUser } = require("../controllers/login");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const auth_token = await req.headers.authorization;
    console.log("auth_token : ", auth_token);
    const loginCredentials = await AuthorizeUser(auth_token);
    console.log("login credentials : ", loginCredentials.status)

    // if (loginCredentials === false) {
    //   res.status(200).send("Invalid Token");
    // } else {
    //   res.json(loginCredentials);
    // }

    if (loginCredentials.status === false) {
      res.status(200).send("Invalid Token");
        console.log("login false : ");

    } else {
        console.log("login cred : ");
      res.send(loginCredentials);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send("Server Busy");
  }
});

module.exports = router;
