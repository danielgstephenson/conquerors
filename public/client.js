/* global io */

window.range = n => [...Array(n).keys()]

window.client = (() => {
  const paper = Snap(window.innerWidth, window.innerHeight)
  const group = paper.group()

  const socket = io({ transports: ['websocket'], upgrade: false })
  const templates = {}
  const components = []
  const backs = []
  const hiddens = []
  const facedowns = []
  const handlers = {}
  const hands = {}

  const panning = false
  let seed = null
  const restartNeeded = false

  const unique = arr => {
    const u = {}
    return arr.filter(v => u[v] = (v !== undefined && !u.hasOwnProperty(v)))
  }

  // Disable Right Click Menu
  document.oncontextmenu = () => false

  // Setup Zoom-Pan-Drag
  paperError = (error, paper) => {
    // console.log(error,paper)
  }
  paper.zpd({ zoom: true, pan: false, drag: false }, paperError)
  paper.zoomTo(0.1, 1000, null, function (err) {
    if (err) console.error(err)
    else console.log('zoom complete')
    paper.panTo(1000, 500, 500, null, function (err) {
      if (err) console.error(err)
      else console.log('pan complete')
    })
  })

  paper.mousedown(event => {
    if (event.button == 2) paper.zpd({ pan: true }, paperError)
  })

  paper.mouseup(event => {
    if (event.button == 2) paper.zpd({ pan: false }, paperError)
  })

  setSide = function (component, side) {
    hidden = hiddens[component.data('hiddenId')]
    back = backs[component.data('backId')]
    facedown = facedowns[component.data('facedownId')]
    console.log('setSide', side)
    if (side == 'hidden') {
      back.attr({ opacity: 0 })
      hidden.attr({ opacity: 1 })
      facedown.attr({ opacity: 0 })
      back.node.style.display = 'none'
      hidden.node.style.display = 'block'
      facedown.node.style.display = 'none'
      component.data('side', 'hidden')
    }
    if (side == 'front') {
      back.attr({ opacity: 0 })
      hidden.attr({ opacity: 0 })
      facedown.attr({ opacity: 0 })
      back.node.style.display = 'none'
      hidden.node.style.display = 'none'
      facedown.node.style.display = 'none'
      component.data('side', 'front')
    }
    if (side == 'back') {
      back.attr({ opacity: 1 })
      hidden.attr({ opacity: 0 })
      facedown.attr({ opacity: 0 })
      back.node.style.display = 'block'
      hidden.node.style.display = 'none'
      facedown.node.style.display = 'none'
      component.data('side', 'back')
    }
    if (side == 'facedown') {
      back.attr({ opacity: 0 })
      hidden.attr({ opacity: 0 })
      facedown.attr({ opacity: 1 })
      back.node.style.display = 'none'
      hidden.node.style.display = 'none'
      facedown.node.style.display = 'block'
      component.data('side', 'facedown')
    }
  }

  flipComponent = function (component) {
    console.log('flip')
    const oldside = component.data('side')
    console.log('oldSide = ' + oldside)
    if (oldside == 'back') setSide(component, 'front')
    if (oldside == 'facedown') setSide(component, 'front')
    if (oldside == 'front') setSide(component, 'hidden')
    if (oldside == 'hidden') setSide(component, 'front')
    console.log('newSide = ' + component.data('side'))
    component.data('moved', true)
  }

  const addFragment = (fragment, x, y, rotation) => {
    const svg = fragment.select('g')
    paper.append(svg)
    const children = paper.children()
    const component = children[children.length - 1]
    const width = component.getBBox().width
    const height = component.getBBox().height
    const startX = x - 0.5 * width
    const startY = y - 0.5 * height
    const startMatrix = component.transform().localMatrix.translate(startX, startY)
    startMatrix.rotate(rotation, width / 2, height / 2)
    component.transform(startMatrix)
    group.add(component)
    return component
  }

  const addComponent = (description) => {
    const { x, y, rotation, type, clones, file, details, side, player } = description
    const template = templates[file]
    const startMatrix = template.transform().localMatrix.translate(x, y)
    for (i = 0; i <= clones; i++) {
      const component = template.clone()
      group.add(component)
      component.node.style.display = 'block'
      component.transform(startMatrix)
      component.transform(`${component.transform().local}r${rotation}`)
      components.push(component)
      component.smartdrag()
      component.data('id', components.length - 1)
      component.data('file', file)
      component.data('type', type)
      component.data('details', details)
      component.data('twoSided', false)
      component.data('player', player)
      twoSided = false
      if (type == 'card') {
        hidden = templates['card/hidden'].clone()
        facedown = templates['card/facedown'].clone()
        back = templates['card/back'].clone()
        twoSided = true
      }
      if (file == 'board/nametag') {
        const textbox = component.text(component.getBBox().width / 2, 760, 'Name Tag')
        textbox.attr({ 'font-size': 100, 'text-anchor': 'middle' })
      }
      if (file == 'board/screen') {
        hidden = templates['board/screen-hidden'].clone()
        facedown = templates['board/screen-facedown'].clone()
        back = templates['board/screen-back'].clone()
        twoSided = true
      }
      if (file == 'board/ready') {
        hidden = templates['board/ready-back'].clone()
        facedown = templates['board/ready-back'].clone()
        back = templates['board/ready-back'].clone()
        twoSided = true
      }
      if (twoSided) {
        component.data('twoSided', true)
        component.data('side', 'front')

        hiddens.push(hidden)
        component.data('hiddenId', hiddens.length - 1)
        group.add(hidden)
        hidden.node.style.display = 'block'
        component.append(hidden)
        hidden.node.style.display = 'none'
        hidden.attr({ opacity: 0 })
        hidden.transform('')

        facedowns.push(facedown)
        component.data('facedownId', facedowns.length - 1)
        group.add(facedown)
        facedown.node.style.display = 'block'
        component.append(facedown)
        facedown.node.style.display = 'none'
        facedown.attr({ opacity: 0 })
        facedown.transform('')

        backs.push(back)
        component.data('backId', backs.length - 1)
        group.add(back)
        back.node.style.display = 'block'
        component.append(back)
        back.node.style.display = 'none'
        back.attr({ opacity: 0 })
        back.transform('')

        if (side == 'facedown') setSide(component, 'facedown')
      }
    }
  }

  const setupTemplate = (file, descriptions, updates, numTemplates) => fragment => {
    const template = addFragment(fragment, 0, 0, 0)
    template.node.style.display = 'none'
    templates[file] = template
    if (Object.keys(templates).length === numTemplates) {
      descriptions.map(description => addComponent(description))
      updates.map(processUpdate)
      setInterval(updateServer, 400)
    }
  }

  const start = (descriptions, updates) => {
    let files = unique(descriptions.map(item => item.file))
    const backFiles = [
      'card/back', 'card/hidden', 'card/facedown',
      'board/screen-back', 'board/screen-hidden', 'board/screen-facedown',
      'board/ready-back'
    ]
    files = files.concat(backFiles)
    files.map(file => Snap.load(`assets/${file}.svg`, setupTemplate(file, descriptions, updates, files.length)))
  }

  const describe = options => {
    const description = { file: null, x: 0, y: 0, type: 'bit', clones: 0, rotation: 0, player: 0 }
    return Object.assign(description, options)
  }

  const on = (name, handler) => (handlers[name] = handler)

  const updateServer = () => {
    const msg = { updates: [], seed: seed }
    components.map(component => {
      if (component.data('moved')) {
        const bitUpdate = {
          id: component.data('id'),
          side: component.data('side'),
          local: component.transform().local,
          text: ''
        }
        if (component.data('file') == 'board/nametag') {
          const children = component.children()
          const textbox = children[children.length - 1]
          bitUpdate.text = textbox.attr('text')
        }
        if (handlers.moved) {
          Object.assign(bitUpdate, handlers.moved(component))
        }
        msg.updates.push(bitUpdate)
        component.data('moved', false)
      }
    })
    if (msg.updates.length > 0) socket.emit('updateServer', msg)
  }

  const processUpdate = update => {
    if (update) {
      console.log(update)
      const component = components[update.id]
      component.stop()
      component.animate({ transform: update.local }, 400)
      if (handlers.update) handlers.update(update)
      if (update.side == 'facedown') setSide(component, 'facedown')
      if (update.side == 'hidden') setSide(component, 'back')
      if (update.side == 'front') setSide(component, 'front')
      if (component.data('file') == 'board/nametag') {
        const children = component.children()
        const textbox = children[children.length - 1]
        textbox.attr({ text: update.text })
      }
      console.log(update)
    }
  }

  socket.on('connect', () => {
    console.log('sessionid =', socket.id)

    socket.on('updateClient', msg => {
      console.log('updateClient')
      if (msg.seed === seed) msg.updates.map(processUpdate)
    })

    socket.on('setup', msg => {
      if (!seed) {
        seed = msg.seed
        Math.seedrandom(seed)
        console.log('seed = ' + seed)
        window.setup(msg)
        paper.panTo(-500, 1100)
      } else {
        console.log('Restart Needed')
      }
    })
  })

  return { describe, start, bits: components, on }
})()
