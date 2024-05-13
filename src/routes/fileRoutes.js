const express = require('express');
const router = express.Router();
const { uploadFile, downloadFile } = require('../controllers/fileController');
const multer = require('multer')();

router.post('/upload/:microserviceInstanceId', multer.array('files'), uploadFile);
router.get('/file/:microserviceInstanceId/:filePath', downloadFile);

// Test route for file upload without microservice ID
router.post('/test/upload', multer.array('files'), (req, res) => {
  // Set a dummy microservice ID for testing
  req.params.microserviceInstanceId = 'test-microservice-id_2';
  uploadFile(req, res);
});

module.exports = router;