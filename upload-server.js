const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('apk'), (req, res) => {
  const file = req.file;
  const targetPath = path.join(__dirname, 'uploads', 'app-release.apk');
  fs.rename(file.path, targetPath, (err) => {
    if (err) return res.status(500).send('Upload failed');
    res.send('APK uploaded successfully!');
  });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
