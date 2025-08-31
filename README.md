# TeraStore 📂

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🎯 Overview

TeraStore is a modern and secure cloud storage application built with the latest web technologies. It provides a seamless and intuitive interface for users to upload, manage, and access their files from anywhere.

## 🎥 Live Demo & Showcase

A live version of the application is deployed and can be accessed here:

**[Link to Live Demo]()**

### Application Showcase

To give you a better feel for the application, here is a short video demonstrating the core features.

<div align="center">

![Demo](https://github.com/user-attachments/assets/f786050f-5f16-40e6-ab58-3c29238c232e)

</div>

## ✨ Features

- **Secure User Authentication:** Powered by Clerk, offering robust and easy-to-use authentication.
- **File Uploads:** Simple and intuitive file uploads with a drag-and-drop zone.
- **File Management:** A comprehensive table view of all your files.
- **Core File Operations:**
  - **Rename Files:** Easily rename files directly from the dashboard.
  - **Delete Files:** Securely delete files with a confirmation modal.
- **Real-time Updates:** File list and storage usage are updated in real-time, thanks to Firebase.
- **Dynamic UI:**
  - **Theme Toggling:** Switch between light and dark mode for user comfort.
  - **Responsive Design:** A seamless experience across all devices.
- **Organized File Display:** Files are displayed in a clean, sortable, and filterable table.
- **File Type Icons:** Different file types are represented with unique icons for easy identification.

## 🛠️ Tech Stack

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (v15 with App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Table/Data Grid:** [TanStack Table](https://tanstack.com/table/v8)
- **File Uploads:** [React Dropzone](https://react-dropzone.js.org/)

### Backend & Database

- **Backend-as-a-Service (BaaS):** [Firebase](https://firebase.google.com/)
- **Database:** Firestore for storing file metadata.
- **Storage:** Firebase Storage for file hosting.

### Authentication

- **Provider:** [Clerk](https://clerk.com/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js** and **npm** (or yarn/pnpm) installed on your machine.
- A **Firebase Project**. If you don't have one, follow the [official setup guide](https://firebase.google.com/docs/web/setup).
- A **Clerk Application**. If you don't have one, follow the [official setup guide](https://clerk.com/docs/quickstarts/setup-clerk).

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/T-S-dev/TeraStore.git

    cd TeraStore
    ```

2.  **Install NPM packages:**

    ```sh
    npm install
    ```

3.  **Configure Environment**

    <details> 
    <summary><strong>Set up Environment Variables</strong></summary>

    - Create a file named `.env.local` in the root of the project and add the following, replacing the values with your own keys from your Clerk and Firebase dashboards.

      ```env
      # Clerk Environment Variables

      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
      CLERK_SECRET_KEY=

      NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
      NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

      # Firebase Environment Variables
      NEXT_PUBLIC_FIREBASE_API_KEY=
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
      NEXT_PUBLIC_FIREBASE_APP_ID=
      ```

    </details>

    <details> 
    <summary><strong>Set up Firebase Admin Service Account</strong></summary>

    1.  In your Firebase Project Console, go to **Project settings** ⚙️ -> **Service accounts**.

    2.  Click **"Generate new private key"** and rename the downloaded file to `firebase_service_key.json`.
    3.  Place this file in the **root directory** of your project.
        > ⚠️ CRITICAL: This file is a secret and should NEVER be committed to Git. It has already been added to `.gitignore`

    </details>

    <details> 
    <summary><strong>Clerk - Firebase Integration</strong></summary>

    - Enable Firebase Integration with Clerk, walkthrough can be found at [Official Clerk Firebase Integration Guide](https://clerk.com/docs/integrations/databases/firebase)

    </details>

4.  **Set Up Firebase Security Rules:**

    <details> 
    <summary><strong>Firestore Rules</strong></summary>

    1.  Navigate to the Firestore Database section, then select the Rules tab.

    2.  Paste the following rules into the editor and click Publish.
        ```
        rules_version = '2';
        
        service cloud.firestore {
          match /databases/{database}/documents {
            // Allow users to read and write only their own documents
            match /users/{userId}/{allPaths=**} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
          }
        }
        ```

    </details>

    <details> 
    <summary><strong>Storage Rules</strong></summary>

    1.  Navigate to the Firestore Database section, then select the Rules tab.

    2.  Paste the following rules into the editor and click Publish.
        ```
        rules_version = '2';

        service firebase.storage {
          match /b/{bucket}/o {
            match /users/{userId}/{allPaths=**} {
              allow read, delete: if request.auth != null && request.auth.uid == userId;
              allow write: if request.resource.size <= 20 * 1024 * 1024 && request.auth != null && request.auth.uid == userId;
            }
          }
        }
        ```

    </details>

5.  **Run the development server:**

    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
