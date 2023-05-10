const router = require('express').Router()

const { authenticateUser, authorizePermissions } = require('../middleware/authentication')

const { createProduct, deleteProduct, getAllProducts, updateProduct, getSingleProduct, uploadImage } = require('../controllers/productsController')
const {getReviewsSingleProduct}  =require('../controllers/reviewController')
router
    .route('/')
    .post([authenticateUser, authorizePermissions('admin')], createProduct)
    .get(getAllProducts)
router
    .post('/uploadImage', [authenticateUser, authorizePermissions('admin')],
        uploadImage)

router
    .route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
    .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)

router.route('/:id/reviews').get(getReviewsSingleProduct);


module.exports = router
