const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

router.post('/', listingController.createListing);
router.get('/', listingController.getListings);

module.exports = router;
