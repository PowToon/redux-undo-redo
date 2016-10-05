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

```
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

```
import {createUndoMiddleware} from 'redux-undo-redo'
import {setCurrentCounter, increment, decrement, setCounterValue} from './actions'
import {getCurrentCounter, getCurrentCounterValue} from './selectors'

const undoMiddleware = createUndoMiddleware({
  getViewState: getCurrentCounter,
  setViewState: setCurrentCounter,
  revertingActions: {
    'INCREMENT': (payload) => decrement(),
    'DECREMENT': (payload) => increment(),
    'SET_COUNTER_VALUE': {
      action: (payload, {oldCounterValue}) => setCounterValue(oldCounterValue),
      meta: (state, payload) => ({oldCounterValue: getCurrentCounterValue()})
    }
  }
})
```

createUndoMiddleware take a configuration object with the following fields:

### revertingActions
this is a map between the `action type` and it's reverting action creator, the action creator gets the `payload` field of the original action.
if the `payload` is not enough to create a reverting action, you can provide an object like this:
```
{
  action: (payload, meta) => revertingActionCreator(payload.something, meta.somethingElse),
  meta: (state, payload) => ({somethingElse: state.something})
}
```
the `meta` function runs before the action happens and collects information needed to revert the action. you get this as a second argument for the reverting action creator.

### getViewState and setViewState
this to fields are optional
`getViewState` is a selector like this: `(state) => derivedState`
`setViewState` is an action creator that gets the result of `getViewState` as an argument: `(viewState) => ({type: 'SET_VIEW_STATE', payload: viewState})`
**if you define this selector and action** the middleware will save the before and after view state of every undoable action.
those would be used to dispatch `setViewState` before dispatching the reverting/original action to undo/redo.
this is usful the result of the undoable actions depends on another part of the state.

##TODO:
1. consider to remove usage of payload, it limits to FSA for no reason, but maybe it's a good thing?
2. consider setting `beforeState` after `undo`
3. create example project
