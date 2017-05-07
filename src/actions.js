export function undo() {
  return {type: 'UNDO_HISTORY@UNDO'}
}

export function redo() {
  return {type: 'UNDO_HISTORY@REDO'}
}

export function addUndoItem(action, beforeState, afterState, createArgs) {
  return {
    type: 'UNDO_HISTORY@ADD',
    action,
    beforeState,
    afterState,
    createArgs
  }
}

export function clear() {
  return {
    type: 'UNDO_HISTORY@CLEAR'
  }
}
