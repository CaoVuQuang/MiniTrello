import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading users…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">👥 Users</h2>
      {users.length === 0 && <p>No users found.</p>}

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white text-black p-2 rounded shadow-sm flex justify-between"
          >
            <span>
              <strong>{user.name || "No Name"}</strong> — {user.email}
            </span>
            { }
          </li>
        ))}
      </ul>
    </div>
  );
}
