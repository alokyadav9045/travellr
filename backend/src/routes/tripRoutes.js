const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');
const { uploadImages } = require('../middleware/upload');

router.get('/', tripController.list);
router.get('/:slug', tripController.get);
router.post('/', auth(), tripController.create);
router.put('/:id', auth(), tripController.update);
router.delete('/:id', auth(), tripController.delete);
router.post('/:id/images', auth(), uploadImages.array('images', 10), tripController.uploadImages);
router.delete('/:id/images/:imageId', auth(), tripController.deleteImage);
router.patch('/:id/publish', auth(), tripController.publishTrip);
router.patch('/:id/unpublish', auth(), tripController.unpublishTrip);
router.get('/:id/availability', tripController.checkAvailability);
router.get('/:id/similar', tripController.getSimilarTrips);
router.get('/:id/reviews', tripController.getTripReviews);

module.exports = router;
