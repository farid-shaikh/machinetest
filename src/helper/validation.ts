const {check,body} = require('express-validator');


const signUpValidation = () => {
    return [
        check('email', "Please provide a valid email address").isEmail().trim(),
        check('password', 'Please enter at least 6 characters').isLength({ min: 6}).trim(),
        check('name','More than one letter required').isLength({ min: 2}).matches(/^[A-Z a-z\s]+$/).withMessage('Please enter only alphabets'),
        check('mobile_no', 'Please provide a valid mobile no').isLength({ min: 10})
    ]
}


const loginValidation = () => {
  return [
      check('email', "Please provide a valid email address").isEmail().trim(),
      check('password', 'Please enter at least 6 characters').isLength({ min: 6}).trim()
  ]
}


module.exports = {
    signUpValidation,
    loginValidation
}

