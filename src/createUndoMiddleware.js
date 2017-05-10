import {get, includes} from 'lodash'
import {addUndoItem} from './actions'
import {getUndoItem, getRedoItem} from './selectors'

export default function createUndoMiddleware({getViewState, setViewState, revertingActions}) {

  const supportedActions = Object.keys(revertingActions)

  let acting = false

  return ({dispatch, getState}) => (next) => (action) => {
    const state = getState()
    const ret = next(action)

    switch (action.type) {
    case 'UNDO_HISTORY@UNDO': {
      const undoItem = getUndoItem(state)
      if (undoItem) {
        acting = true
        setViewState && dispatch(setViewState(undoItem.afterState))
        dispatch(getUndoAction(undoItem, revertingActions))
        setViewState && dispatch(setViewState(undoItem.beforeState))
        acting = false
      }
    }
      break
    case 'UNDO_HISTORY@REDO': {
      const redoItem = getRedoItem(state)
      if (redoItem) {
        acting = true
        setViewState && dispatch(setViewState(redoItem.beforeState))
        dispatch(redoItem.action)
        acting = false
      }
    }
      break
    default:
      if (!acting && canUndoAction(action, supportedActions)) {
        dispatch(addUndoItem(
          action,
          getViewState && getViewState(state),
          getViewState && getViewState(getState()),
          getUndoArgs(state, action, revertingActions)
        ))
      }
      break
    }

    return ret
  }
}

function getUndoAction(undoItem, revertingActions) {
  const {action, args} = undoItem
  const {type} = action
  const actionCreator = get(revertingActions[type], 'action', revertingActions[type])
  if (!actionCreator) {
    throw new Error(`Illegal reverting action definition for '${type}'`)
  }
  return actionCreator(action, args)
}

function getUndoArgs(state, action, revertingActions) {
  const argsFactory = get(revertingActions[action.type], 'createArgs')
  return argsFactory && argsFactory(state, action)
}

const NO_UNDO_ACTION_PATH = ['meta', 'noUndo']
function canUndoAction(action, supportedActions){
  return (
    includes(supportedActions, action.type) &&
    !get(action, NO_UNDO_ACTION_PATH)
  )
}
