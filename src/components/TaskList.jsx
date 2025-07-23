import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../utils/api";
import TaskDetail from "./TaskDetail";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import  db  from "../utils/firebase";


export default function TaskList({
  boardId,
  listId,
  label,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
}) {
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  

  const addTask = () => {
    if (!newTask.trim()) return;
    onAddTask({ title: newTask, status: "todo" }, listId);
    setNewTask("");
    setAdding(false);
  };

  const handleSaveTask = (updatedTask) => {
    onUpdateTask(updatedTask);
    setSelectedTask(null);
  };

useEffect(() => {
  const q = query(
    collection(db, "tasks"),
    where("listId", "==", listId),
    where("boardId", "==", boardId)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const updatedTasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setTasks(updatedTasks);
  });

  return () => unsubscribe();
}, [boardId, listId]);


  return (
    <div className="task-list">
      <h3>{label}</h3>

      <Droppable droppableId={listId}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {(tasks || []).map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    className="task-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div>
                      <div>{task.title}</div>
                      {task.assignedUser?.name && (
                        <small style={{ color: "#555" }}>
                          👤 {task.assignedUser.name}
                        </small>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id, listId);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {adding ? (
        <div>
          <textarea
            rows="2"
            placeholder="Enter a title for this card…"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            autoFocus
          />
          <div>
            <button onClick={addTask}>Add Card</button>
            <button
              onClick={() => {
                setAdding(false);
                setNewTask("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => setAdding(true)} className="add-card">
          + Add a card
        </div>
      )}

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
