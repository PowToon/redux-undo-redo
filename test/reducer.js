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
