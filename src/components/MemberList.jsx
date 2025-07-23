import { useEffect, useState } from "react";

export default function MemberList({ boardId }) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch(`/boards/${boardId}/members`)
      .then((res) => res.json())
      .then((data) => setMembers(data));
  }, [boardId]);

  return (
    <div>
      <h3>Members</h3>
      {members.map((m) => (
        <div key={m.id}>
          {m.email_member} — {m.status}
        </div>
      ))}
    </div>
  );
}
