"use client";
import React, { useState } from "react"; 

const FriendMessageForm: React.FC = () => {
  const [isAiMode, setIsAiMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [manualMessage, setManualMessage] = useState("");
  const [aiDescription, setAiDescription] = useState("");

  const handleToggle = () => {
    setIsAiMode(!isAiMode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      name,
      email,
      birthday,
      message: isAiMode ? aiDescription : manualMessage,
    };
    console.log("Submitted data:", formData);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-white">
                      <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
        <nav className="slides-nav__nav rotate-90 transform origin-center">
          <button className="slides-nav__prev px-2 py-1 font-mono">Next</button>
        </nav>
      </section>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-white p-8 rounded  w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold text-black dark:text-black mb-4 text-content">
          Send a Birthday Message
        </h2>

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
            required
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
            required
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
              className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none text-content"
              placeholder="My friend Diego is turning 30 and loves cats!"
            />
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
              className="w-full px-3 py-3 border border-black rounded bg-white text-black focus:outline-none text-content"
              placeholder="Type your message here"
              required={!isAiMode}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-content"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FriendMessageForm;
