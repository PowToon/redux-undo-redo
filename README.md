# redux-undo-redo

## Usage

create undoMiddleware instance and attach it to the redux store

```
import {createUndoMiddleware} from 'redux-undo-redo'
import {setCurrentCounter, increment, decrement, setCounterValue} from './actions'
import {getCurrentCounter, getCurrentCounterValue} from './selectors'

const undoMiddleware = createUndoMiddleware({
  getViewState: getCurrentCounter,
  setViewState: setCurrentCounter,
  revertingActions: {
    'INCREMENT': decrement,
    'DECREMENT': increment,
    'SET_COUNTER_VALUE': {
      action: (payload, {oldCounterValue}) => setCounterValue(counterValue),
      meta: (state, payload) => ({oldCounterValue: getCurrentCounterValue()})
    }
  }
})
```

##TODO:
1. remove usage of payload, if limits to FSA for no reason
2. finish readme
3. create example project
