"use client";
import styles from '../../modules/BirthdayCard.module.css';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Ensure useRouter is imported
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { db, auth } from "../../db/firebase/config"; // Your Firebase config
import { onAuthStateChanged } from "firebase/auth"; // Import to check auth status

const BirthdayCard: React.FC = () => {
  const { id } = useParams(); // Use useParams to get the id
  const [cardData, setCardData] = useState<{ message: string } | null>(null);
  const [error, setError] = useState("");
  const [isAuth, setIsAuth] = useState(false); // Track authentication status
  const router = useRouter();

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user); // Set to true if user exists
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check if id is available
    if (id) {
      const fetchCardData = async () => {
        try {
          // Reference the document with the id in the "cards" collection
          const cardDocRef = doc(db, "cards", id as string);
          const cardDoc = await getDoc(cardDocRef);

          if (cardDoc.exists()) {
            // Set the card data to the state if the document exists
            setCardData(cardDoc.data() as { message: string });
          } else {
            // Set an error if the document doesn't exist
            setError("Card not found.");
          }
        } catch (error) {
          console.error("Error fetching card data:", error);
          setError("Failed to fetch card data.");
        }
      };
      fetchCardData();
    }
  }, [id]); // Only depend on id

  // Display error message if there's an error
  if (error) {
    return <div>{error}</div>;
  }

  // Show loading animation while data is being fetched
  if (!cardData) {
    return (
      <div className="load-wrapp">
        <div className="load-3">
          <p className='text-black'>Loading</p>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
    );
  }

  // Render the birthday card when data is loaded
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-yellow-400 flex items-center justify-center">
      <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
        <nav className="slides-nav__nav rotate-90 transform origin-center">
          {isAuth && (
            <button
              type="button"
              className="slides-nav__prev px-2 py-1 font-mono"
              onClick={() => router.push("/cards")}
            >
              Return home
            </button>
          )}
        </nav>
      </section>
      <div className={styles.containerBg}>
        <div className={styles.card}>
          <div className={styles.outside}>
            <div className={styles.front}>
              <p>Happy Birthday!</p>
              <div className={styles.cake}>
                <div className={styles.topLayer}></div>
                <div className={styles.middleLayer}></div>
                <div className={styles.bottomLayer}></div>
                <div className={styles.candle}></div>
              </div>
            </div>
            <div className={styles.back}></div>
          </div>
          <div className={styles.inside}>
            <p className="text-black">{cardData.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
