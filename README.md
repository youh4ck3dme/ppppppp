# PAPI HAIR DESIGN - Web & Mobile Platform

![Papi Hair Design Logo](/assets/logo.webp)

A high-end, innovative web & mobile platform for the Papi Hair Design salon in Košice. This project showcases a modern, performant, and feature-rich Progressive Web App (PWA) built with React, TypeScript, and powered by the Google Gemini API.

## ✨ Key Features

- **AI-Powered Virtual Try-On (VTO):** Users can upload their photo and try on different hairstyles and colors, or get AI-driven recommendations. Powered by Gemini.
- **E-commerce Platform:** A fully functional e-shop to browse and purchase exclusive hair care products.
- **Online Booking Integration:** Seamlessly guides users to book appointments.
- **VIP Loyalty Club:** A system for rewarding loyal customers with points, discounts, and special offers.
- **AI Chat Assistant "Sofia":** An intelligent chatbot that provides style advice, product recommendations, and booking assistance.
- **Responsive & Mobile-First:** A beautiful and functional experience across all devices.
- **PWA Ready:** Installable on mobile and desktop devices with offline capabilities.
- **Multi-language Support:** Easily switch between Slovak (sk) and English (en).

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **AI & Machine Learning:** Google Gemini API for image editing and chat.
- **State Management:** React Context API
- **Deployment:** Firebase Hosting

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/papi-hair-design.git
    cd papi-hair-design
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add your Google Gemini API key. This app relies on the build system to make `process.env.API_KEY` available.
    ```
    API_KEY="YOUR_GEMINI_API_KEY"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or your configured port) to view it in the browser.

## 🔥 Deployment to Firebase

This project is configured for easy deployment to Firebase Hosting.

### Prerequisites

- A [Firebase Project](https://console.firebase.google.com/) created.
- Firebase CLI installed globally:
  ```bash
  npm install -g firebase-tools
  ```

### Deployment Steps

1.  **Login to Firebase:**
    If you haven't already, log in to your Google account.
    ```bash
    firebase login
    ```

2.  **Configure Project ID:**
    - Open the `.firebaserc` file in the project root.
    - Replace the placeholder `"papi-hair-design-prod"` with your actual Firebase Project ID. You can find this in your Firebase project settings.
    ```json
    {
      "projects": {
        "default": "YOUR-FIREBASE-PROJECT-ID"
      }
    }
    ```

3.  **Deploy:**
    Run the deploy command from the project root.
    ```bash
    firebase deploy --only hosting
    ```

That's it! The Firebase CLI will provide you with the URL of your live site.


## 📁 Project Structure

The project is organized into a modular and maintainable structure:

- **/public:** Static assets, manifest, and service worker.
- **/components:** Reusable React components.
  - **/skeletons:** Loading state placeholder components.
- **/context:** Global state management using React Context.
- **/hooks:** Custom React hooks for shared logic.
- **/services:** API clients and service logic (e.g., `geminiService.ts`).
- `App.tsx`: The main application component with routing logic.
- `index.tsx`: The entry point of the React application.
- `translations.ts`: Contains all localization strings.

---

This project was developed to demonstrate a modern, AI-enhanced user experience for the service industry.# ppppppp
