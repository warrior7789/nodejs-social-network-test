const UserModel = require.main.require('./models/user'); 
const StatusModel = require.main.require('./models/status'); 
const common = require.main.require('./helper/common'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require('fs');
const absolutePath = path.resolve("./public/");



/* Signup API */
exports.signup = async (req, res, next) => {
    try {
        const {
            fullname,
            email,
            password
        } = req.body;
        
        let user = await UserModel.create({
            fullname,
            email,
            password
        })

        res.status(200).send({
            data: {
                fullname : user.fullname,
                eamil:user.email
            },
            message: "Signup successful.",
            status: 200
        })
    } catch (e) {
        //console.log(e)
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
       
    }
};

// Login
exports.login = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    try {
        const user = await UserModel.findOne({
            email
        });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }
        // If the password is valid, generate a JWT token
        const token = await jwt.sign({
            userId: user._id
        }, secretkeypassword, {
            expiresIn: '12h'
        });
        console.log("token",token)
        // Return the token in the response
        res.status(200).send({
            data: {
                fullname : user.fullname,
                eamil:user.email,
                token:token
            },
            message: "Login successful.",            
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// get profile
exports.getProfile = async (req, res, next) => {
    try {
        let user  = req.user        
        res.status(200).send({
            data: await common.getUserdetails(req,user),
            message: "successful."
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Update user data route

exports.updateProfile = async (req, res, next) => {
    const userId = req.user._id; 
    const {
        fullname
    } = req.body;
    try {
        
        const user = await UserModel.findById(userId);        
        user.fullname = fullname || user.fullname;
        // Save the updated user data
        if (req.files && req.files.profilepic !== "undefined") {
            console.log("file upload ")
            let profilepic = req.files.profilepic; 
            console.log("profilepic",profilepic)
            const extensionName = path.extname(profilepic.name);
            const allowedExtension = ['.png','.jpg','.jpeg'];
            const containsMarcus = allowedExtension.includes(extensionName) 
            if(containsMarcus){
                var timestamp = new Date().getTime();   
                filename = user._id+extensionName;   
                user.profilePicture =   filename; 
                /*if(!fs.existsSync(absolutePath +'/upload/users')){
                    fs.mkdirSync(absolutePath +'/upload/users');
                }
                if(!fs.existsSync(absolutePath +'/upload/users/'+user._id)){
                    fs.mkdirSync(absolutePath +'/upload/users/'+user._id);
                }*/
                await profilepic.mv(absolutePath+'/upload/users/'+filename, function(err) {
                    if (err){  
                        return res.status(400).send({
                            data: {},
                            message: "Could not upload image. Please try again!",
                            status: 0
                        }) 
                    }     
                });
            }else{
                return res.status(400).send({
                    data: {},
                    message: "Invalid file type!"
                })
            } 
        } 
        await user.save();
        res.status(200).send({
            data: await common.getUserdetails(req,user),
            message: "successful."
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};


// Follow user route
exports.followUser = async (req, res, next) => {
    const followerId = req.user._id; 
    const { userId } = req.body;
    try {
        if(userId== followerId){
            return res.status(404).json({
                data: {},
                message: "You cannot follow yourself.",
            });
        }
        const follower = await UserModel.findById(followerId);
        const following = await UserModel.findById(userId);
        if (!follower || !following) {
            return res.status(404).json({
                data: {},
                message: "User not found.",
            });
        }

        if (!follower.followings.includes(userId)) {
            follower.followings.push(userId);
            following.followers.push(followerId);

            await follower.save();
            await following.save();         
            res.status(200).send({
                data: {},
                message: "User followed successfully.",
            })
        }
        else {
            res.status(400).json({
                data: {},
                message: 'User is already being followed'
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Unfollow user route
exports.unFollowUser = async (req, res, next) => {
    const followerId = req.user._id;
    const { userId } = req.body;
    try {
        const follower = await UserModel.findById(followerId);
        const following = await UserModel.findById(userId);
        if (!follower || !following) {
            return res.status(404).json({
                 data: {},
                message: 'User not found'
            });
        }
        if (follower.followings.includes(userId)) {
            follower.followings = follower.followings.filter(id => id.toString() !== userId.toString());
            following.followers = following.followers.filter(id => id.toString() !== followerId.toString());
            await follower.save();
            await following.save();
            res.status(200).send({
                data: {},
                message: "User unfollowed successfully.",
            })
        }
        else {
            res.status(400).json({
                data: {},
                message: 'User is not being followed'
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};


async function createUsers() {
    const users = [];
    for (let i = 1; i <= 1000; i++) {
        const newUser = new User({
            fullname: `User ${i}`,
            email: `user${i}@example.com`,
            password: '123456', // You might want to generate random passwords
        });
        users.push(newUser);
    }
    try {
        const createdUsers = await User.insertMany(users);
        console.log(`${createdUsers.length} users created successfully.`);
    }catch (error) {
        console.error('Error creating users:', error);
    }
    finally {
        mongoose.connection.close();
    }
}




exports.seedDummydata = async (req, res, next) => {
    const users = [];
    
    for (let i = 1; i <= 1000; i++) {
        const newUser = new UserModel({
            fullname: `User ${i}`,
            email: `user${i}@example.com`,
            password:  await bcrypt.hash("123456", 8)
        });
        users.push(newUser);
    }
    try {
        const createdUsers = await UserModel.insertMany(users);
        console.log(`${createdUsers.length} users created successfully.`);


        const allUsers = await UserModel.find();

        for (const user of allUsers) {
            const randomFollowings = await common.getRandomUsers(allUsers, 5);
            const randomFollowers = await common.getRandomUsers(allUsers, 5);

            user.followings = randomFollowings.map(u => u._id);
            user.followers = randomFollowers.map(u => u._id);
            await user.save();
        }
        console.log('Follow relationships established successfully.');


        

        for (const user of allUsers) {
            const statuses = [];

            for (let i = 1; i <= 5; i++) {
                const newStatus = new StatusModel({
                    user: user._id,
                    content: `Status ${i} for ${user.fullname}`,
                    attachment: "65998da3b4163da95dc3d13d.png",
                    attachmenttype: ".png",
                });
                statuses.push(newStatus);
            }
            await StatusModel.insertMany(statuses);
        }
        console.log('Statuses created successfully.');

        
        const allStatuses = await StatusModel.find().populate("user");
        for (const status of allStatuses) {
            const comments = [];
            const likes = [];
            for (let i = 1; i <= 5; i++) {
                const _randomUser = await common.getRandomUsers(allUsers, 1);
                let randomUser = _randomUser[0]
                console.log("randomUser",randomUser._id)
                const newComment = {
                    user: randomUser._id,
                    text: `Comment ${i} on ${status.user.fullname}'s status`,
                };
                comments.push(newComment);
                const newLike = {
                    user: randomUser._id,
                };
                likes.push(newLike);
            }
            status.comments = comments;
            status.likes = likes;
            await status.save();
        }
        console.log('Comments and likes created successfully.');


        res.status(200).send({
            data: {},
            message: "successfull insert dummydata."
        })

    }catch (error) {
        console.error('Error creating users:', error);
    }    
}
