window.Snap.plugin(function (Snap, Element, Paper, global) {
  let shiftDown = false
  let ctrlDown = false

  const intersect = function (a, b) {
    return Snap.path.isBBoxIntersect(a.getBBox(), b.getBBox())
  }

  const isFrozen = bit => {
    const readyButtons = bit.parent().children().filter(x => x.data('file') === 'board/ready')
    const frozen = readyButtons.some(button => {
      if (['back', 'hidden', 'facedown'].includes(button.data('side'))) {
        const screens = bit.parent().children().filter(x => {
          const file = x.data('file')
          if (file) return x.data('file').substr(0, 12) === 'board/screen' && x.data('player') === button.data('player')
          else return false
        })
        return screens.some(screen => intersect(bit, screen))
      }
      return false
    })
    return frozen
  }

  const mouseClick = event => {
    // console.log("mouseClick")
  }

  const dragStart = function (x, y, event) {
    const move = event.button === 0 && !isFrozen(this) && !shiftDown && !ctrlDown && ['card', 'bit'].includes(this.data('type'))
    const turnDown = (event.button === 0 || event.button === 1) && ctrlDown && this.data('twoSided')
    const flip = (((event.button === 0 && shiftDown) || (event.button === 1)) && this.data('twoSided')) || this.data('type') === 'screen'
    const details = this.data('details')
    if (this.data('file') === 'board/nametag') {
      const name = window.prompt('Please enter your name')
      const children = this.children()
      const textbox = children[children.length - 1]
      textbox.attr({ text: name })
      this.data('moved', true)
    }
    if (details && this.data('side') !== 'back') {
      console.log(details)
    }
    if (move) {
      this.data('ot', this.transform().local)
      this.data('dragging', true)
      this.data('rotating', false)
    } else if (turnDown) {
      window.setSide(this, 'facedown')
      this.data('moved', true)
    } else if (flip) {
      window.flipComponent(this)
      this.data('moved', true)
    }
  }

  const dragMove = function (dx, dy, event, x, y) {
    if (this.data('dragging')) {
      this.data('moved', true)
      if (this.data('type') === 'bit' || this.data('type') === 'card') {
        const snapInvMatrix = this.transform().diffMatrix.invert()
        snapInvMatrix.e = 0
        snapInvMatrix.f = 0
        const tdx = snapInvMatrix.x(dx, dy)
        const tdy = snapInvMatrix.y(dx, dy)
        this.transform(`t${tdx},${tdy}${this.data('ot')}`)
      }
    }
  }

  const dragEnd = function () {
    this.data('dragging', false)
  }

  this.onkeydown = event => {
    if (event.key === 'Shift') shiftDown = true
    if (event.key === 'Control') ctrlDown = true
  }

  this.onkeyup = event => {
    if (event.key === 'Shift') shiftDown = false
    if (event.key === 'Control') ctrlDown = false
  }

  Element.prototype.smartdrag = function () {
    this.drag(dragMove, dragStart, dragEnd)
    this.mousedown(mouseClick)
    return this
  }
})
