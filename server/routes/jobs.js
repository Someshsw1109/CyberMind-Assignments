import express from 'express';
import multer from 'multer';
import path from 'path';
import db from '../db.js'; // Ensure this path is correct relative to jobs.js

const router = express.Router();

// --- Multer Configuration ---
// Ensure the 'uploads/' directory exists in the same directory as your server startup script (e.g., where index.js is)
// Or use an absolute path or calculate path relative to __dirname if needed.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Consider using path.join(__dirname, '..', 'uploads') for more robustness
    // Make sure the directory exists and has write permissions
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Add file size limits and potentially file filtering for security
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Example: 10MB limit
  // fileFilter: (req, file, cb) => { /* Check file types here */ }
});
// --- End Multer Configuration ---


// --- GET all jobs ---
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM jobs ORDER BY created_at DESC'); // Order by creation date maybe?
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

// --- POST a new job ---
router.post('/', upload.single('companyProfilePhoto'), async (req, res) => {

  // --- 1. Log Request Data Immediately ---
  // Check what Multer provides right after it runs
  console.log('--- Received POST /api/jobs Request ---');
  console.log('Request Body (req.body):', req.body);
  console.log('Request File (req.file):', req.file);
  // --- End Logging ---

  try {
    // --- 2. Validate Request Body ---
    // Check if req.body exists before trying to destructure
    if (!req.body) {
      // This case should ideally be prevented by body-parsing middleware in index.js
      console.error('Error: req.body is undefined. Check body-parser middleware in index.js.');
      return res.status(400).json({ error: 'Server configuration error: Missing request body.' });
    }

    // --- 3. Destructure Data (Safely) ---
    const {
      title,
      companyName,
      location,
      jobType,
      experience, // This might be undefined if not sent from frontend
      salaryRange,
      description,
      requirements,
      responsibilities,
      applicationDeadline, // Ensure frontend sends compatible format for DB timestamp
    } = req.body;

    // --- Basic Validation (Add more as needed) ---
    if (!title || !companyName || !location || !jobType || !description) {
        console.warn('Validation Error: Missing required fields.');
        // Combine missing fields for a better error message if desired
        return res.status(400).json({ error: 'Missing required job fields (title, companyName, location, jobType, description).' });
    }

    // --- 4. Construct Photo URL ---
    const photoUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` // Ensure /uploads is served statically in index.js
      : null; // Set to null if no file was uploaded

    console.log('Constructed Photo URL:', photoUrl);
    console.log('Received Application Deadline:', applicationDeadline);

    // --- 5. Prepare Database Query ---
    const query = `
      INSERT INTO jobs (
        title, company_name, location, job_type, experience,
        salary_range, description, requirements, responsibilities,
        application_deadline, company_profile_photo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;  -- Ensure RETURNING * is needed and efficient
    `;

    const values = [
      title,
      companyName,
      location,
      jobType,
      experience || null, // Use null if experience is undefined/falsy
      salaryRange || null, // Also handle other potentially optional fields
      description,
      requirements || null,
      responsibilities || null,
      applicationDeadline || null, // Handle if deadline is optional or potentially invalid
      photoUrl
    ];

    console.log('Executing query:', query);
    console.log('With values:', values);

    // --- 6. Execute Query ---
    const result = await db.query(query, values);

    // --- 7. Send Success Response ---
    console.log('Job created successfully:', result.rows[0]);
    res.status(201).json(result.rows[0]);

  } catch (error) {
    // --- 8. Log Detailed Error ---
    console.error('--- ERROR Creating Job (in catch block) ---');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Original Request Body:', req.body); // Log body again in case of error
    console.error('Original Request File:', req.file); // Log file again
    console.error('Full Error Object:', error); // Log the entire error
    // Log specific PG properties if available
    if (error.code) console.error('PostgreSQL Error Code:', error.code);
    if (error.detail) console.error('PostgreSQL Error Detail:', error.detail);
    if (error.constraint) console.error('PostgreSQL Constraint Violated:', error.constraint);

    // --- 9. Send Generic Error Response ---
    res.status(500).json({ error: 'An error occurred while creating the job.' });
  }
});

export default router;