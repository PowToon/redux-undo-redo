describe('undoHistoryReducer', function() {
  describe('UNDO_HISTORY@UNDO', function() {
    it('removes the first item in the undo queue')
    it('adds the first item in the undo queue to the redo queue')
    it('doesnt change redo queue if undo queue is empty')
  })

  describe('UNDO_HISTORY@REDO', function() {
    it('removes the first item in the redo queue')
    it('adds the first item in the redo queue to the undo queue')
    it('doesnt change undo queue if redo queue is empty')
  })

  describe('UNDO_HISTORY@ADD', function() {
    it('adds items to the undo queue in reverse order')
    it('resets the redo queue')
  })
})

// import {take, takeRight, last, first} from 'lodash'

// import { undoHistoryReducer as reducer } from './reducer'
// import * as actions from './actions'

// describe('undoHistoryReducer', () => {
//   const undoableActions = [
//     {type:'ACTION1'},
//     {type:'ACTION2'},
//     {type:'ACTION3'}
//   ]

//   const initialState = reducer(undefined, {type: '@@INIT'})

//   describe('addUndoItem', () => {
//     it('adds actions to the undo queue', () => {
//       const result = undoableActions.reduce(
//         (state, undoableAction) => reducer(state, actions.addUndoItem(undoableAction)),
//         initialState)

//       expect(result.undoQueue).to.have.members(undoableActions)
//     })

//     it('resets the redo queue', () => {
//       const state = {
//         undoQueue: [],
//         redoQueue: [undoableActions[0]]
//       }

//       const result = reducer(state, actions.addUndoItem(undoableActions[1]))

//       expect(result.redoQueue).to.be.empty
//     })
//   })

//   describe('undo', () => {
//     it ('moves items from undoQueue to redoQueue', () => {
//       const state = undoableActions.reduce(
//         (state, undoableAction) => reducer(state, actions.addUndoItem(undoableAction)),
//         initialState)

//       const result = reducer(state, actions.undo())
//       const result2 = reducer(result, actions.undo())

//       expect(result.undoQueue).to.have.length(2)
//       expect(result.undoQueue).to.include.members(take(undoableActions, 2))
//       expect(result.redoQueue).to.have.length(1)
//       expect(result.redoQueue).to.include(last(undoableActions))

//       expect(result2.undoQueue).to.have.length(1)
//       expect(result2.undoQueue).to.include(first(undoableActions))
//       expect(result2.redoQueue).to.have.length(2)
//       expect(result2.redoQueue).to.include.members(takeRight(undoableActions, 2))
//     })
//   })

//   describe('redo', () => {
//     it ('moves items from redoQueue to undoQueue', () => {
//       let state = undoableActions.reduce(
//         (state, undoableAction) => reducer(state, actions.addUndoItem(undoableAction)),
//         initialState)
//       state = reducer(state, actions.undo())
//       state = reducer(state, actions.undo())

//       const result = reducer(state, actions.redo())
//       const result2 = reducer(result, actions.redo())

//       expect(result.undoQueue).to.have.length(2)
//       expect(result.undoQueue).to.include.members(take(undoableActions, 2))
//       expect(result.redoQueue).to.have.length(1)
//       expect(result.redoQueue).to.include(last(undoableActions))

//       expect(result2.redoQueue).to.be.empty
//       expect(result2.undoQueue).to.include.members(undoableActions)
//     })
//   })
// })
