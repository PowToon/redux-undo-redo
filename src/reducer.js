const INITIAL_UNDO_HISTORY_STATE = {
  undoQueue: [],
  redoQueue: []
}

export default function undoHistoryReducer(state=INITIAL_UNDO_HISTORY_STATE, action) {
  const {payload, type} = action
  const {undoQueue, redoQueue} = state

  switch(type) {
  case 'UNDO_HISTORY@UNDO':
    {
      return (undoQueue.length == 0) ? state : {
        undoQueue: undoQueue.slice(1),
        redoQueue: [...redoQueue, undoQueue[0]]
      }
    }
  case 'UNDO_HISTORY@REDO':
    {
      return (redoQueue.length == 0) ? state : {
        undoQueue: [...undoQueue, redoQueue[0]],
        redoQueue: redoQueue.slice(1)
      }
    }
  case 'UNDO_HISTORY@ADD':
    {
      return {
        undoQueue: [...undoQueue, payload],
        redoQueue: []
      }
    }
  default:
    return state
  }
}
