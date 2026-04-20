import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, hasFirebaseConfig } from "./firebase";

const USERS_KEY = "study-sync-users";
const SESSION_KEY = "study-sync-session";

function readUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function persistSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getCurrentSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

export async function registerUser({ name, email, password }) {
  if (hasFirebaseConfig && auth) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    const user = {
      id: credential.user.uid,
      name,
      email: credential.user.email,
    };

    persistSession(user);
    return user;
  }

  const users = readUsers();
  const exists = users.some((user) => user.email === email);

  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
  };

  writeUsers([...users, user]);
  persistSession(user);
  return user;
}

export async function loginUser({ email, password }) {
  if (hasFirebaseConfig && auth) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = {
      id: credential.user.uid,
      name: credential.user.displayName || "Student",
      email: credential.user.email,
    };

    persistSession(user);
    return user;
  }

  const user = readUsers().find((item) => item.email === email && item.password === password);

  if (!user) {
    throw new Error("Invalid email or password. Create a demo account first.");
  }

  persistSession(user);
  return user;
}

export async function logoutUser() {
  if (hasFirebaseConfig && auth) {
    await signOut(auth);
  }
  localStorage.removeItem(SESSION_KEY);
}

export async function updateUserProfile({ name }) {
  const currentUser = getCurrentSession();

  if (!currentUser) {
    throw new Error("No active session found.");
  }

  if (hasFirebaseConfig && auth?.currentUser) {
    await updateProfile(auth.currentUser, { displayName: name });

    const updatedUser = {
      id: auth.currentUser.uid,
      name,
      email: auth.currentUser.email,
    };

    persistSession(updatedUser);
    return updatedUser;
  }

  const users = readUsers().map((user) =>
    user.id === currentUser.id ? { ...user, name } : user,
  );
  const updatedUser = users.find((user) => user.id === currentUser.id);

  writeUsers(users);
  persistSession(updatedUser);
  return updatedUser;
}
