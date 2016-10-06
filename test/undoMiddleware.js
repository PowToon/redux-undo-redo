import configureStore from 'redux-mock-store'
import {createUndoMiddleware, actions as undoActions} from '../src'

const initialState = {
  counter: 4,
  viewState: true
}

const increment = () => ({type: 'INCREMENT'})
const decrement = () => ({type: 'DECREMENT'})
const setCounterVal = (val) => ({type: 'SET_COUNTER_VAL', payload: {val}})
const notUndoableAction = () => ({type: 'NOT_UNDOABLE'})
const setViewState = viewState => ({type: 'SET_VIEW_STATE', payload: {viewState}})
const getViewState = state => state.viewState
const revertingActions = {
  'INCREMENT': () => decrement(),
  'DECREMENT': () => increment(),
  'SET_COUNTER_VAL': {
    action: (payload, {val}) => setCounterVal(val),
    meta: (state, payload) => ({val: state.counter})
  }
}
const undoMiddleware = createUndoMiddleware({
  getViewState,
  setViewState,
  revertingActions
})
const mockStore = configureStore([undoMiddleware])

const undoMiddlewareWithoutViewState = createUndoMiddleware({
  revertingActions
})
const mockStoreWithoutViewState = configureStore([undoMiddlewareWithoutViewState])

describe('undoMiddleware', function() {
  it('dispatches UNDO_HISTORY@ADD for supported actions', function() {
    const store = mockStore(initialState)
    const action = increment()
    store.dispatch(action)

    expect(store.getActions()).to.eql([
      action,
      undoActions.addUndoItem(action, true, true)
    ])
  })

  it('doesn\'t dispatch UNDO_HISTORY@ADD for un-supported actions', function() {
    const store = mockStore(initialState)
    const action = notUndoableAction()
    store.dispatch(action)

    expect(store.getActions()).to.eql([
      action
    ])
  })

  it('dispatches UNDO_HISTORY@ADD for supported actions with metadata', function() {
    const store = mockStore(initialState)
    const action = setCounterVal(7)
    store.dispatch(action)

    expect(store.getActions()).to.eql([
      action,
      undoActions.addUndoItem(action, true, true, {val: initialState.counter})
    ])
  })

  it('dispatches UNDO_HISTORY@ADD with view states', function() {
    const store = mockStore(initialState)
    const action = setCounterVal(7)
    store.dispatch(action)

    expect(store.getActions()).to.eql([
      action,
      undoActions.addUndoItem(action, true, true, {val: initialState.counter})
    ])
  })

  describe('UNDO_HISTORY@UNDO', function() {
    it('dispatches the reverting action', function() {
      const store = mockStoreWithoutViewState({
        counter: 4,
        viewState: true,
        undoHistory: {
          undoQueue: [{action:increment(), beforeState: undefined, afterState: undefined, meta: undefined}],
          redoQueue: []
        }
      })
      store.dispatch(undoActions.undo())

      expect(store.getActions()).to.eql([
        undoActions.undo(),
        decrement()
      ])
    })

    it('dispatches setViewState', function() {
      const store = mockStore({
        counter: 4,
        viewState: true,
        undoHistory: {
          undoQueue: [{action:increment(), beforeState: false, afterState: true, meta: undefined}],
          redoQueue: []
        }
      })
      store.dispatch(undoActions.undo())

      expect(store.getActions()).to.eql([
        undoActions.undo(),
        setViewState(true),
        decrement(),
        setViewState(false),
      ])
    })
  })

  describe('UNDO_HISTORY@REDO', function() {
    it('dispatches the original action', function() {
      const store = mockStoreWithoutViewState({
        counter: 4,
        viewState: true,
        undoHistory: {
          undoQueue: [],
          redoQueue: [{action:increment(), beforeState: undefined, afterState: undefined, meta: undefined}]
        }
      })
      store.dispatch(undoActions.redo())

      expect(store.getActions()).to.eql([
        undoActions.redo(),
        increment()
      ])
    })

    it('dispatches setViewState', function() {
      const store = mockStore({
        counter: 4,
        viewState: true,
        undoHistory: {
          undoQueue: [],
          redoQueue: [{action:increment(), beforeState: true, afterState: true, meta: undefined}]
        }
      })
      store.dispatch(undoActions.redo())

      expect(store.getActions()).to.eql([
        undoActions.redo(),
        setViewState(true),
        increment()
      ])
    })
  })
})
