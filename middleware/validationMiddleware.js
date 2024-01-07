const { validationResult ,check } = require('express-validator');
const UserModel = require.main.require('./models/user'); 
const validateName = (value) => {
    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(value)) {
        throw new Error('Name must not include special or numeric characters');
    }
    return true;
};

const validateEmail = async (value) => {
    const user = await UserModel.findOne({email:value})
    if (user) {
        throw new Error('Email Already exist');
    }
    return true;
};
class ValidationMiddleware { 
	static validate(req, res, next) {
	    const errors = validationResult(req);
	    if (!errors.isEmpty()) {
	        let message = []
	        let i=0
	        for(let error of errors.array()){
	            message[i++] =error.msg
	        }
	        return res.status(400).send({
	            data: {},
	            message: message.join(', '),
	        })
	        //return res.status(422).json({ errors: errors.array() });
	    }
	    next();
	}
	static validateSignup() {
	    return [
	        check('fullname').notEmpty().withMessage('Fullname is required').isLength({ min:2, max: 20 }).withMessage('Name must be at least 6-20 characters long').custom(validateName),
	        check('email').isEmail().withMessage('Invalid email').custom(validateEmail),
	        check('password')
	            .isLength({ min: 6 ,max: 30})
	            .withMessage('Password must be at least 6-30 characters long'),
	    ];
	}

	static validateLogin() {
	    return [
	        check('email').notEmpty().withMessage('Email is required'),
	        check('password').notEmpty().withMessage('Password is required'),
	    ];
	}

	static addComment() {
	    return [
	        check('text').notEmpty().withMessage('Comment is required'),
	        check('statusId').notEmpty().withMessage('statusId is required'),
	    ];
	}
	static likeStatus() {
	    return [	        
	        check('statusId').notEmpty().withMessage('statusId is required'),
	    ];
	}
}
module.exports = ValidationMiddleware;