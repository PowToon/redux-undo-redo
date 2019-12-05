import {undoHistoryReducerCreator, actions} from '../src'

const UNDO_MEMORY_LIMIT_NUMBER = 3

const undoHistoryReducer = undoHistoryReducerCreator({
  undoHistoryLimit: UNDO_MEMORY_LIMIT_NUMBER
})

describe('undoHistoryReducer', function() {
  describe('UNDO_HISTORY@ADD', function() {
    it('adds items to the undo queue in reverse order', function() {
      const initialState = {
        undoQueue: [],
        redoQueue: []
      }
      const undoableActions = [
        {type:'ACTION1'},
        {type:'ACTION2'},
        {type:'ACTION3'}
      ]
      const expectedState = {
        undoQueue: [
          {action: {type:'ACTION3'}},
          {action: {type:'ACTION2'}},
          {action: {type:'ACTION1'}}
        ],
        redoQueue: []
      }

      const result = undoableActions.reduce(
        (state, action) => undoHistoryReducer(state, actions.addUndoItem(action)),
        initialState)

      expect(result).to.eql(expectedState)
    })

    it('resets the redo queue', function() {
      const initialState = {
        undoQueue: [
          {action: {type:'ACTION1'}}
        ],
        redoQueue: [
          {action: {type:'ACTION2'}},
          {action: {type:'ACTION3'}}
        ]
      }
      const action = {type: 'ACTION4'}
      const expectedState = {
        undoQueue: [
          {action: {type:'ACTION4'}},
          {action: {type:'ACTION1'}}
        ],
        redoQueue: []
      }

      const result = undoHistoryReducer(initialState, actions.addUndoItem(action))

      expect(result).to.eql(expectedState)
    })
  })

  it('adds items to the undo queue in reverse order, and removes the oldest when reaches the limit', function() {
    const initialState = {
      undoQueue: [],
      redoQueue: []
    }
    const undoableActions = [
      {type: 'ACTION1'},
      {type: 'ACTION2'},
      {type: 'ACTION3'},
      {type: 'ACTION4'}
    ]
    const expectedState = {
      undoQueue: [
        {action: {type:'ACTION4'}},
        {action: {type:'ACTION3'}},
        {action: {type:'ACTION2'}}
      ],
      redoQueue: []
    }

    const result = undoableActions.reduce(
      (state, action) => undoHistoryReducer(state, actions.addUndoItem(action)),
      initialState)

    expect(result).to.eql(expectedState)
  })

  describe('UNDO_HISTORY@UNDO', function() {
    it('removes the first item in the undo queue', function() {
      const initialState = {
        undoQueue: [
          {action: {type:'ACTION3'}},
          {action: {type:'ACTION2'}},
          {action: {type:'ACTION1'}}
        ],
        redoQueue: []
      }
      const expectedState = {
        undoQueue: [
          {action: {type:'ACTION2'}},
          {action: {type:'ACTION1'}}
        ],
        redoQueue: [
          {action: {type:'ACTION3'}}
        ]
      }

      const result = undoHistoryReducer(initialState, actions.undo())

      expect(result).to.eql(expectedState)
    })

    it('adds the first item in the undo queue to the redo queue', function() {
      const initialState = {
        undoQueue: [
          {action: {type:'ACTION2'}},
          {action: {type:'ACTION1'}}
        ],
        redoQueue: [
          {action: {type:'ACTION3'}}
        ]
      }
      const expectedState = {
        undoQueue: [
          {action: {type:'ACTION1'}}
        ],
        redoQueue: [
          {action: {type:'ACTION2'}},
          {action: {type:'ACTION3'}}
        ]
      }

      const result = undoHistoryReducer(initialState, actions.undo())

      expect(result).to.eql(expectedState)
    })

    it('doesnt change redo queue if undo queue is empty', function() {
      const initialState = {
        undoQueue: [
        ],
        redoQueue: [
          {action: {type:'ACTION2'}},
          {action: {type:'ACTION3'}}
        ]
      }

      const result = undoHistoryReducer(initialState, actions.undo())

      expect(result).to.equal(initialState)
    })
  })

  describe('UNDO_HISTORY@REDO', function() {
    it('removes the first item in the redo queue', function() {
      const initialState = {
        undoQueue: [],
        redoQueue: [
          {action: {type:'ACTION1'}},
          {action: {type:'ACTION3'}},
          {action: {type:'ACTION2'}}
        ]
      }
      const expectedState = {
        undoQueue: [
          {action: {type:'ACTION1'}}
        ],
        redoQueue: [
          {action: {type:'ACTION3'}},
          {action: {type:'ACTION2'}}
        ]
      }

      const result = undoHistoryReducer(initialState, actions.redo())

      expect(result).to.eql(expectedState)
    })

    it('adds the first item in the redo queue to the undo queue', function() {
      const initialState = {
        undoQueue: [
          {action: {type:'ACTION1'}}
        ],
        redoQueue: [
          {action: {type:'ACTION3'}},
          {action: {type:'ACTION2'}}
        ]
      }
      const expectedState = {
        undoQueue: [
          {action: {type:'ACTION3'}},
          {action: {type:'ACTION1'}}
        ],
        redoQueue: [
          {action: {type:'ACTION2'}}
        ]
      }

      const result = undoHistoryReducer(initialState, actions.redo())

      expect(result).to.eql(expectedState)
    })

    it('doesnt change undo queue if redo queue is empty', function() {
      const initialState = {
        undoQueue: [
          {action: {type:'ACTION2'}},
          {action: {type:'ACTION3'}}
        ],
        redoQueue: [
        ]
      }

      const result = undoHistoryReducer(initialState, actions.redo())

      expect(result).to.equal(initialState)
    })
  })
})
