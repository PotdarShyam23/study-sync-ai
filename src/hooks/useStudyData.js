import { useCallback, useEffect, useState } from "react";
import {
  createNote,
  createSubject,
  createTask,
  deleteNote,
  deleteSubject,
  deleteTask,
  getStudyData,
  seedStudyData,
  updateNote,
  updateSubject,
  updateTask,
} from "../services/dataService";

export function useStudyData(userId) {
  const [data, setData] = useState({
    tasks: [],
    subjects: [],
    notes: [],
    stats: {
      weeklyHours: 12,
      streak: 4,
      completionRate: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!userId) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await seedStudyData(userId);
      const nextData = await getStudyData(userId);
      setData(nextData);
    } catch (loadError) {
      setError(loadError.message || "Unable to load study data.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const wrapMutation = useCallback(
    async (action) => {
      if (!userId) {
        return;
      }

      setError("");

      try {
        await action();
        await loadData();
      } catch (mutationError) {
        setError(mutationError.message || "Something went wrong while saving.");
      }
    },
    [loadData, userId],
  );

  return {
    ...data,
    isLoading,
    error,
    refresh: loadData,
    addTask: (payload) => wrapMutation(() => createTask(userId, payload)),
    editTask: (taskId, payload) => wrapMutation(() => updateTask(userId, taskId, payload)),
    removeTask: (taskId) => wrapMutation(() => deleteTask(userId, taskId)),
    addSubject: (payload) => wrapMutation(() => createSubject(userId, payload)),
    editSubject: (subjectId, payload) =>
      wrapMutation(() => updateSubject(userId, subjectId, payload)),
    removeSubject: (subjectId) => wrapMutation(() => deleteSubject(userId, subjectId)),
    addNote: (payload) => wrapMutation(() => createNote(userId, payload)),
    editNote: (noteId, payload) => wrapMutation(() => updateNote(userId, noteId, payload)),
    removeNote: (noteId) => wrapMutation(() => deleteNote(userId, noteId)),
  };
}
