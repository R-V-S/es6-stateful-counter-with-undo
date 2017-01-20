const app = new class App {
  constructor() {
    this.state = new Proxy({}, {set: (o, p, v) => {
        o[p] = v
        Array
          .from(document.querySelectorAll(`[data-bind=${p}]`))
          .forEach( (e) => e.textContent = v )
        return true
    }})
    this.state.count = 0
    
    this.actions = {
      increment: () => ++this.state.count,
      decrement: () => --this.state.count
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
}