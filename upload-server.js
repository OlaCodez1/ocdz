const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Limit file size to 100MB, and store in 'uploads/'
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    console.log('No file received');
    return res.status(400).send('No file uploaded.');
  }

  const targetPath = path.join(uploadDir, 'app-release.apk');

  fs.rename(file.path, targetPath, (err) => {
    if (err) {
      console.error('❌ Failed to save APK:', err);
      return res.status(500).send('Upload failed.');
    }
    console.log('✅ APK uploaded and saved to', targetPath);
    res.send('APK uploaded successfully!');
  });
});

// Download endpoint
app.get('/download', (req, res) => {
  const filePath = path.join(uploadDir, 'app-release.apk');

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('APK file not found');
  }

  res.setHeader('Content-disposition', 'attachment; filename=app-release.apk');
  res.setHeader('Content-type', 'application/vnd.android.package-archive');

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Root route
app.get('/', (req, res) => {
  res.send('✅ Upload server is running. <a href="/download">Download APK</a>');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
