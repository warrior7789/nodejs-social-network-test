const path = require("path");
const fs = require('fs');

exports.fetchCurrentURL = (req) => {

    //console.log("fetchCurrentURL req.protocol",req.protocol)
    return req.protocol + "://" + req.headers.host
    //return "https://" + req.headers.host
}


exports.fetchUserImageURL = (req,folder ,image) => {

    if (image && image != undefined && fs.existsSync('./public/upload/users/' + image)) {
        //file exists
        return this.fetchCurrentURL(req) + '/upload/users/'+ image
    } else {
        return this.fetchCurrentURL(req) + '/uploads/default/image-not-found.png'
    }
}

exports.fetchStatusURL = (req,image) => {

    if (image && image != undefined && fs.existsSync('./public/upload/status/' + image)) {
        //file exists
        return this.fetchCurrentURL(req) + '/upload/status/' + image
    } else {
        return this.fetchCurrentURL(req) + '/uploads/default/image-not-found.png'
    }
}

exports.getUserdetails = (req,user) =>{
    return {
        fullname : user.fullname,
        email : user.email,
        profilePicture :this.fetchUserImageURL(req,user._id,user.profilePicture),
    }
}

exports.getStatusdetails = (req,status) =>{   
    
    return {

        statusId : status._id,
        userId : status.user._id,
        username : status.user.fullname,
        created_at : status.createdAt,
        content : status.content,
        attachmenttype : status.attachmenttype,
        comments    : status.comments?status.comments:[],
        likes       : status?.likes?status?.likes:[],
        attachment :this.fetchStatusURL(req,status.attachment),
    }
}
exports.pagination = async (totalrecord, limit, skip) => {
    let page = Math.ceil((skip + 1) / limit);
    const pagination_ = {
        total: totalrecord,
        limit: limit,
        page: page,
        prevPage: -1,
        nextPage: -1,
        hasPrevPage: false,
        hasNextPage: false,
    }


    const totalPages = limit > 0 ? Math.ceil(totalrecord / limit) || 1 : null;
    pagination_.totalPages = totalPages;
    pagination_.pagingCounter = (page - 1) * limit + 1;

    // Set prev page
    if (page > 1) {
        pagination_.hasPrevPage = true;
        pagination_.prevPage = page - 1;
    } else if (page == 1 && skip !== 0) {
        pagination_.hasPrevPage = true;
        pagination_.prevPage = 1;
    }

    // Set next page
    if (page < totalPages) {
        pagination_.hasNextPage = true;
        pagination_.nextPage = page + 1;
    }

    if (limit == 0) {
        pagination_.limit = 0;
        pagination_.totalPages = 1;
        pagination_.page = 1;
        pagination_.pagingCounter = 1;
    }
    return pagination_
}


exports.getRandomUsers = async (allUsers, count) => {
    return [...Array(count)].map(() => {
        const randomIndex = Math.floor(Math.random() * allUsers.length);
        return allUsers[randomIndex];
    });
}