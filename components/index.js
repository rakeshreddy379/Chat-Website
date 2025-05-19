import { User } from '../model/index.js'
import { setUid, getUid } from '../services/auth.js'
import { Userdetails } from '../model/userdetails.js';
import { chattingCollection } from '../model/chattingdocument.js';
import cookieParser from 'cookie-parser';
import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
const app = express()
app.use(cookieParser())
app.use(cors())
const saltRounds = 10;
async function signup(req, res, next) {
    console.log('req is', req.file)
    const { username, email, password } = req.body
    const userProfile = req.fileName
    console.log(userProfile)
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
        } else {
            console.log('Hashed password:', hash);
            const creation = await Userdetails.create({
                userProfile: `uploads/${userProfile}`,
                userName: username,
                email: email,
                hashedPassword: hash
            })
            const result = await User.create({
                userProfile: `uploads/${userProfile}`,
                userName: username,
                email: email,

                friends: [

                    username

                ]
            })
            if (result) {
                console.log('success')
                const token = await setUid(result)
                try {
                    res.cookie('usertoken', token, { httpOnly: false, maxAge: 3600000 }); // Cookie will expire in 1 hour);
                }
                catch (error) {
                    next(error)
                }
                res.status(202).json({
                    message: 'Your account has been registered successfully',
                    username: username, userprofile: `uploads/${userProfile}`
                })
            }
            else {
                res.status(500).json({ message: 'something is wrong' })
            }
            // Store hash in your database
        }
    });
}
async function login(req, res, next) {
    const { username, password } = req.body
    const result = await Userdetails.findOne({ userName: username })
    if (!result) { res.status(404).json({ message: 'user not found' }) }
    else {
        bcrypt.compare(password, result.hashedPassword, async (err, data) => {
            if (err) {
                console.error('Error comparing passwords:', err);
            } else if (data) {
                console.log('Passwords match!');
                const token = await setUid(result)
                const userdetails = await User.findOne({ userName: username })
                console.log(token)
                try {
                    res.cookie('usertoken', token, { httpOnly: false }); // Cookie will expire in 1 hour);
                console.log(username)
                console.log(userdetails)
                // Set a cookie with a 1-hour expirationcookie
                res.status(200).json({ message: 'you are logged in', username: username, userprofile: userdetails.userProfile })
              } catch (error) {
                    next(error)
                } // Proceed with login
            } else {
                console.log('Passwords do not match.');
                if (req.cookies['usertoken']) res.clearCookie('usertoken')
                else console.log('hi')
                res.status(404).json({ message: 'password is incorrect' })
                // Handle invalid login
            }
        });
    }
}
async function profileChange(req, res, next) {
    const { newname, newemail } = req.body
    const userProfile = `uploads/${req.fileName}`
    try {
        const decoded = getUid(req.cookies.usertoken)
        console.log(decoded)
        const result = await Userdetails.updateOne({ userName: decoded.username },
            {
                $set: {
                    userName: newname,
                    email: newemail,
                    userProfile: userProfile,
                }
            }
        )
        const r = await User.updateOne({ userName: decoded.username },
            {
                $set: {
                    userName: newname,
                    email: newemail,
                    userProfile: userProfile,
                }
            }
        )
        const result2 = await User.updateMany({ friends: decoded.username }, {
            $set: { 'friends.$[elem]': newname }
        }, {
            arrayFilters: [{ elem: decoded.username }]
        }
        )
        const result1 = await chattingCollection.updateMany({
            $or: [
                { 'personOne.name': decoded.username },
                { 'personTwo.name': decoded.username }
            ]
        }, [{
            $set: {
                'personOne.name': {
                    $cond: [{ $eq: ['$personOne.name', decoded.username] }, newname, '$personOne.name']
                },
                'personTwo.name': {
                    $cond: [{ $eq: ['$personTwo.name', decoded.username] }, newname, '$personTwo.name']
                },
            }
        }]
        );
        const result3 = await User.updateOne({ userName: decoded.username },
            { $set: { userName: newname } }
        )
        if (result) {
            const data = { userName: newname, email: newemail }
            const token = await setUid(data)
            res.cookie('usertoken', token, { httpOnly: true })
            res.status(200).json({ msg: 'done', username: newname, email: newemail, userprofile: userProfile})
        }
    }
    catch (err) {
        res.status(404).json({ msg: 'something is missing' })
        next(err)
    }
}
export { signup, login, profileChange }