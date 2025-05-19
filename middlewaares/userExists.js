import  {User} from '../model/index.js'// Replace with your user model

const checkUserExists = async (req, res, next) => {
    try {
        const { username } = req.body;
        console.log(username) // Assuming you're using email to check for the user
        const user = await User.findOne({ userName:username });
console.log(user)
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        next(); // User does not exist, proceed to the next middleware/route handler
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export  {checkUserExists}
