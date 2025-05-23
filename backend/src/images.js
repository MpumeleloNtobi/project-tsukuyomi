require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");

const imagesRoute = (
  app,
  dbUrl,
  AZURE_STORAGE_CONNECTION_STRING,
  AZURE_CONTAINER,
) => {
  const sql = neon(dbUrl);
  // Multer setup to store file in memory
  const upload = multer({ storage: multer.memoryStorage() });

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING,
  );

  app.post("/upload", upload.single("file"), async (req, res) => {
    console.log(`uploading image`);
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      const containerClient =
        blobServiceClient.getContainerClient(AZURE_CONTAINER);
      const blobName = Date.now() + "-" + file.originalname;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      res.status(200).json({
        message: "File uploaded successfully!",
        blobUrl: blockBlobClient.url,
      });
    } catch (err) {
      console.error("Upload error:", err.message);
      res.status(500).send("Error uploading file.");
    }
  });
  // Multiple files upload endpoint
  app.post("/upload-multiple", upload.array("files", 10), async (req, res) => {
    console.log(`uploading images`);
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded." });
      }

      const uploadedFiles = [];

      for (const file of req.files) {
        const blobName = `${Date.now()}-${file.originalname}`;
        const containerClient =
          blobServiceClient.getContainerClient(AZURE_CONTAINER);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file.buffer, {
          blobHTTPHeaders: { blobContentType: file.mimetype },
        });

        uploadedFiles.push({
          fileName: file.originalname,
          blobUrl: blockBlobClient.url,
        });
      }

      res.status(200).json({
        message: "Files uploaded successfully!",
        files: uploadedFiles,
      });
    } catch (err) {
      console.error("Upload error:", err.message);
      res.status(500).json({ error: "Error uploading files." });
    }
  });
};
module.exports = { imagesRoute };
