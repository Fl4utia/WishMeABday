"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../db/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { saveCardData } from "@/lib/utils/cards";

interface AIApiResponse {
  message: string;
  aiAvailable?: boolean;
}

/**
 * Fetches a personalized birthday message from OpenAI API
 * @param description - Optional context about the birthday person
 * @returns AI-generated birthday message
 */
const fetchBirthdayMessageFromAI = async (description: string): Promise<AIApiResponse> => {
  const prompt = description
    ? `Write a birthday message for a friend based on the following description: ${description}`
    : "Write a generic birthday message for a friend. (don't mention names)";

  const response = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data?.details || data?.error || "AI generation failed");
    (error as Error & { quota?: Partial<AIApiResponse> }).quota = {
      aiAvailable: data?.aiAvailable,
    };
    throw error;
  }

  return data as AIApiResponse;
};

const fetchAIQuotaStatus = async (): Promise<Partial<AIApiResponse>> => {
  const response = await fetch("/api/openai", { method: "GET" });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.details || data?.error || "Unable to fetch AI quota status");
  }

  return data as Partial<AIApiResponse>;
};

const FriendMessageContent: React.FC = () => {
  const [isAiMode, setIsAiMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [manualMessage, setManualMessage] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [isAiAvailable, setIsAiAvailable] = useState(true);
  const [error, setError] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardType = searchParams.get("cardtype");

  // Protect route: redirect to login if user is not authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadQuota = async () => {
      try {
        const quota = await fetchAIQuotaStatus();
        setIsAiAvailable(quota.aiAvailable !== false);
      } catch (quotaError) {
        console.warn("Unable to load AI quota status:", quotaError);
        setIsAiAvailable(false);
      }
    };

    loadQuota();
  }, []);

  const handleToggle = () => {
    if (!isAiMode && !isAiAvailable) {
      setError("AI mode is currently unavailable.");
      return;
    }

    setIsAiMode(!isAiMode);
    setManualMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Manual mode requires all fields including message
    if (!isAiMode && (!name || !email || !birthday || !manualMessage)) {
      setError("Please fill in all the fields.");
      return;
    }

    // Validation: AI mode only requires basic info (message will be generated)
    if (isAiMode && (!name || !email || !birthday)) {
      setError("Please fill in name, email, and birthday.");
      return;
    }

    if (isAiMode && !isAiAvailable) {
      setError("AI mode is currently unavailable.");
      return;
    }

    setError("");
    setEmailStatus("");
    setIsLoading(true);

    const uuid = uuidv4();
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    let generatedUrl = baseUrl;

    // Build card URL based on selected card type
    if (cardType === "1") {
      generatedUrl = `${generatedUrl}/birthday1/${uuid}`;
    } else if (cardType === "2") {
      generatedUrl = `${generatedUrl}/birthday2/${uuid}`;
    } else if (cardType === "3") {
      generatedUrl = `${generatedUrl}/birthday3/${uuid}`;
    } else {
      generatedUrl = `${generatedUrl}/wish?cardtype=${cardType}`;
    }

    let finalMessage = manualMessage;

    // Generate message with AI if enabled
    if (isAiMode) {
      try {
        const aiResponse = await fetchBirthdayMessageFromAI(aiDescription);
        finalMessage = aiResponse.message;
        setIsAiAvailable(aiResponse.aiAvailable !== false);
      } catch (error) {
        console.error("AI generation error:", error);
        const quotaInfo = (error as Error & { quota?: Partial<AIApiResponse> }).quota;
        if (quotaInfo) {
          setIsAiAvailable(quotaInfo.aiAvailable !== false);
          if (quotaInfo.aiAvailable === false) {
            setIsAiMode(false);
          }
        }

        setError(
          error instanceof Error ? error.message : "Error generating AI message. Please try again."
        );
        setIsLoading(false);
        return;
      }
    }

    const formData = {
      name,
      email,
      birthday,
      cardType,
      message: finalMessage,
      mode: isAiMode ? "AI" : "MANUAL",
      link: generatedUrl,
      createdAt: new Date().toISOString(),
      id: uuid,
    };

    saveCardData(formData);

    // Save to Firebase when possible, but fall back gracefully if Firestore rules block the write.
    try {
      if (userId) {
        const friendDocRef = doc(db, `users/${userId}/friends`, uuid);
        await setDoc(friendDocRef, formData);
      }

      const cardDocRef = doc(db, `cards`, uuid);
      await setDoc(cardDocRef, formData);
    } catch (error) {
      console.warn("Firestore write unavailable, using local fallback instead:", error);
    }

    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      try {
        const response = await fetch("/api/send", {
          method: "POST",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: name,
            link: generatedUrl,
            recipientEmail: email,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          const errorMessage = errorBody?.details || errorBody?.error || "Email delivery failed.";
          setEmailStatus(`Email failed: ${errorMessage}`);
          console.warn("Email delivery failed:", errorBody);
        } else {
          setEmailStatus("Email sent successfully.");
        }
      } catch (error) {
        setEmailStatus("Email failed: Could not reach the email service.");
        console.warn("Error sending email:", error);
      }
    }

    setIsLoading(false);
    router.push(generatedUrl);
  };
  

  return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-white py-8">
          <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
            <nav className="slides-nav__nav rotate-90 transform origin-center">
              <button
                type="button"
                className="slides-nav__prev px-2 py-1 font-mono hover:text-gray-600 transition-colors"
                onClick={() => router.push("/cards")}
              >
                Back
              </button>
            </nav>
          </section>
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-white p-8 rounded w-full max-w-lg"
          >
            <h2 className="text-xl font-semibold text-black dark:text-black mb-4 text-content">
              Send a Birthday Message
            </h2>
            {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
            {emailStatus && (
              <div
                className={`mb-4 text-sm ${
                  emailStatus.startsWith("Email failed") ? "text-red-500" : "text-green-700"
                }`}
              >
                {emailStatus}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="name" className="block text-black dark:text-black mb-1 text-content">
                Friend's Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none text-content"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black dark:text-black mb-1 text-content">
                Friend's Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none text-content"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="birthday" className="block text-black dark:text-black mb-1 text-content">
                Friend's Birthday
              </label>
              <input
                type="date"
                id="birthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none text-content"
                required
              />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <span className="text-black dark:text-black text-content">
                {isAiMode ? "AI Mode" : "Manual Mode"}
              </span>
              <label className="relative inline-block w-10 h-6">
                <input
                  type="checkbox"
                  checked={isAiMode}
                  onChange={handleToggle}
                  className="opacity-0 w-0 h-0"
                />
                <span className="block bg-gray-400 dark:bg-black rounded-full cursor-pointer w-full h-full transition-transform duration-300 ease-in-out">
                  <span
                    className={`block w-6 h-6 border-black border-2 bg-white rounded-full transform transition-transform duration-300 ease-in-out ${
                      isAiMode ? "translate-x-4" : ""
                    }`}
                  />
                </span>
              </label>
            </div>
            {isAiMode ? (
              <div className="mb-4">
                <div>
                  <label
                    htmlFor="aiDescription"
                    className="block text-black dark:text-black mb-1 text-content"
                  >
                    Optional Description for AI Message
                  </label>
                  <textarea
                    id="aiDescription"
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    maxLength={300}
                    className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none text-content"
                    placeholder="My friend loves candy and old-school video games"
                  />
                  <div className="text-right text-black dark:text-black">
                    {aiDescription.length}/300
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label
                  htmlFor="manualMessage"
                  className="block text-black dark:text-black mb-1 text-content"
                >
                  Manual Message
                </label>
                <textarea
                  id="manualMessage"
                  value={manualMessage}
                  onChange={(e) => setManualMessage(e.target.value)}
                  maxLength={300}
                  className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none text-content"
                  placeholder="Type your message here"
                  required={!isAiMode}
                />
                <div className="text-right text-black dark:text-black">
                  {manualMessage.length}/300
                </div>
              </div>
            )}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading || (isAiMode && !isAiAvailable)}
                className="w-full px-2 py-2 font-mono border border-black text-white bg-black rounded hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isAiMode ? "Generating..." : "Creating..."}
                  </span>
                ) : (
                  <>
                    {isAiMode
                      ? isAiAvailable
                        ? "Generate & Create Card"
                        : "AI quota reached for today"
                      : "Create Card"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
  );
};

const FriendMessage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black">Loading...</div>
      </div>
    }>
      <FriendMessageContent />
    </Suspense>
  );
};

export default FriendMessage;
