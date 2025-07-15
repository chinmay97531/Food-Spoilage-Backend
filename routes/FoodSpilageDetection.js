import express from "express";
import { UserModel } from "../db.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resend } from 'resend';

import { JWT_SECRET, RESEND_API_KEY } from "../config.js";

const app = express();

app.post("/signup", async (req, res) => {
  try {
    const requiredBody = z.object({
      username: z.string().min(2).max(50),
      password: z.string().min(3).max(50),
      email: z.string().min(3).max(100).email(),
    });
    const parsedDatawithSuccess = requiredBody.safeParse(req.body);

    if (!parsedDatawithSuccess.success) {
      console.log("Validation Errors:", parsedDatawithSuccess.error.errors);
      res.status(400).json({
        message: "Invalid Data",
        errors: parsedDatawithSuccess.error.errors,
      });
      return;
    }

    const { username, password, email } = parsedDatawithSuccess.data;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 5);

      const newUser = await UserModel.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        {
          id: newUser._id.toString(),
        },
        JWT_SECRET
      );

      return res.status(201).json({
        token: token,
      });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({
    email: email,
  });

  if (!user) {
    res.status(403).json({
      message: "User not found",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
});


export default app;