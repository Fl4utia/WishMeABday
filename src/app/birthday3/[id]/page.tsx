"use client";
import styles from "../../modules/BirthdayCard2.module.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../db/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getStoredCardData } from "@/lib/utils/cards";

const BirthdayCard: React.FC = () => {
  const { id } = useParams();
  const [cardData, setCardData] = useState<{ message: string } | null>(null);
  const [error, setError] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Fetch card data from Firestore using the ID from URL
  useEffect(() => {
    if (id) {
      const fetchCardData = async () => {
        try {
          const response = await fetch(`/api/cards/${id}`);

          if (!response.ok) {
            const storedCardData = getStoredCardData(id as string);
            if (storedCardData) {
              setCardData(storedCardData as { message: string });
              return;
            }

            if (response.status === 404) {
              setError("Card not found.");
              return;
            }

            throw new Error(`Failed to fetch card (${response.status})`);
          }

          const card = (await response.json()) as { message?: string };
          if (card.message) {
            setCardData({ message: card.message });
            return;
          }

          throw new Error("Card response missing message");
        } catch (error) {
          console.warn("Falling back to locally stored card data:", error);
          const storedCardData = getStoredCardData(id as string);
          if (storedCardData) {
            setCardData(storedCardData as { message: string });
          } else {
            setError("Failed to fetch card data.");
          }
        }
      };
      fetchCardData();
    }
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

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
    <div className='fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center'>
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

                <div className={styles.tulips}></div> {/* Tulips section */}
                <div className={styles.teddyBear}></div> {/* Teddy Bear section */}
              </div>
              <div className={styles.back}></div>
            </div>
            <div className={styles.inside}>
            <p className="text-white">{cardData.message}</p>
            <audio  controls >
              <source src="/audios/mañanitas.mp3" type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard;
