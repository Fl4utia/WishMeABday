"use client";

import React, { useState, useEffect , Suspense} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../db/firebase/config";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions

// Import OpenAI API function
const fetchBirthdayMessageFromAI = async (description: string) => {
    const prompt = description
      ? `Write a birthday message for a friend based on the following description: ${description}`
      : "Write a generic birthday message for a friend.(don't mention names))";
    
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, max_tokens: 280 }),
    });
    
    const data = await response.json();
    return data.message; // Assuming the API returns a message in this format
  };
const FriendMessage: React.FC = () => {
  const [isAiMode, setIsAiMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [manualMessage, setManualMessage] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // Track the authenticated user
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardType = searchParams.get("cardtype");

  // Firebase auth check
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
  }, []);

  const handleToggle = () => {
    setIsAiMode(!isAiMode);
    setManualMessage(""); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAiMode && (!name || !email || !birthday || !manualMessage)) {
      setError("Please fill in all the fields.");
      return;
    }

    setError(""); // Clear error message

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

    let finalMessage = manualMessage;

    // If AI Mode is enabled, fetch a message from ChatGPT
    if (isAiMode) {
      try {
        finalMessage = await fetchBirthdayMessageFromAI(aiDescription);
      } catch (error) {
        setError("Error generating AI message. Please try again.");
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

    try {
      if (userId) {
        const friendDocRef = doc(db, `users/${userId}/friends`, uuid);
        await setDoc(friendDocRef, formData);
      }
      
      const cardDocRef = doc(db, `cards`, uuid);
      await setDoc(cardDocRef, formData);
  
      router.push(generatedUrl);
    } catch (error) {
      console.error("Error writing document:", error);
      setError("There was an issue saving the message. Please try again.");
    }


    const today = new Date();
    const todayMonth = today.getMonth() + 1; // Los meses empiezan desde 0, por eso se suma 1
    const todayDay = today.getDate();
    
    // Extraer mes y día del cumpleaños
    const birthdayDate = new Date(birthday); // Convertir el string a objeto Date
    const birthdayMonth = birthdayDate.getUTCMonth() + 1; // Extraer el mes (se suma 1)
    const birthdayDay = birthdayDate.getUTCDate(); // Extraer el día

    // Verificar si el correo es "ximenasaibot@gmail.com" y la fecha coincide (mes y día)
    if (email === "ximenasaibot@gmail.com" && birthdayMonth === todayMonth && birthdayDay === todayDay) {
        const firstName = name // El nombre que quieres pasar
        const link = generatedUrl; // El enlace que quieres pasar
    
        try {
          const res = await fetch('/api/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName,
              link
            }),
          });
    
          const data = await res.json();
          console.log(data);
        } catch (error) {
          console.error("Error sending email:", error);
        }
    } else {
      console.log("No coincide");
    }
  };
  

  return (
    <Suspense>
        <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-white">
          <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
            <nav className="slides-nav__nav rotate-90 transform origin-center">
            <button
                type="button"
                className="slides-nav__prev px-2 py-1 font-mono"
                onClick={() => router.push("/cards")}
              >
                Back
              </button>
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
            {error && <div className="text-red-500 mb-4">{error}</div>}
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
                required={!isAiMode}
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
                required={!isAiMode}
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
    </Suspense>
  );
};

export default FriendMessage;
