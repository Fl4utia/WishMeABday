"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid"; // You need to install uuid with `npm install uuid`

const FriendMessage: React.FC = () => {
  const [isAiMode, setIsAiMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [manualMessage, setManualMessage] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardType = searchParams.get("cardtype");

  const handleToggle = () => {
    setIsAiMode(!isAiMode);
    setManualMessage(""); // Reset manual message if switching modes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for required fields if not in AI mode
    if (!isAiMode && (!name || !email || !birthday || !manualMessage)) {
      setError("Please fill in all the fields.");
      return;
    }

    // Clear error message
    setError("");

    // Generate unique link with card type and UUID
    const uuid = uuidv4();
    let generatedUrl = `http://localhost:3000`;

    if (cardType === "1") {
      generatedUrl = `${generatedUrl}/birthday1/${uuid}`;
    } else if (cardType === "2") {
      generatedUrl = `${generatedUrl}/birthday2/${uuid}`;
    } else if (cardType === "3") {
      generatedUrl = `${generatedUrl}/birthday3/${uuid}`;
    } else {
      generatedUrl = `${generatedUrl}/wish?cardtype=${cardType}`;
    }

    // Redirect to the generated URL with the form data
    const formData = {
      name,
      email,
      birthday,
      cardType,
      message: isAiMode ? aiDescription : manualMessage,
    };

    console.log("Submitted data:", formData);
    router.push(generatedUrl); // Navigate to the generated URL
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-white">
      <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
        <nav className="slides-nav__nav rotate-90 transform origin-center">
          <button
            type="button"
            className="slides-nav__prev px-2 py-1 font-mono"
            onClick={handleSubmit}
          >
            Next
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

        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-black dark:text-black mb-1 text-content"
          >
            Friend's Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none text-content"
            required={!isAiMode}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-black dark:text-black mb-1 text-content"
          >
            Friend's Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none text-content"
            required={!isAiMode}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="birthday"
            className="block text-black dark:text-black mb-1 text-content"
          >
            Friend's Birthday
          </label>
          <input
            type="date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none text-content"
            required={!isAiMode}
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
              placeholder="My friend Diego is turning 30 and loves cats!"
            />
            <div className="text-right text-black dark:text-black">
              {aiDescription.length}/300
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
      </form>
    </div>
  );
};

export default FriendMessage;
