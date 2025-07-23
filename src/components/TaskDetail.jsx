import { useEffect, useState } from "react";
import { users } from "../utils/users";


export default function TaskDetail({boardId, cardId, taskId, task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [assignedUser, setAssignedUser] = useState(task.assignedUser?.id || "");
  const [members, setMembers] = useState([]);
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    fetch(`/boards/${boardId}/members`)
      .then((res) => res.json())
      .then(setMembers);

    fetch(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`)
      .then((res) => res.json())
      .then(setAssigned);
  }, []);
  const assignUser = (memberId) => {
    fetch(`/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    }).then(() => {
      setAssigned((prev) => [...prev, memberId]);
    });
  };

  const handleSave = () => {
    const selectedUser = users.find(u => u.id === assignedUser) || null;
    onSave({ ...task, title, description, status, assignedUser: selectedUser });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Task Detail</h2>

        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
    <div>
      <h3>Assign User</h3>
      <select onChange={(e) => assignUser(e.target.value)}>
        <option>--Select--</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.email_member}
          </option>
        ))}
      </select>

      <h4>Assigned:</h4>
      <ul>
        {assigned.map((id) => {
          const user = members.find((m) => m.id === id);
          return <li key={id}>{user?.email_member}</li>;
        })}
      </ul>

    </div>
        <div className="buttons">
          <button className="save" onClick={handleSave}>
            Save
          </button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
        

      </div>
    </div>
  );
}
