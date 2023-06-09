const userController = require('../controllers/userController')
const router = require('express').Router()
const {authenticateUser,authorizePermissions} = require('../middleware/authentication')
router.route('/').get(authenticateUser,authorizePermissions('admin'),userController.getAllUsers)
router.route('/showMe').get(authenticateUser,userController.showCurrentUser)
router.route('/updateUser').patch(authenticateUser,userController.updateUser)
router.route('/updateUserPassword').patch(authenticateUser,userController.updateUserPassword)
router.route('/:id').get(authenticateUser,userController.getSingleUser)

module.exports= router
