const app = new class App {
  constructor() {
    this.undoStack = []; this.redoStack = []
    this.state = new Proxy({}, {set: (o, p, v) => {
        if (!this.redoStack.length) { this.undoStack.unshift( Object.assign({}, o) ) }
        o[p] = v
        Array
          .from(document.querySelectorAll(`[data-bind=${p}]`))
          .forEach( (e) => e.textContent = v )
        return true
    }})
    this.state.count = 0
    
    this.actions = {
      increment: this.createAction( () => ++this.state.count ),
      decrement: this.createAction( () => --this.state.count ),
      undo: () => this.moveStack(this.undoStack, this.redoStack),
      redo: () => this.moveStack(this.redoStack, this.undoStack)
    }
    
    document.addEventListener('click', (e) => {
      const action = this.actions[e.target.getAttribute('data-action')]
      if ( action ) { action() }
    })
  }
  
  createAction(action) {
    return new Proxy(action, {apply: action => { 
      this.redoStack = []
      action()
    }})
  }
  
  moveStack(from, to) {
    if (!from.length) { return }
    to.unshift(Object.assign({}, this.state))
    const previousState = from.shift()
    for (let prop in previousState) {
      this.state[prop] = previousState[prop]
    } 
  }
}