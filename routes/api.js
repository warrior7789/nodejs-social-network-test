// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const ValidationMiddleware = require('../middleware/validationMiddleware');
const checkAuth = require('../middleware/auth');
const userController = require('../controllers/userController');
const statusController = require('../controllers/statusController');



/*
/**
 * @swagger
 * /api/set-dummy-data:
 *   get:
 *     summary: setdummydata
 *     description: setdummydata
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
router.get('/set-dummy-data', userController.seedDummydata);
*/

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Signup 
 *     description: Signup with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               fullname:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signup successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/signup', ValidationMiddleware.validateSignup(),ValidationMiddleware.validate, userController.signup);
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login 
 *     description: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Succesfully
 *       400:
 *         description: Invalid request body
 */
router.post('/login', ValidationMiddleware.validateLogin(),ValidationMiddleware.validate, userController.login);


/**
 * @swagger
 * /api/get-profile:
 *   get:
 *     summary: Get private data (requires authentication)
 *     description: Retrieve private data that requires authentication with a Bearer token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
 */
router.get('/get-profile', checkAuth,userController.getProfile);




/**
 * @swagger
 * /api/update-profile:
 *   post:
 *     summary: Update profile (requires authentication)
 *     description: Upload a file using FormData along with a username
 *     security:
 *       - bearerAuth: []
 *     content:
 *       - multipart/form-data
 *       - application/x-www-form-urlencoded
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: profilepic
 *         type: file
 *         description: The file to upload
 *       - in: formData
 *         name: fullname
 *         type: string
 *         description: Contest
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid request body or username missing
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
 */
router.post('/update-profile', checkAuth,userController.updateProfile);


/**
 * @swagger
 * /api/follow:
 *   post:
 *     summary: Follow User 
 *     description: follow the user 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string           
 *     responses:
 *       200:
 *         description: successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/follow', checkAuth,userController.followUser);

/**
 * @swagger
 * /api/unfollow:
 *   post:
 *     summary: Unfollow user 
 *     description: Unfollow the user 
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string           
 *     responses:
 *       200:
 *         description: successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/unfollow', checkAuth,userController.unFollowUser);


/**
 * @swagger
 * /api/upload-status:
 *   post:
 *     summary: Add new status
 *     description: Add new status
 *     security:
 *       - bearerAuth: []
 *     content:
 *       - multipart/form-data
 *       - application/x-www-form-urlencoded
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: attachment
 *         type: file
 *         description: The file to upload
 *         required: true     
 *       - in: formData
 *         name: contest
 *         type: string
 *         description: Contest
 *         required: true     
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid request body or username missing
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
 */
router.post('/upload-status', checkAuth,statusController.addStatuses);

/**
 * @swagger
 * /api/get-timeline:
 *   post:
 *     summary: Get timeline 
 *     description: Get timeline
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: string
 *               page:
 *                 type: string              
 *     responses:
 *       200:
 *         description: Signup successfully
 *       400:
 *         description: Invalid request body
 */
router.get('/get-timeline', checkAuth,statusController.getTimeline);


/**
 * @swagger
 * /api/get-timeline:
 *   post:
 *     summary: Get timeline 
 *     description: Get timeline
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusId:
 *                 type: string
 *               text:
 *                 type: string              
 *     responses:
 *       200:
 *         description: Signup successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/add-comment', checkAuth,ValidationMiddleware.addComment(),ValidationMiddleware.validate,statusController.addComment);



/**
 * @swagger
 * /api/like-status:
 *   post:
 *     summary: Get timeline 
 *     description: Get timeline
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusId:
 *                 type: string          
 *     responses:
 *       200:
 *         description: Signup successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/like-status', checkAuth,ValidationMiddleware.likeStatus(),ValidationMiddleware.validate,statusController.likeStatus);

/**
 * @swagger
 * /api/unlike-status:
 *   post:
 *     summary: Get timeline 
 *     description: Get timeline
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusId:
 *                 type: string          
 *     responses:
 *       200:
 *         description: Signup successfully
 *       400:
 *         description: Invalid request body
 */
router.post('/unlike-status', checkAuth,ValidationMiddleware.likeStatus(),ValidationMiddleware.validate,statusController.unLikeStatus);
module.exports = router;
