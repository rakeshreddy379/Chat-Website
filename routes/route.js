import { signup, login } from '../components/index.js';
import {checkUserExists} from '../middlewaares/userExists.js';
import { getTokens } from '../components/getTokens.js';
import {getNewFriends} from '../components/makefriends.js'
import { makeFriendRequest } from '../components/friendrequest.js';
import { getAllFriends } from '../components/getallfriends.js';
import { getChat } from '../components/getChat.js';
import { forgetpass } from '../components/forgetpass.js';
import { otpverify } from '../components/otpverify.js';
import { changepassword } from '../components/changepass.js';
import { profileChange } from '../components/index.js';
import multer from 'multer'
import express from 'express';
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        req.userprofile=file
        console.log(req.userprofile)
        const fileName=`${Date.now()}-${file.originalname}`
        req.fileName=fileName
        cb(null, fileName);
    }
});
const upload = multer({ storage });

// Uncomment these lines to use the signup and login routes
router.route('/signup').post(checkUserExists,upload.single('userprofile'),signup);
router.route('/profilechange').post(upload.single('image'),profileChange);
router.route('/login').post(login);
router.route('/get-tokens').post(getTokens)
router.route('/addfriends').post(getNewFriends)
router.route('/sendfriendrequest').post(makeFriendRequest)
router.route('/getallfriends').post(getAllFriends)
router.route('/getchat').post(getChat)
router.route('/forgetpass').post(forgetpass)
router.route('/otpverify').post(otpverify)
router.route('/changepassword').post(changepassword)

export  { router };
