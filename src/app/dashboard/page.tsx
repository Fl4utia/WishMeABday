"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../db/firebase/config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { deleteStoredCard, getAllStoredCards } from "@/lib/utils/cards";
import { formatScheduledDelivery, isScheduledDeliveryDue } from "@/lib/utils/scheduling";

interface FriendData {
  id: string;
  name: string;
  email: string;
  sendAt?: string;
  emailSentAt?: string;
  message: string;
  cardType: string;
  link: string;
}

function canCancelSending(friend: FriendData): boolean {
  return !friend.emailSentAt;
}

export default function Dashboard() {
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.push("/login");
    });
  };

  // Fetch user's saved cards on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          const friendsCollectionRef = collection(db, `users/${userId}/friends`);
          const friendsSnapshot = await getDocs(friendsCollectionRef);
          const friendsData = friendsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FriendData[];

          setFriends(friendsData);
          return;
        } catch (error) {
          console.warn("Firestore is unavailable, using local card fallback:", error);
        }
      }

      const storedFriends = getAllStoredCards().map((card) => ({
        id: card.id,
        name: card.name,
        email: card.email,
        sendAt: typeof card.sendAt === "string" ? card.sendAt : undefined,
        emailSentAt: typeof card.emailSentAt === "string" ? card.emailSentAt : undefined,
        message: card.message,
        cardType: card.cardType ?? "",
        link: card.link,
      })) as FriendData[];

      setFriends(storedFriends);
    };
    fetchFriends();
  }, []);

  const handleCancelSending = async (friendId: string) => {
    const friend = friends.find((item) => item.id === friendId);
    if (!friend || !canCancelSending(friend)) {
      return;
    }

    const userId = auth.currentUser?.uid;
    if (userId) {
      try {
        const friendDocRef = doc(db, `users/${userId}/friends`, friendId);
        await deleteDoc(friendDocRef);
      } catch (error) {
        console.warn("Unable to delete Firestore entry, removing local copy instead:", error);
      }
    }

    deleteStoredCard(friendId);
    setFriends(friends.filter((friend) => friend.id !== friendId));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-white">
      <section className="slides-nav fixed right-[-5%] md:right-[2%] flex items-center h-full z-10">
        <nav className="slides-nav__nav rotate-90 transform origin-center">
          <button
            className="slides-nav__prev px-2 py-1 font-mono"
            onClick={() => router.push("/cards")}
          >
            Home
          </button>
          <button
            className="slides-nav__next px-2 py-1 font-mono"
            onClick={() => router.push("/dashboard")}
          >
            Cards
          </button>
          <button
            className="slides-nav__next px-2 py-1 font-mono"
            onClick={handleLogout}
          >
              Logout
            </button>
          </nav>
        </section>
      <h1 className="text-2xl slide__title mb-8 text-center">Your cards</h1>
      <div className="overflow-auto h-96 w-full max-w-4xl"> {/* Added container for scrolling */}
        <table className="table-auto w-full text-content text-black">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-6 py-2">Expected Delivery</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Link</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((friend) => (
              <tr key={friend.id} className="border-t">
                <td className="px-4 py-2 max-w-xs truncate">
                  {friend.name}
                </td>
                <td className="px-4 py-2 max-w-xs truncate">
                  {friend.email}
                </td>
                <td className="px-4 py-2 text-sm">
                  {formatScheduledDelivery(friend.sendAt)}
                </td>
                <td className="px-4 py-2 max-w-lg truncate-2-lines items-center">
                  {friend.message}
                </td>
                <td className="px-4 py-2">
                <a
                    href={friend.link}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </td>
                <td className="px-4 py-2">
                  {canCancelSending(friend) ? (
                    <button
                      onClick={() => handleCancelSending(friend.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Cancel Sending
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm">Sent</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
