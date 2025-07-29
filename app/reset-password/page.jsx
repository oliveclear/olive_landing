import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage"; // Import the ResetPasswordPage component

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
// This file is used to wrap the ResetPasswordPage component in a Suspense boundary