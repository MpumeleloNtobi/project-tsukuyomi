const request = require("supertest");
const app = require("../index"); // Import your main app which initializes all routes
const { BlobServiceClient } = require("@azure/storage-blob"); // Needed for cleanup

// --- Azure Configuration for Live Testing ---
// IMPORTANT: These MUST be set in your .env file and loaded by your main app (index.js).
// For the test file itself, ensure they are accessible.
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER = process.env.AZURE_CONTAINER;

// Validate essential Azure environment variables
if (
  !AZURE_STORAGE_CONNECTION_STRING ||
  !AZURE_CONTAINER ||
  AZURE_STORAGE_CONNECTION_STRING ===
    "your_actual_azure_storage_connection_string_here" ||
  AZURE_CONTAINER === "your_existing_azure_container_name_here"
) {
  throw new Error(
    "Azure environment variables AZURE_STORAGE_CONNECTION_STRING and AZURE_CONTAINER must be set in your .env for live images tests.",
  );
}

// --- Test Utilities for Cleanup ---
const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING,
);
const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER);

// Store blob URLs for cleanup
let uploadedBlobUrls = [];

async function cleanupUploadedBlobs() {
  console.log("Cleaning up uploaded blobs...");
  for (const blobUrl of uploadedBlobUrls) {
    try {
      const blobName = blobUrl.substring(blobUrl.lastIndexOf("/") + 1);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.deleteIfExists();
      console.log(`Deleted blob: ${blobName}`);
    } catch (error) {
      console.error(`Failed to delete blob ${blobUrl}:`, error.message);
    }
  }
  uploadedBlobUrls = []; // Reset for next test run
}

// --- Jest Test Setup ---
// Increase timeout for live network operations
jest.setTimeout(60000); // 60 seconds, adjust if uploads are very slow

beforeAll(async () => {
  // Ensure the container exists (optional, but good for robustness)
  await containerClient.createIfNotExists();
  console.log(`Ensured Azure container '${AZURE_CONTAINER}' exists.`);
});

afterEach(async () => {
  // Clean up after each test to ensure test isolation
  await cleanupUploadedBlobs();
});

afterAll(async () => {
  // Final cleanup just in case
  await cleanupUploadedBlobs();
});

describe("Images Routes (Live Azure)", () => {
  // --- Dummy Test Files ---
  const dummyFile1 = {
    buffer: Buffer.from("This is a single test file content."),
    originalname: `single-upload-${Date.now()}.txt`,
    mimetype: "text/plain",
  };

  const dummyFile2 = {
    buffer: Buffer.from("Content for multiple file 1."),
    originalname: `multi-upload-1-${Date.now()}.txt`,
    mimetype: "text/plain",
  };

  const dummyFile3 = {
    buffer: Buffer.from("Content for multiple file 2."),
    originalname: `multi-upload-2-${Date.now()}.jpg`,
    mimetype: "image/jpeg",
  };

  describe("POST /upload (Single File)", () => {
    test("should upload a single file successfully to Azure Blob Storage", async () => {
      const res = await request(app)
        .post("/upload")
        .attach("file", dummyFile1.buffer, {
          filename: dummyFile1.originalname,
          contentType: dummyFile1.mimetype,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "File uploaded successfully!");
      expect(res.body).toHaveProperty("blobUrl");
      expect(res.body.blobUrl).toContain(AZURE_CONTAINER);
      expect(res.body.blobUrl).toContain(dummyFile1.originalname.split(".")[0]); // Check for part of the name
      expect(res.body.blobUrl).toMatch(
        /^https?:\/\/[^\/]+\.blob\.core\.windows\.net\//,
      );

      uploadedBlobUrls.push(res.body.blobUrl); // Store for cleanup
    });

    test("should return 400 if no file is uploaded for single upload", async () => {
      const res = await request(app).post("/upload");

      expect(res.statusCode).toBe(400);
      expect(res.text).toBe("No file uploaded.");
    });

    // NOTE: Testing the 500 error path (Azure upload failure) without mocks is NOT feasible.
    // It would require intentionally breaking your Azure connection string or container,
    // which is not recommended in automated testing. This path will likely not be covered.
  });

  describe("POST /upload-multiple (Multiple Files)", () => {
    test("should upload multiple files successfully to Azure Blob Storage", async () => {
      const res = await request(app)
        .post("/upload-multiple")
        .attach("files", dummyFile2.buffer, {
          filename: dummyFile2.originalname,
          contentType: dummyFile2.mimetype,
        })
        .attach("files", dummyFile3.buffer, {
          filename: dummyFile3.originalname,
          contentType: dummyFile3.mimetype,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Files uploaded successfully!",
      );
      expect(res.body).toHaveProperty("files");
      expect(res.body.files).toHaveLength(2);

      expect(res.body.files[0]).toHaveProperty(
        "fileName",
        dummyFile2.originalname,
      );
      expect(res.body.files[0].blobUrl).toContain(AZURE_CONTAINER);
      expect(res.body.files[0].blobUrl).toMatch(
        /^https?:\/\/[^\/]+\.blob\.core\.windows\.net\//,
      );

      expect(res.body.files[1]).toHaveProperty(
        "fileName",
        dummyFile3.originalname,
      );
      expect(res.body.files[1].blobUrl).toContain(AZURE_CONTAINER);
      expect(res.body.files[1].blobUrl).toMatch(
        /^https?:\/\/[^\/]+\.blob\.core\.windows\.net\//,
      );

      res.body.files.forEach((file) => uploadedBlobUrls.push(file.blobUrl)); // Store for cleanup
    });

    test("should return 400 if no files are uploaded for multiple upload", async () => {
      const res = await request(app).post("/upload-multiple");

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: "No files uploaded." });
    });

    // NOTE: Similar to single upload, testing the 500 error path here is not feasible.
  });
});
