# Iron Edge Gym API

A full-stack contact-form project built with Node.js and Express. The application serves a responsive gym website and provides an API that receives, validates, and temporarily stores visitor enquiries.

## What this project does

Visitors can complete the contact form on the website. Instead of sending the form directly to a third-party service, the browser sends a JSON request to this Express API. The API validates the request, returns useful success or error messages, and keeps accepted enquiries in temporary memory for the current server session.

## Tech stack

- HTML, CSS, and JavaScript for the website
- Node.js and Express for the server and API
- npm for dependency management

## Project structure

```text
Project2-Gym-Backend/
├── client/             # Website files served by Express
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/
│   └── server.js       # Express server and API routes
├── package.json
└── README.md
```

## Requirements

Install [Node.js](https://nodejs.org/) before running the project. Confirm that Node.js and npm are available:

```bash
node --version
npm --version
```

## Run locally

1. Open a terminal in this project's folder.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in a browser.

Use `http://localhost:3000`, not a direct `index.html` file or a separate Live Server instance. Express serves both the website and API so the contact form can reach `/api/enquiries`.

## How the contact form works

```text
Visitor submits the form
        -> POST /api/enquiries
        -> API validates the submitted fields
        -> API stores an accepted enquiry in memory
        -> API returns a JSON success or error response
        -> Website displays the result to the visitor
```

Invalid fields receive a red border and an explanation directly below the field. The form data must include a name, valid email, phone number, subject of at least 3 characters, and message of 10 to 2,000 characters.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check that the server is running. |
| GET | `/api/enquiries` | Retrieve accepted enquiries from the current server session. |
| POST | `/api/enquiries` | Validate and accept a new contact-form enquiry. |

### GET `/api/health`

Example response:

```json
{
  "success": true,
  "message": "Iron Edge API is running."
}
```

### POST `/api/enquiries`

Example request body:

```json
{
  "name": "Ali Khan",
  "email": "ali@example.com",
  "phone": "03001234567",
  "subject": "Membership question",
  "message": "I would like to arrange a visit to the gym."
}
```

A valid request returns `201 Created`. Invalid data returns `400 Bad Request` and provides field-specific messages.

### GET `/api/enquiries`

Open `http://localhost:3000/api/enquiries` while the server is running to view accepted enquiries as JSON. This route is for API demonstration and development; it should be protected with authentication before being used for a real gym website.

## Important data limitation

Enquiries are stored in an in-memory JavaScript array. They are lost whenever the server stops, restarts, or is redeployed. This is intentional for the current API-learning scope. A database and authenticated admin area would be needed before production use.

## Deploying

This is a Node.js web service, not a static-only website. Deploy it to a platform that runs Node.js, such as Render. Use the following settings:

| Setting | Value |
| --- | --- |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check path | `/api/health` |

The server reads the `PORT` environment variable supplied by the hosting platform, with `3000` used locally. After deployment, test the site's contact form and `/api/health` at the public URL.
