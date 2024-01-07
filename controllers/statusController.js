const UserModel = require.main.require('./models/user'); 
const StatusModel = require.main.require('./models/status'); 
const common = require.main.require('./helper/common'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require('fs');
const absolutePath = path.resolve("./public/");
const mongoose = require('mongoose');

exports.addStatuses = async (req, res, next) => {
    const userId = req.user._id; 
    const { content } = req.body;
    try {
        // Create a new status
        let newStatus = new StatusModel
        newStatus.user = userId
        if(!content && !req.files){
            return res.status(404).json({
                data : {},
                message: 'Atlest one field is required'
            });

        }
        if(content)
            newStatus.content=content
        

        if (req.files && req.files.attachment !== "undefined") {
            // Validate the file type           
            let attachment = req.files.attachment; 
            const extensionName = path.extname(attachment.name);
            const allowedExtension = ['.png','.jpg','.jpeg','.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv'];
            const containsMarcus = allowedExtension.includes(extensionName) 
            if(containsMarcus) {
                var timestamp = new Date().getTime();   
                filename = newStatus._id+extensionName;   
                newStatus.attachment       =   filename; 
                newStatus.attachmenttype   =   extensionName; 
                if(!fs.existsSync(absolutePath +'/upload/status')){
                    fs.mkdirSync(absolutePath +'/upload/status');
                }                
                await attachment.mv(absolutePath+'/upload/status/'+filename, function(err) {
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
        await newStatus.save()
        const user = await UserModel.findByIdAndUpdate(userId, {
            $push: {
                statuses: newStatus._id
            }
        }, {
            new: true
        });
        res.status(200).send({
            data: common.getStatusdetails(req,newStatus),
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

exports.getTimeline = async (req, res, next) => {
    const user = req.user;
    const { page = 1, limit = 10 } = req.query;
    try {
        const followingsIds = user.followings.map(following => following._id);

        let  skip =  (page - 1) * limit
        let posts = await StatusModel.find({
            user: {
                $in: [user._id,...followingsIds]
            }
        })
       .populate('user',"fullname")
       .populate('comments.user',"fullname")
       .populate('likes.user',"fullname")
       .sort({createdAt: -1})
       .skip(skip)
       .limit(limit)
    
        let totalrecord  = await StatusModel.find({
            user: {
                $in: [user._id,...followingsIds]
            }
        }).countDocuments()
             
        let data = []
        let statuses = []
       
        if(posts){            
            for(let status of posts){
                statuses.push(await common.getStatusdetails(req,status))
            }
            res.status(200).send({
                data: {
                    status : statuses,
                    pagination : await common.pagination(totalrecord, limit, skip)
                },
                message: "successful."
            })
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Add a comment to a status route
exports.addComment = async (req, res, next) => {
    const userId = req.user._id;
    const { statusId ,text} = req.body;   
   
    try {

        const status = await StatusModel.findById(statusId);
        if (!status) {
            return res.status(400).json({ data :{}, message: 'Status not found' })
        }
        const _status = await StatusModel.findByIdAndUpdate(
            statusId, {
                $push: {
                    comments: {
                        user: userId,
                        text
                    }
                }
            }, {
                new: true
            },
        );
        res.status(200).send({
            data: await common.getStatusdetails(req,_status),
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


exports.likeStatus = async (req, res, next) => {
    const userId = req.user._id;
    const { statusId } = req.body;
    try {
        const status = await StatusModel.findById(statusId);
        if (!status) {
            return res.status(400).json({ data :{}, message: 'Status not found' })
        }
        const hasLiked = status.likes.some(like => like.user.equals(userId));  
        if (hasLiked) {
             return res.status(400).json({ data :{}, message: 'Already liked the status' })
        }
        const updatedStatus  = await StatusModel.findByIdAndUpdate(
            statusId, {
                $push: {
                    likes: {
                        user: userId
                    }
                }
            }, {
                new: true
            },
        );
        res.status(200).send({
            data: await common.getStatusdetails(req,updatedStatus ),
            message: "Liked successfully."
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};
exports.unLikeStatus = async (req, res, next) => {
    const userId = req.user._id;
    const { statusId } = req.body;
    try {

        const status = await StatusModel.findById(statusId);
        if (!status) {
            return res.status(400).json({ data :{}, message: 'Status not found' })
        }
        
        const hasLiked = status.likes.some(like => like.user.equals(userId));        
        if (hasLiked) {
            const updatedStatus  = await StatusModel.findByIdAndUpdate(
                statusId, {
                    $pull: {
                        likes: {
                            user: userId
                        }
                    }
                }, {
                    new: true
                },
            );
            res.status(200).send({
                data: await common.getStatusdetails(req,updatedStatus ),
                message: "Unliked successfully."
            })
        }else{
            res.status(400).json({data :{}, message: 'You has not liked the status' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};