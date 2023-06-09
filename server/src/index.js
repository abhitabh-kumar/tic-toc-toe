import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
// import bcrypt from "bcrypt";
const app = express();
import dotenv from 'dotenv';
dotenv.config();

app.use(cors());
app.use(express.json());
const api_key = process.env.API_KEY;
const api_secret =process.env.API_SCERETKEY;
const serverClient =new StreamChat.getInstance(api_key, api_secret);
console.log(api_key);
console.log(api_secret);

app.get("/",(req,res)=>{
  res.send("hello");
})

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, userName,email, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = password;
    const token = serverClient.createToken(userId);
    res.json({ 
      token, 
      userId, 
      firstName, 
      lastName, 
      userName,
      email, 
      hashedPassword,
      mess:[{}]});
  } catch (error) {
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { users } = await serverClient.queryUsers({ email:email });
    if (users.length === 0) return res.json({ message: "User not found" });
    const token = serverClient.createToken(users[0].id);
    console.log(token);
    const passwordMatch = password==users[0].hashedPassword;
    if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        userName:users[0].userName,
        email,
        userId: users[0].id,
        mess:users[0].mess
      });
    }
  } catch (error) {
    res.json(error);
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is running on port 3001");
});
