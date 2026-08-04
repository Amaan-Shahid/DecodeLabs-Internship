import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDirectory = path.join(__dirname, "..", "client");

// Temporary storage for Project 2. It resets when the server restarts.
const enquiries = [];
let nextEnquiryId = 1;

app.use(express.json());
app.use(express.static(clientDirectory));

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateEnquiry(body = {}) {
  const enquiry = {
    name: cleanText(body.name),
    email: cleanText(body.email).toLowerCase(),
    phone: cleanText(body.phone),
    subject: cleanText(body.subject),
    message: cleanText(body.message),
  };
  const errors = {};

  if (enquiry.name.length < 2) errors.name = "Please enter a name with at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) errors.email = "Please enter a valid email address.";
  if (enquiry.phone.length < 7) errors.phone = "Please enter a valid phone number.";
  if (enquiry.subject.length < 3) errors.subject = "Please enter a subject with at least 3 characters.";
  if (enquiry.message.length < 10) errors.message = "Please enter a message with at least 10 characters.";
  if (enquiry.message.length > 2000) errors.message = "Your message must be 2,000 characters or fewer.";

  return { enquiry, errors };
}

app.get("/api/health", (request, response) => {
  response.status(200).json({ success: true, message: "Iron Edge API is running." });
});

app.get("/api/enquiries", (request, response) => {
  response.status(200).json({ success: true, count: enquiries.length, enquiries });
});

app.post("/api/enquiries", (request, response) => {
  const { enquiry, errors } = validateEnquiry(request.body);

  if (Object.keys(errors).length > 0) {
    return response.status(400).json({
      success: false,
      message: "Please correct the highlighted information and try again.",
      errors,
    });
  }

  const savedEnquiry = {
    id: nextEnquiryId++,
    ...enquiry,
    createdAt: new Date().toISOString(),
  };
  enquiries.push(savedEnquiry);

  return response.status(201).json({
    success: true,
    message: "Thanks - your message has been received. We'll be in touch shortly.",
    enquiry: savedEnquiry,
  });
});

app.use("/api", (request, response) => {
  response.status(404).json({ success: false, message: "API route not found." });
});

if (process.env.VERCEL !== "1") {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Iron Edge is running at http://localhost:${port}`);
  });
}

export default app;

