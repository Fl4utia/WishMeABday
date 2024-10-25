"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../db/firebase/config"; // Adjust to your Firebase config
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"; // Import for updating and deleting Firestore docs

interface FriendData {
  id: string; // Make sure you store the document ID
  name: string;
  email: string;
  birthday: string;
  mode: string; // AI or Manual
  message: string;
  cardType: string;
  link: string;
}

export default function Dashboard() {
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editFriendId, setEditFriendId] = useState<string | null>(null); // To track which friend is being edited
  const [formData, setFormData] = useState<Partial<FriendData>>({}); // For holding form data during edits
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        // Redirect to login if not authenticated
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

  useEffect(() => {
    const fetchFriends = async () => {
      const userId = auth.currentUser?.uid; // Get the current authenticated user's ID
      if (userId) {
        const friendsCollectionRef = collection(db, `users/${userId}/friends`);
        const friendsSnapshot = await getDocs(friendsCollectionRef);
        const friendsData = friendsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FriendData[];

        setFriends(friendsData);
      }
    };
    fetchFriends();
  }, []);

  // Handle form input changes for editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FriendData) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Function to handle saving updates
  const handleSave = async (friendId: string) => {
    const userId = auth.currentUser?.uid;
    if (userId && formData) {
      const friendDocRef = doc(db, `users/${userId}/friends`, friendId);
      await updateDoc(friendDocRef, formData);
      setEditFriendId(null);
      // Re-fetch friends after update
      const friendsCollectionRef = collection(db, `users/${userId}/friends`);
      const friendsSnapshot = await getDocs(friendsCollectionRef);
      const updatedFriends = friendsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FriendData[];
      setFriends(updatedFriends);
    }
  };

  // Function to handle deleting a friend
  const handleDelete = async (friendId: string) => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const friendDocRef = doc(db, `users/${userId}/friends`, friendId);
      await deleteDoc(friendDocRef);
      setFriends(friends.filter(friend => friend.id !== friendId)); // Remove from state
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
              <th className="px-6 py-2">Birthday</th>
              <th className="px-2 py-2">Mode</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Link</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((friend) => (
              <tr key={friend.id} className="border-t">
                <td className="px-4 py-2 max-w-xs truncate">
                  {editFriendId === friend.id ? (
                    <input
                      type="text"
                      value={formData.name || friend.name}
                      onChange={(e) => handleChange(e, 'name')}
                      className="border p-1"
                    />
                  ) : (
                    friend.name
                  )}
                </td>
                <td className="px-4 py-2 max-w-xs truncate">
                  {editFriendId === friend.id ? (
                    <input
                      type="email"
                      value={formData.email || friend.email}
                      onChange={(e) => handleChange(e, 'email')}
                      className="border p-1"
                    />
                  ) : (
                    friend.email
                  )}
                </td>
                <td className="px-4 py-2 text-sm">
                  {friend.birthday} 
                </td>
                <td className="px-4 py-2 items-center text-sm">
                  {friend.mode === "AI" ? (
                    <img
                      src="https://svgshare.com/i/1Bt7.svg"
                      alt="Spark"
                      title="AI Generated"
                      className="w-4 h-4 items-center"
                    />
                  ) : (
                    "Manual"
                  )}
                </td>
                <td className="px-4 py-2 max-w-lg truncate-2-lines items-center">
                  {editFriendId === friend.id && friend.mode === "MANUAL" ? (
                    <input
                      type="text"
                      value={formData.message || friend.message}
                      onChange={(e) => handleChange(e, 'message')}
                      className="border p-1"
                    />
                  ) : (
                    friend.message
                  )}
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
                <button onClick={() => handleDelete(friend.id)} className="hover:text-red-600">
                <img src='https://svgshare.com/i/1BqM.svg' alt='trash' title='Delete' className="w-4 h-4" />
                </button>
                  {editFriendId === friend.id ? (
                    <button
                      onClick={() => handleSave(friend.id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditFriendId(friend.id)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      Edit
                    </button>
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
