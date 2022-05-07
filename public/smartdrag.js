Snap.plugin(function (Snap, Element, Paper, global) {
  let shiftDown = false
  let ctrlDown = false

  const intersect = function (a, b) {
    return Snap.path.isBBoxIntersect(a.getBBox(), b.getBBox())
  }

  const isFrozen = bit => {
    readyButtons = bit.parent().children().filter(x => x.data('file') == 'board/ready')
    frozen = false
    readyButtons.forEach(button => {
      if (button.data('side') != 'front') {
        screens = bit.parent().children().filter(x => x.data('file') == 'board/screen' && x.data('player') == button.data('player'))
        screens.forEach(screen => frozen = frozen || intersect(bit, screen))
      }
    })
    return (frozen)
  }

  const mouseClick = event => {
    // console.log("mouseClick")
  }

  const dragStart = function (x, y, event) {
    const move = event.button === 0 && !isFrozen(this) && !shiftDown && !ctrlDown && ['card', 'bit'].includes(this.data('type'))
    const turnDown = event.button === 0 && ctrlDown && this.data('twoSided')
    const flip = event.button === 0 && shiftDown && this.data('twoSided') || this.data('type') === 'screen'
    details = this.data('details')
    console.log(this.data('file'))
    console.log(this.children())
    if (this.data('file') === 'board/nametag') {
      const name = prompt('Please enter your name')
      const children = this.children()
      const textbox = children[children.length - 1]
      console.log(textbox.attr({ text: name }))
      this.data('moved', true)
    }
    if (details && this.data('side') != 'back') {
      console.log(details)
    }
    if (move) {
      this.data('ot', this.transform().local)
      this.data('dragging', true)
      this.data('rotating', false)
    } else if (flip) {
      flipComponent(this)
      this.data('moved', true)
    } else if (turnDown) {
      setSide(this, 'facedown')
      this.data('moved', true)
    }
  }

  const dragMove = function (dx, dy, event, x, y) {
    if (this.data('dragging')) {
      this.data('moved', true)
      if (this.data('type') == 'bit' || this.data('type') == 'card') {
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
    if (event.key == 'Control') ctrlDown = true
  }

  this.onkeyup = event => {
    if (event.key === 'Shift') shiftDown = false
    if (event.key == 'Control') ctrlDown = false
  }

  Element.prototype.smartdrag = function () {
    this.drag(dragMove, dragStart, dragEnd)
    this.mousedown(mouseClick)
    return this
  }
})
