# AI PROMPT: DEPLOY TO FIREBASE HOSTING

**OBJECTIVE:** Deploy the existing React PWA project to Firebase Hosting.

**ASSUMPTIONS:**
- You have shell access in the project's root directory.
- The user has already created a Firebase project in the Firebase Console.
- The user has provided you with their Firebase Project ID.
- Firebase CLI is installed globally (`firebase-tools`).
- The user is logged into Firebase CLI (`firebase login`).

---

### STEP-BY-STEP DEPLOYMENT PLAN

**1. VERIFY PROJECT FILES:**
   - Ensure `firebase.json` and `.firebaserc` exist. Their content is pre-configured for this SPA.

**2. UPDATE FIREBASE PROJECT ID:**
   - **Action:** Open the `.firebaserc` file.
   - **Task:** Replace the placeholder `"papi-hair-design-prod"` with the user-provided Firebase Project ID.
   - **Example:**
     ```json
     {
       "projects": {
         "default": "USER-PROVIDED-PROJECT-ID"
       }
     }
     ```

**3. SELECT FIREBASE PROJECT (Optional but recommended):**
   - **Command:** `firebase use USER-PROVIDED-PROJECT-ID`
   - **Purpose:** This command sets the active Firebase project for the current directory, ensuring the deployment targets the correct project.

**4. DEPLOY TO FIREBASE HOSTING:**
   - **Command:** `firebase deploy --only hosting`
   - **Purpose:** This command uploads the files from the public directory (configured as `.` in `firebase.json`) to Firebase Hosting. The `--only hosting` flag ensures only the hosting content is deployed.

**5. FINAL VERIFICATION:**
   - After the command completes, Firebase CLI will output the "Hosting URL".
   - **Action:** Provide this URL back to the user as the live, deployed application link.
   - **Example Output to User:** "Your application has been successfully deployed. You can access it at: https://user-provided-project-id.web.app"

---

### FILE REFERENCE

**`firebase.json`:**
- `"public": "."`: Tells Firebase that the `index.html` and all other assets are in the root directory.
- `"rewrites": [{"source": "**", "destination": "/index.html"}]`: This is the crucial rule for a Single-Page Application (SPA). It ensures that any URL (like `/about` or `/shop`) is routed to `index.html`, allowing the React application to handle the routing on the client-side.
- `"headers"`: Configures browser caching for static assets (images, JS, CSS) for faster load times and applies important security headers to all pages.

**`.firebaserc`:**
- This file links your local project directory to a specific Firebase project. It allows you to deploy without having to specify the project ID in the command line every time.
