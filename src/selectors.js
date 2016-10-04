export const getUndoItem = state => state.undoHistory.undoQueue[0]
export const getRedoItem = state => state.undoHistory.redoQueue[0]
