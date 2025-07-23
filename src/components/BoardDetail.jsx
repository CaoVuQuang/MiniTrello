
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteTask, createTask, getLists, createList, deleteList, updateTask, getTasks } from "../utils/api";
import TaskList from "./TaskList";
import { DragDropContext } from "@hello-pangea/dnd";
import { inviteMember as inviteMemberApi } from '../utils/api';

export default function BoardDetail() {
  const { id } = useParams();

  const [lists, setLists] = useState([]);
  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [emailToInvite, setEmailToInvite] = useState("");

const fetchLists = async () => {
  const data = await getLists(id);

  const listsWithTasks = await Promise.all(
    data.map(async (list) => {
      const tasks = await getTasks(id, list.id);
      return { ...list, tasks };
    })
  );

  setLists(listsWithTasks);
};



  useEffect(() => {
    fetchLists();
  }, []);

  const handleAddList = async () => {
    if (!newListName.trim()) return;

    const created = await createList(id, newListName.trim());
    setLists([...lists, created]);
    setNewListName("");
    setAddingList(false);
  };

const onDragEnd = async (result) => {
  const { destination, source, draggableId } = result;

  if (!destination) return;
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return;

  const destListId = destination.droppableId;

  setLists((prevLists) =>
    prevLists.map((list) => {
      if (list.id === source.droppableId) {
        return {
          ...list,
          tasks: list.tasks.filter((task) => task.id !== draggableId),
        };
      }
      if (list.id === destListId) {
        return {
          ...list,
          tasks: [
            ...list.tasks,
            { ...prevLists.find(l => l.id === source.droppableId).tasks.find(t => t.id === draggableId), listId: destListId }
          ],
        };
      }
      return list;
    })
  );

  await updateTask(id, draggableId, { listId: destListId });

  fetchLists();
};


const handleInviteMember = async () => {
  if (!emailToInvite) return;
  try {
    await inviteMemberApi(id, {
      memberId: Date.now().toString(),
      email_member: emailToInvite
    });
    alert("Invitation sent");
    setEmailToInvite("");
  } catch (err) {
    console.error(err);
    alert("Failed to invite member");
  }
};


const handleUpdateTask = async (updatedTask) => {
  if (Array.isArray(updatedTask)) {
    setLists(prev =>
      prev.map(list =>
        list.id === updatedTask[0]?.listId
          ? { ...list, tasks: updatedTask }
          : list
      )
    );
    return;
  }

  await updateTask(id, updatedTask.id, updatedTask);
  setLists(prev =>
    prev.map(list =>
      list.id === updatedTask.listId
        ? {
            ...list,
            tasks: list.tasks.map(t =>
              t.id === updatedTask.id ? updatedTask : t
            )
          }
        : list
    )
  );
};


const handleDeleteTask = async (taskId, listId) => {
  await deleteTask(id, taskId);
  setLists(prev =>
    prev.map(list =>
      list.id === listId
        ? { ...list, tasks: list.tasks.filter(t => t.id !== taskId) }
        : list
    )
  );
};

const handleAddTask = async (newTask, listId) => {
  const created = await createTask(id, { ...newTask, listId });
  setLists(prev =>
    prev.map(list =>
      list.id === listId
        ? { ...list, tasks: [...list.tasks || [], created] }
        : list
    )
  );
};

  return (
    <div className="board-detail">
      <div className="invite-container">
        <input
          type="email"
          className="invite-input"
          value={emailToInvite}
          onChange={(e) => setEmailToInvite(e.target.value)}
          placeholder="Enter email to invite"
        />
        <button onClick={handleInviteMember}>Invite Member</button>

      </div>
      <DragDropContext onDragEnd={onDragEnd}>
<div className="lists-container">
{lists.map((list) => (
          <div key={list.id} className="add-list">
            <TaskList
              boardId={id}
              listId={list.id}
              label={list.name}
              tasks={list.tasks}
              onUpdateTask={() => fetchLists()}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
            />
            <button
              onClick={async () => { await deleteList(id, list.id); fetchLists(); }}
              className="delete-btn"
            >
              🗑
            </button>
          </div>
        ))}

        <div className="add-list">
          {addingList ? (
            <div>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
              />
              <button onClick={handleAddList}>Add</button>
              <button onClick={() => setAddingList(false)}>Cancel</button>
            </div>
          ) : (
            <div onClick={() => setAddingList(true)}>+ Add another list</div>
          )}
        </div>
</div>

        
      </DragDropContext>
    </div>
  );
}
