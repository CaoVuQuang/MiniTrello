import db from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

//BOARDS
export const getBoards = async () => {
  const snapshot = await getDocs(collection(db, "boards"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createBoard = async (name, description = "") => {
  const docRef = await addDoc(collection(db, "boards"), { name, description });
  return { id: docRef.id, name, description };
};

export const deleteBoard = async (boardId) => {
  const listsSnap = await getDocs(
    query(collection(db, "lists"), where("boardId", "==", boardId))
  );
  const tasksSnap = await getDocs(
    query(collection(db, "tasks"), where("boardId", "==", boardId))
  );

  await Promise.all(listsSnap.docs.map((docSnap) => deleteDoc(docSnap.ref)));
  await Promise.all(tasksSnap.docs.map((docSnap) => deleteDoc(docSnap.ref)));

  await deleteDoc(doc(db, "boards", boardId));
};

//LISTS
export const getLists = async (boardId) => {
  const q = query(collection(db, "lists"), where("boardId", "==", boardId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createList = async (boardId, name) => {
  const docRef = await addDoc(collection(db, "lists"), {
    boardId,
    name,
    tasks: [],
  });
  return { id: docRef.id, name };
};

export const deleteList = async (boardId, listId) => {
  const tasksSnap = await getDocs(
    query(
      collection(db, "tasks"),
      where("boardId", "==", boardId),
      where("listId", "==", listId)
    )
  );

  await Promise.all(tasksSnap.docs.map((docSnap) => deleteDoc(docSnap.ref)));

  await deleteDoc(doc(db, "lists", listId));
};

//TASKS
export const getTasks = async (boardId, listId) => {
  const q = query(
    collection(db, "tasks"),
    where("boardId", "==", boardId),
    where("listId", "==", listId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createTask = async (boardId, task) => {
  const docRef = await addDoc(collection(db, "tasks"), {
    ...task,
    boardId,
  });
  return { id: docRef.id, ...task };
};

export const deleteTask = async (boardId, taskId) => {
  await deleteDoc(doc(db, "tasks", taskId));
};

export const updateTask = async (boardId, taskId, updatedData) => {
  console.log("updateTask →", boardId, taskId, updatedData);
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, updatedData);
};


const API_URL = 'http://localhost:3001';

export const inviteMember = async (boardId, member) => {
  const res = await fetch(`${API_URL}/boards/${boardId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member),
  });
  if (!res.ok) throw new Error('Failed to invite member');
  return res.json();
};
