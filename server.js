import express from 'express';
import { router } from './routes/route.js';
import multer from 'multer'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path'
import cors from 'cors'
import {fileURLToPath } from 'url'
import { setupSocket } from './socket.js';
import http from 'http'
const app = express();
const port = 30002;
const server=http.createServer(app)
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to database');
})
.catch((error) => {
    console.error('Failed to connect to database:', error);
});
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
setupSocket(server)
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(404).json({ error: err.message });
  });
app.use(cookieParser())
// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/getcookies',(req,res)=>{
console.log(req.cookies)
})
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get('/home',(req,res)=>{
    console.log
res.end('hey there')
})
 app.use('/', router);
server.listen(port,(err) => {
    if (err) {
        console.log('wrong');
    }else {
        console.log(`Running on port ${port}`);
    }
});
