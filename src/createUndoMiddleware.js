import {get, includes} from 'lodash'
import {addUndoItem} from './actions'
import {getUndoItem, getRedoItem} from './selectors'

export default function createUndoMiddleware({getViewState, setViewState, revertingActions}) {

  const SUPPORTED_ACTIONS = Object.keys(revertingActions)
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
        dispatch(getUndoAction(undoItem))
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
      if (!acting && includes(SUPPORTED_ACTIONS, action.type)) {
        dispatch(addUndoItem(
          action,
          getViewState && getViewState(state),
          getViewState && getViewState(getState()),
          getUndoMetadata(state, action)
        ))
      }
      break
    }

    return ret
  }

  function getUndoAction(undoItem) {
    const {action, meta} = undoItem
    const {type} = action
    const actionCreator = get(revertingActions[type], 'action', revertingActions[type])
    if (!actionCreator) {
      throw new Error(`Illegal reverting action definition for '${type}'`)
    }
    return actionCreator(action, meta)
  }

  function getUndoMetadata(state, action) {
    const metadataFactory = get(revertingActions[action.type], 'meta')
    return metadataFactory && metadataFactory(state, action)
  }
}
