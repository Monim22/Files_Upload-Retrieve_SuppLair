const { firebaseAdmin } = require('../utils/firebase');
const multer = require('multer');
const upload = multer();
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const microserviceInstanceId = req.params.microserviceInstanceId;
    if (!microserviceInstanceId) {
      return res.status(400).send('Missing microservice instance ID');
    }

    const bucket = firebaseAdmin.storage().bucket();
    const folderPath = `uploads/${microserviceInstanceId}`;
    const uploadFile = bucket.file(`${folderPath}/${file.originalname}`);

    const stream = uploadFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error uploading file');
    });

    stream.on('finish', async () => {
      await uploadFile.makePublic();
      res.send(`File uploaded: ${uploadFile.publicUrl()}`);
    });

    stream.end(file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
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