export function undo() {
  return {type: 'UNDO_HISTORY@UNDO'}
}

export function redo() {
  return {type: 'UNDO_HISTORY@REDO'}
}

export function addUndoItem(action, beforeState, afterState, args) {
  return {
    type: 'UNDO_HISTORY@ADD',
    payload: {
      action,
      beforeState,
      afterState,
      args
    }
  }
}

export function clear() {
  return {
    type: 'UNDO_HISTORY@CLEAR'
  }
}
