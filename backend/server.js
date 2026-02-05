require("dotenv").config();
const databaseConnection = require("./configuration/db");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const authRouter = require("./modules/auth/routers/auth.routers");
const profileRouters = require("./modules/profile/routers/profile.routes");
const postRouter = require("./modules/posts/Routes/Post.Routes");
const commentRouter = require("./modules/posts/Routes/comment.routes");
// const paymentRouter = require("./modules/payment/routers/payment.routes");

const app = express();
const PORT = process.env.PORT || 8000;
app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());


app.get("/api/health", (_, res) => {
  res.status(200).json({
    status: "OK",
    message: "Rockranger API is running",
  });
});

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Data is fetched from the backend perfectly",
  });
});

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouters);
app.use('/api/post', postRouter);
app.use("/api/comments", commentRouter);
// app.use('/api/payment', paymentRouter);


const startServer = async () => {
  try {
    await databaseConnection(process.env.MONGODB_URL);

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down...");
      server.close(() => process.exit(0));
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
