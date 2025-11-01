# Firebase Setup Guide for RISE  COACHING Exam Platform

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "RISE  COACHING Exam"
4. Click "Continue"
5. Enable Google Analytics (optional) and click "Create project"
6. Wait for project creation to complete

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** section
2. Click "Get started"
3. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

## Step 3: Create Firestore Database

1. Go to **Firestore Database** section
2. Click "Create database"
3. Select region closest to you (e.g., "asia-south1" for India)
4. Choose **Start in test mode** (for development)
5. Click "Create"

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click on the web app icon (</> symbol)
4. Copy the firebaseConfig object
5. This will look like:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
\`\`\`

## Step 5: Add Firebase Config to Your App

1. Create a `.env.local` file in your project root
2. Add these environment variables:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
\`\`\`

## Step 6: Set Firestore Security Rules

1. In Firestore, go to **Rules** tab
2. Replace the default rules with:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Teachers collection
    match /teachers/{teacherId} {
      allow read: if request.auth.uid == resource.data.uid;
      allow write: if request.auth.uid == resource.data.uid;
      
      // Exams subcollection
      match /exams/{examId} {
        allow read: if request.auth.uid == get(/databases/$(database)/documents/teachers/$(teacherId)).data.uid;
        allow write: if request.auth.uid == get(/databases/$(database)/documents/teachers/$(teacherId)).data.uid;
        
        // Results subcollection
        match /results/{resultId} {
          allow read: if request.auth.uid == get(/databases/$(database)/documents/teachers/$(teacherId)).data.uid;
          allow write: if true;
        }
      }
    }
    
    // Students collection
    match /students/{studentId} {
      allow read: if request.auth.uid == resource.data.uid;
      allow write: if request.auth.uid == resource.data.uid;
      
      // Student exam history
      match /examHistory/{historyId} {
        allow read: if request.auth.uid == get(/databases/$(database)/documents/students/$(studentId)).data.uid;
        allow write: if request.auth.uid == get(/databases/$(database)/documents/students/$(studentId)).data.uid;
      }
    }
  }
}
\`\`\`

## Step 7: Publish Your App to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel env pull` to automatically load environment variables
3. Run: `vercel` to deploy

## Database Structure

### Collections:

**teachers**
- uid (document ID - from Auth)
- email
- name
- createdAt

**teachers/{teacherId}/exams**
- id
- name
- duration (minutes)
- examCode (unique)
- questions (array of question objects)
- createdAt
- isActive

**teachers/{teacherId}/exams/{examId}/results**
- studentName
- studentRollNo
- score
- totalQuestions
- percentage
- answers (array)
- submittedAt

**students**
- uid (document ID - from Auth)
- name
- rollNo
- createdAt

**students/{studentId}/examHistory**
- examId
- examName
- score
- totalQuestions
- percentage
- submittedAt
\`\`\`

Now I'll create the Firebase utilities file that will be used throughout the app:
