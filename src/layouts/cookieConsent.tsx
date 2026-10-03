"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-gray-900 text-white px-4 py-4 sm:px-6 z-30 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-200 text-center sm:text-left">
          We use cookies to improve your experience on Creativiy BLOG. By continuing, you agree to our{" "}
          <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="border border-gray-500 text-gray-300 hover:text-white hover:border-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}