const express = require("express");
const router = express.Router();
const multer = require("multer");
const Groq = require("groq-sdk");
const fs = require("fs");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/match", upload.single("resume"), async (req, res) => {
  try {
    console.log("File received:", req.file);
    console.log("Body received:", req.body);

    const { jobTitle, jobDescription, jobCompany } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF resume!" });
    }

    // Extract text from PDF
    let resumeText = "";
    try {
      const pdfBuffer = fs.readFileSync(req.file.path);
      
      // Try different import methods
      let pdfParseFunc;
      const pdfModule = require("pdf-parse");
      
      if (typeof pdfModule === "function") {
        pdfParseFunc = pdfModule;
      } else if (typeof pdfModule.default === "function") {
        pdfParseFunc = pdfModule.default;
      } else {
        throw new Error("pdf-parse not loaded correctly");
      }

      const pdfData = await pdfParseFunc(pdfBuffer);
      resumeText = pdfData.text;
      console.log("PDF extracted successfully! Length:", resumeText.length);

    } catch (pdfErr) {
      console.log("PDF parse error:", pdfErr.message);
      resumeText = "Could not extract PDF text";
    }

    // Delete uploaded file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (!resumeText || resumeText.length < 10) {
      return res.status(400).json({
        message: "Could not read PDF. Please try a text-based PDF!"
      });
    }

    console.log("Sending to Groq AI...");

    // Send to Groq AI with updated model
    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are an expert HR professional and ATS system.

Analyze this resume against the job description and provide a match analysis.

JOB TITLE: ${jobTitle}
COMPANY: ${jobCompany}

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText.slice(0, 3000)}

Respond ONLY with a valid JSON object, no extra text, no markdown backticks:
{
  "matchScore": 75,
  "matchLevel": "Good",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "summary": "2-3 sentence overall assessment here"
}`
        }
      ]
    });

    const responseText = message.choices[0].message.content;
    console.log("AI Response received!");
    console.log("Raw response:", responseText);

    // Clean JSON
    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleanJson);

    res.json({
      success: true,
      jobTitle,
      jobCompany,
      analysis
    });

  } catch (err) {
    console.log("Resume Match Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: err.message
    });
  }
});

module.exports = router;