export function undo() {
  return {type: 'UNDO_HISTORY@UNDO'}
}

export function redo() {
  return {type: 'UNDO_HISTORY@REDO'}
}

export function addUndoItem(action, beforeState, afterState, meta) {
  return {
    type: 'UNDO_HISTORY@ADD',
    action,
    beforeState,
    afterState,
    meta
  }
}

export function clear() {
  return {
    type: 'UNDO_HISTORY@CLEAR'
  }
}
