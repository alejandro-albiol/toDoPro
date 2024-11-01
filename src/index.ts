import express from "express";
import { app, PORT, publicPath } from "./configuration/config.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";

app.use(express.urlencoded({extended: true}));

app.use(express.static(publicPath));


app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
})

app.use("/", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
