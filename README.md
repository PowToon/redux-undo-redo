# redux-undo-redo

This package takes a different approach about implementing undo-redo functionality.
Instead of setting a reducer to be undoable, we'll define which actions are undoable and define a reverting action.

Pros:

1. Easily support multiple changes that should be treated as a single undo step. (animation, drag drop)
2. We don't need to save the state, instead we save actions which are usually smaller in size
3. Easily implement "undo actions list" component because we have the list of actions
4. No change to state structure

Cons:

1. Harder implementation than just applying high-order-reducer
2. Developers need to be aware they need to provide reverting actions to support undo (or is it a pro?)

## Usage

add the undoHistoryReducer to your top state

```js
import {combineReducers} from 'redux'
import {undoHistoryReducer} from 'redux-undo-redo'

import {appReducer} from './app'
import {someOtherReducer} from './someOtherModule'

const rootReducer = combineReducers({
  app: appReducer,
  other: someOtherReducer,
  undoHistory: undoHistoryReducer
})
```

create undoMiddleware instance and attach it to the redux store

```js
import {createUndoMiddleware} from 'redux-undo-redo'
import {setCurrentCounter, increment, decrement, setCounterValue} from './actions'
import {getCurrentCounter, getCurrentCounterValue} from './selectors'

const undoMiddleware = createUndoMiddleware({
  getViewState: getCurrentCounter,
  setViewState: setCurrentCounter,
  revertingActions: {
    'INCREMENT': (action) => decrement(),
    'DECREMENT': (action) => increment(),
    'SET_COUNTER_VALUE': {
      action: (action, {oldCounterValue}) => setCounterValue(oldCounterValue),
      createArgs: (state, action) => ({oldCounterValue: getCurrentCounterValue(state)})
    }
  }
})
```

createUndoMiddleware take a configuration object with the following fields:

### revertingActions
This is a map between the `action type` and it's reverting action creator, the action creator gets the original action and should return the reverting action.
If the the original action is not enough to create a reverting action you can provide `createArgs` that will result in an `args` argument for the reverting action:
```js
{
  action: (action, args) => revertingActionCreator(action.something, args.somethingElse),
  createArgs: (state, action) => ({somethingElse: state.something})
}
```
the `createArgs` function runs before the action happens and collects information needed to revert the action.
you get this as a second argument for the reverting action creator.

*Note: "createArgs" was "meta" in previous versions of the library and changed to "createArgs" as it is clearer.* 

### getViewState and setViewState
this to fields are optional
`getViewState` is a selector like this: `(state) => derivedState`
`setViewState` is an action creator that gets the result of `getViewState` as an argument: `(viewState) => ({type: 'SET_VIEW_STATE', viewState})`
**if you define this selector and action** the middleware will save the before and after view state of every undoable action.
those would be used to dispatch `setViewState` before dispatching the reverting/original action to undo/redo.
this is useful in cases where undoable actions depends on another part of the state.

after setting up the reducer and the middleware all you need to do is dispatch the provided actions like in `redux-undo`
```js
import React from 'react'
import { actions as undoActions } from 'redux-undo-redo'
import { connect } from 'react-redux'

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <p>
    <button onClick={onUndo} disabled={!canUndo}>
      Undo
    </button>
    <button onClick={onRedo} disabled={!canRedo}>
      Redo
    </button>
  </p>
)

const mapStateToProps = (state) => ({
  canUndo: state.undoHistory.undoQueue.length > 0,
  canRedo: state.undoHistory.redoQueue.length > 0
})

const mapDispatchToProps = ({
  onUndo: undoActions.undo,
  onRedo: undoActions.redo
})

UndoRedo = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo)
```

[here](https://github.com/powtoon/redux-undo-redo-example) is a complete example

### Limit the undo history
You can limit the number of undo operations stored by the reducer, by using `createUndoHistoryReducer` and passing in the limit:
```js
import {combineReducers} from 'redux'
import {createUndoHistoryReducer} from 'redux-undo-redo'
import {appReducer} from './app'
import {someOtherReducer} from './someOtherModule'

const UNDO_HISTORY_LIMIT = 20

const rootReducer = combineReducers({
  app: appReducer,
  other: someOtherReducer,
  undoHistory: createUndoHistoryReducer(UNDO_HISTORY_LIMIT)
})
```
