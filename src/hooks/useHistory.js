import { useState, useCallback } from 'react';

export function useHistory(initialState) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initialState);
  const [future, setFuture] = useState([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setPast(newPast);
    setFuture([present, ...future]);
    setPresent(previous);
  }, [past, present, future]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  }, [past, present, future]);

  const setContent = useCallback((newState) => {
    setPresent((current) => {
      const nextState = typeof newState === 'function' ? newState(current) : newState;
      setPast((prevPast) => {
        const newPast = [...prevPast, current];
        if (newPast.length > 50) newPast.shift();
        return newPast;
      });
      setFuture([]); // clear future on new edit
      return nextState;
    });
  }, []);

  return { current: present, setContent, undo, redo, canUndo, canRedo };
}
