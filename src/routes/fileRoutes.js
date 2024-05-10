const express = require('express');
const router = express.Router();
const { uploadFile, downloadFile } = require('../controllers/fileController');
const upload = require('multer')();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/file/:microserviceInstanceId/:filePath', downloadFile);

// Test route for file upload without microservice ID
router.post('/test/upload', upload.single('file'), (req, res) => {
  // Set a dummy microservice ID for testing
  req.headers['x-microservice-id'] = 'test-microservice-id';
  uploadFile(req, res);
});

module.exports = router;