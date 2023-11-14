const express = require("express");
const { checkUser } = require("../controllers/login");
const { InsertVerifyUser, InsertSignUpUser } = require("../controllers/signin");
const router = express.Router();

router.get("/:token", async (req, res) => {
    try{
        const response = await InsertSignUpUser(req.params.token);
        res.status(200).send(response);

    }catch(e){
        console.log(e);
        res.status(500).send(`
          <html>
            <body>
              <h4>Registration failed</h4>
              <p>Link expired ...</p>
              <p>Regards</p>
              <p>Team</p>
            </body>
          </html>`
        );
    }
});

router.post("/verify", async (req, res) => {
  try {
    const { name, email, password } = await req.body;
    // console.log(name, email, password);
    // res.send({name: name, email: email, password: password})
    const registerCredentials = await checkUser(email);
    console.log("registerCredentials: ", registerCredentials);

    if (registerCredentials === false) {
      await InsertVerifyUser(name, email, password);
      res.status(200).send(true);
    } else if (registerCredentials === true) {
      res.status(200).send(false);
    } else if (registerCredentials === "Server Busy") {
      res.status(500).send("Server busy");
    }
  } catch (e) {}
});

module.exports = router;
