describe('undoMiddleware', function() {
  it('dispatches UNDO_HISTORY@ADD for supported actions')
  it('dispatches UNDO_HISTORY@ADD for supported actions with metadata')
  it('dispatches UNDO_HISTORY@ADD with view states')

  describe('UNDO_HISTORY@UNDO', function() {
    it('dispatches the reverting action')
    it('dispatches setViewState')
  })

  describe('UNDO_HISTORY@REDO', function() {
    it('dispatches the original action')
    it('dispatches setViewState')
  })
})
