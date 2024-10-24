"use client";
import styles from '../../modules/BirthdayCard1.module.css';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams instead of useRouter
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { db } from "../../db/firebase/config"; // Your Firebase config

const BirthdayCard: React.FC = () => {
  const { id } = useParams(); // Use useParams to get the id
  const [cardData, setCardData] = useState<{ message: string } | null>(null);
  const [error, setError] = useState("");

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

  // Show loading while data is being fetched
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
    <div className='fixed top-0 left-0 w-full h-full bg-blue-400 flex items-center justify-center'>
        <div className={styles.containerBg}>
          <div className={styles.card}>
            <div className={styles.outside}>
              <div className={styles.front}>
                <p>Happy Birthday</p>

                <div className={styles.tulips}></div> {/* Tulips section */}
                <div className={styles.teddyBear}></div> {/* Teddy Bear section */}
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
