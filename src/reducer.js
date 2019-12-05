import {omitBy, isNil} from 'lodash'

const INITIAL_UNDO_HISTORY_STATE = {
  undoQueue: [],
  redoQueue: []
 }

const unlimitedUndoHistoryReducer = undoHistoryReducerCreator()

export default unlimitedUndoHistoryReducer

export function undoHistoryReducerCreator({undoHistoryLimit} = {}) {

  return (state=INITIAL_UNDO_HISTORY_STATE, action) => {
    const {type, payload: undoItem} = action
    const {undoQueue, redoQueue} = state

    switch(type) {
    case 'UNDO_HISTORY@UNDO':
      {
        return (undoQueue.length === 0) ? state : {
          undoQueue: undoQueue.slice(1),
          redoQueue: [undoQueue[0], ...redoQueue]
        }
      }
    case 'UNDO_HISTORY@REDO':
      {
        return (redoQueue.length === 0) ? state : {
          undoQueue: [redoQueue[0], ...undoQueue],
          redoQueue: redoQueue.slice(1)
        }
      }
    case 'UNDO_HISTORY@ADD':
      {
        const newUndoQueue = [omitBy(undoItem, isNil)]
        undoHistoryLimit ?
          newUndoQueue.push(...undoQueue.slice(0, undoHistoryLimit - 1)) :
          newUndoQueue.push(...undoQueue)

        return {
          undoQueue: newUndoQueue,
          redoQueue: []
        }
      }
    case 'UNDO_HISTORY@CLEAR':
      return INITIAL_UNDO_HISTORY_STATE
    default:
      return state
    }
  }
}
