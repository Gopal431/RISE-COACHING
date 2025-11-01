"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function FirebaseSetupRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-orange-50 to-blue-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Firebase Setup Required</CardTitle>
          <CardDescription className="text-orange-100">
            Follow these steps to enable Firebase Authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertDescription className="text-orange-800">
              Your app needs Firebase Authentication to be enabled. This is a one-time setup.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="border-l-4 border-orange-600 pl-4">
              <h3 className="font-semibold text-lg mb-2">Step 1: Go to Firebase Console</h3>
              <p className="text-gray-700 mb-2">
                Visit:{" "}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline font-semibold"
                >
                  https://console.firebase.google.com
                </a>
              </p>
              <p className="text-gray-600 text-sm">
                Select your project: <strong>cbt-project-1997b</strong>
              </p>
            </div>

            <div className="border-l-4 border-orange-600 pl-4">
              <h3 className="font-semibold text-lg mb-2">Step 2: Enable Authentication</h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>
                  Click on <strong>Authentication</strong> in the left sidebar (under "Build")
                </li>
                <li>
                  Click <strong>Get Started</strong>
                </li>
                <li>
                  Find <strong>Email/Password</strong> provider
                </li>
                <li>Click on it and enable it</li>
                <li>
                  Click <strong>Save</strong>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold text-lg mb-2">Step 3: Create Firestore Database</h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>
                  Click on <strong>Firestore Database</strong> in the left sidebar
                </li>
                <li>
                  Click <strong>Create Database</strong>
                </li>
                <li>
                  Select <strong>Start in test mode</strong>
                </li>
                <li>
                  Choose your region and click <strong>Enable</strong>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-semibold text-lg mb-2">Step 4: Refresh This Page</h3>
              <p className="text-gray-700">Once you've completed the above steps, refresh this page to continue.</p>
            </div>
          </div>

          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-2"
          >
            Refresh Page
          </Button>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Questions?</strong> Check the Firebase documentation at{" "}
              <a
                href="https://firebase.google.com/docs/auth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:underline"
              >
                firebase.google.com/docs/auth
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
