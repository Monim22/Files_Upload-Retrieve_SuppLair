const { firebaseAdmin } = require('../utils/firebase');
const multer = require('multer');
const upload = multer();
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    const files = req.files;
    const microserviceInstanceId = req.params.microserviceInstanceId;
    if (!microserviceInstanceId) {
      return res.status(400).send('Missing microservice instance ID');
    }
    const bucket = firebaseAdmin.storage().bucket();
    const folderPath = `uploads/${microserviceInstanceId}`;
    const uploadPromises = files.map(async (file) => {
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const uniqueFilename = `${path.basename(file.originalname, extension)}_${timestamp}${extension}`;

      const uploadFile = bucket.file(`${folderPath}/${uniqueFilename}`);
      const stream = uploadFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
      return new Promise((resolve, reject) => {
        stream.on('error', (err) => {
          console.error(err);
          reject(err);
        });
        stream.on('finish', async () => {
          await uploadFile.makePublic();
          resolve(` ${uploadFile.publicUrl()}`);
        });
        stream.end(file.buffer);
      });
    });
    const uploadResults = await Promise.all(uploadPromises);
    res.send(uploadResults);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading files');
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const microserviceInstanceId = req.params.microserviceInstanceId;
    const filePath = req.params.filePath;
    const bucket = firebaseAdmin.storage().bucket();
    const file = bucket.file(`uploads/${microserviceInstanceId}/${filePath}`);
    const [metadata] = await file.getMetadata();
    res.set('Content-Type', metadata.contentType);
    res.set('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    const stream = file.createReadStream();
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving file');
  }
};