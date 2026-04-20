import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "./firebase";

const STORAGE_PREFIX = "study-sync-data";

const demoSubjects = [
  {
    id: "subject-1",
    name: "Mathematics",
    focusArea: "Calculus integration",
    mastery: "Learning",
    revisionFrequency: "Daily",
  },
  {
    id: "subject-2",
    name: "Physics",
    focusArea: "Electrostatics problems",
    mastery: "Not Started",
    revisionFrequency: "3 times/week",
  },
  {
    id: "subject-3",
    name: "Computer Science",
    focusArea: "React hooks and state flow",
    mastery: "Strong",
    revisionFrequency: "2 times/week",
  },
];

const demoTasks = [
  {
    id: "task-1",
    title: "Solve 15 integration questions",
    subject: "Mathematics",
    dueDate: "2026-04-22",
    priority: "High",
    status: "In Progress",
    estimatedHours: 2,
  },
  {
    id: "task-2",
    title: "Revise Coulomb's law summary",
    subject: "Physics",
    dueDate: "2026-04-23",
    priority: "Medium",
    status: "Pending",
    estimatedHours: 1,
  },
  {
    id: "task-3",
    title: "Build React Router mini revision",
    subject: "Computer Science",
    dueDate: "2026-04-24",
    priority: "Low",
    status: "Completed",
    estimatedHours: 1,
  },
];

const demoNotes = [
  {
    id: "note-1",
    title: "Hook Revision",
    subject: "Computer Science",
    content: "useState manages local UI state, while useEffect syncs side effects after renders.",
  },
  {
    id: "note-2",
    title: "Electrostatics Formula Sheet",
    subject: "Physics",
    content: "Focus on Coulomb force, electric field intensity, and common sign mistakes.",
  },
];

function keyFor(userId) {
  return `${STORAGE_PREFIX}-${userId}`;
}

function readData(userId) {
  return JSON.parse(localStorage.getItem(keyFor(userId)) || "null");
}

function writeData(userId, value) {
  localStorage.setItem(keyFor(userId), JSON.stringify(value));
}

function buildStats(tasks) {
  const completed = tasks.filter((task) => task.status === "Completed").length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return {
    weeklyHours: tasks.reduce((total, task) => total + Number(task.estimatedHours || 0), 0),
    streak: Math.max(3, completed + 2),
    completionRate,
  };
}

function userCollection(userId, name) {
  return collection(db, "users", userId, name);
}

async function readFirestoreData(userId) {
  const [taskSnapshot, subjectSnapshot, noteSnapshot] = await Promise.all([
    getDocs(query(userCollection(userId, "tasks"))),
    getDocs(query(userCollection(userId, "subjects"))),
    getDocs(query(userCollection(userId, "notes"))),
  ]);

  const tasks = taskSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  const subjects = subjectSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  const notes = noteSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));

  return {
    tasks,
    subjects,
    notes,
    stats: buildStats(tasks),
  };
}

export async function seedStudyData(userId) {
  if (hasFirebaseConfig && db) {
    const currentData = await readFirestoreData(userId);

    if (currentData.tasks.length || currentData.subjects.length || currentData.notes.length) {
      return currentData;
    }

    await Promise.all([
      ...demoTasks.map((task) => addDoc(userCollection(userId, "tasks"), task)),
      ...demoSubjects.map((subject) => addDoc(userCollection(userId, "subjects"), subject)),
      ...demoNotes.map((note) => addDoc(userCollection(userId, "notes"), note)),
    ]);

    return readFirestoreData(userId);
  }

  const existing = readData(userId);

  if (existing) {
    return existing;
  }

  const seeded = {
    tasks: demoTasks,
    subjects: demoSubjects,
    notes: demoNotes,
    stats: buildStats(demoTasks),
  };

  writeData(userId, seeded);
  return seeded;
}

export async function getStudyData(userId) {
  if (hasFirebaseConfig && db) {
    return readFirestoreData(userId);
  }

  const data = readData(userId);
  return {
    ...data,
    stats: buildStats(data.tasks),
  };
}

export async function createTask(userId, payload) {
  if (hasFirebaseConfig && db) {
    await addDoc(userCollection(userId, "tasks"), payload);
    return;
  }

  const data = readData(userId);
  data.tasks.unshift({ ...payload, id: crypto.randomUUID() });
  data.stats = buildStats(data.tasks);
  writeData(userId, data);
}

export async function updateTask(userId, taskId, payload) {
  if (hasFirebaseConfig && db) {
    await updateDoc(doc(db, "users", userId, "tasks", taskId), payload);
    return;
  }

  const data = readData(userId);
  data.tasks = data.tasks.map((task) => (task.id === taskId ? { ...task, ...payload } : task));
  data.stats = buildStats(data.tasks);
  writeData(userId, data);
}

export async function deleteTask(userId, taskId) {
  if (hasFirebaseConfig && db) {
    await deleteDoc(doc(db, "users", userId, "tasks", taskId));
    return;
  }

  const data = readData(userId);
  data.tasks = data.tasks.filter((task) => task.id !== taskId);
  data.stats = buildStats(data.tasks);
  writeData(userId, data);
}

export async function createSubject(userId, payload) {
  if (hasFirebaseConfig && db) {
    await addDoc(userCollection(userId, "subjects"), payload);
    return;
  }

  const data = readData(userId);
  data.subjects.unshift({ ...payload, id: crypto.randomUUID() });
  writeData(userId, data);
}

export async function updateSubject(userId, subjectId, payload) {
  if (hasFirebaseConfig && db) {
    await updateDoc(doc(db, "users", userId, "subjects", subjectId), payload);
    return;
  }

  const data = readData(userId);
  data.subjects = data.subjects.map((subject) =>
    subject.id === subjectId ? { ...subject, ...payload } : subject,
  );
  writeData(userId, data);
}

export async function deleteSubject(userId, subjectId) {
  if (hasFirebaseConfig && db) {
    await deleteDoc(doc(db, "users", userId, "subjects", subjectId));
    return;
  }

  const data = readData(userId);
  data.subjects = data.subjects.filter((subject) => subject.id !== subjectId);
  writeData(userId, data);
}

export async function createNote(userId, payload) {
  if (hasFirebaseConfig && db) {
    await addDoc(userCollection(userId, "notes"), payload);
    return;
  }

  const data = readData(userId);
  data.notes.unshift({ ...payload, id: crypto.randomUUID() });
  writeData(userId, data);
}

export async function updateNote(userId, noteId, payload) {
  if (hasFirebaseConfig && db) {
    await updateDoc(doc(db, "users", userId, "notes", noteId), payload);
    return;
  }

  const data = readData(userId);
  data.notes = data.notes.map((note) => (note.id === noteId ? { ...note, ...payload } : note));
  writeData(userId, data);
}

export async function deleteNote(userId, noteId) {
  if (hasFirebaseConfig && db) {
    await deleteDoc(doc(db, "users", userId, "notes", noteId));
    return;
  }

  const data = readData(userId);
  data.notes = data.notes.filter((note) => note.id !== noteId);
  writeData(userId, data);
}
