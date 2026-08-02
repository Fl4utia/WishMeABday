"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../db/firebase/config";
import { formatDeliveryStatus, isScheduledDeliveryDue } from "@/lib/utils/scheduling";

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
  return !friend.emailSentAt && (!friend.sendAt || !isScheduledDeliveryDue(friend.sendAt));
}

export default function Dashboard() {
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid);
      } else {
        setUserId(null);
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

  // Fetch the current user's cards from the server endpoint.
  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) {
        setFriends([]);
        return;
      }

      try {
        const response = await fetch("/api/users/me/friends", {
          headers: {
            "x-user-id": userId,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch cards (${response.status})`);
        }

        const friendsData = (await response.json()) as Array<Partial<FriendData>>;
        const normalizedFriends = friendsData.map((friend) => ({
          id: typeof friend.id === "string" ? friend.id : "",
          name: typeof friend.name === "string" ? friend.name : "",
          email: typeof friend.email === "string" ? friend.email : "",
          sendAt: typeof friend.sendAt === "string" ? friend.sendAt : undefined,
          emailSentAt: typeof friend.emailSentAt === "string" ? friend.emailSentAt : undefined,
          message: typeof friend.message === "string" ? friend.message : "",
          cardType: typeof friend.cardType === "string" ? friend.cardType : "",
          link: typeof friend.link === "string" ? friend.link : "",
        })) as FriendData[];

        setFriends(normalizedFriends);
      } catch (error) {
        console.warn("Failed to fetch current user's cards from the server:", error);
        setFriends([]);
      }
    };

    fetchFriends();
  }, [userId]);

  const handleCancelSending = async (friendId: string) => {
    const friend = friends.find((item) => item.id === friendId);
    if (!friend || !canCancelSending(friend)) {
      return;
    }

    const currentUserId = userId ?? auth.currentUser?.uid;
    if (!currentUserId) {
      return;
    }

    try {
      const response = await fetch(`/api/users/me/friends/${friendId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUserId,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel card (${response.status})`);
      }

      setFriends((prevFriends) => prevFriends.filter((item) => item.id !== friendId));
    } catch (error) {
      console.warn("Unable to cancel card delivery:", error);
    }
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
                  {formatDeliveryStatus(friend.sendAt, friend.emailSentAt)}
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
