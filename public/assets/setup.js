const numPlayers = 5
let tableWidth = 3500
if ([2, 4, 5, 6].includes(numPlayers)) tableWidth = 3500
if ([7, 8].includes(numPlayers)) tableWidth = 4300
if ([9, 10].includes(numPlayers)) tableWidth = 5000
const numBottomRowPlayers = Math.round(numPlayers / 2)
const numTopRowPlayers = numPlayers - numBottomRowPlayers
const topRowOrigins = []
const bottomRowOrigins = []
window.range(numTopRowPlayers).forEach(i => {
  const alpha = (i + 1) / (numTopRowPlayers + 1)
  const x = -tableWidth * alpha + tableWidth * (1 - alpha)
  topRowOrigins.push([x, -1400])
})
window.range(numBottomRowPlayers).forEach(i => {
  const alpha = (i + 1) / (numBottomRowPlayers + 1)
  const x = -tableWidth * alpha + tableWidth * (1 - alpha)
  bottomRowOrigins.push([x, 1400])
})
const origins = topRowOrigins.concat(bottomRowOrigins)

const shuffle = array => array
  .map(item => ({ value: item, priority: Math.random() }))
  .sort((a, b) => a.priority - b.priority)
  .map(x => x.value)

const describeRow = (file, x, y, type, n, length, clones = 0, side = 'front') => window.range(n).map(i => {
  const weight = n > 1 ? i / (n - 1) : 0
  const myX = (x - 0.5 * length) * (1 - weight) + (x + 0.5 * length) * weight
  return window.client.describe({ file, x: myX, y, type, side, clones })
})

const describeColumn = (file, x, y, type, n, length, clones = 0, side = 'front') => window.range(n).map(i => {
  const weight = n > 1 ? i / (n - 1) : 0
  const myY = (y - 0.5 * length) * (1 - weight) + (y + 0.5 * length) * weight
  return window.client.describe({ file, x, y: myY, type, side, clones })
})

const describePortfolio = (x, y, color, player) => {
  let descriptions = []
  const sgn = Math.sign(y)
  const angle = sgn === 1 ? 0 : 90
  descriptions = []
  descriptions = descriptions.concat(window.client.describe({ file: 'card/stock-a', x: x - 600, y: y + sgn * 290, type: 'card' }))
  descriptions = descriptions.concat(window.client.describe({ file: 'card/stock-b', x: x - 400, y: y + sgn * 290, type: 'card' }))
  descriptions = descriptions.concat(window.client.describe({ file: 'card/stock-c', x: x - 200, y: y + sgn * 290, type: 'card' }))
  descriptions.push(window.client.describe({ file: 'board/screen', x: x + 420, y: y, type: 'screen', rotation: angle, player: player }))
  descriptions.push(window.client.describe({ file: 'board/screen', x: x - 420, y: y, type: 'screen', rotation: 270 - angle, player: player }))
  descriptions.push(window.client.describe({ file: 'board/nametag', x: x, y: y + sgn * 490, type: 'board' }))
  descriptions.push(window.client.describe({ file: 'board/ready', x: x, y: y + sgn * 610, type: 'screen', player: player }))
  descriptions = descriptions.concat(describeRow('gold/1', x - 400, y - sgn * 320, 'bit', 6, 450))
  descriptions = descriptions.concat(describeRow('gold/5', x - 600, y - sgn * 180, 'bit', 1, 0))
  descriptions = descriptions.concat(describeRow('gold/4', x - 460, y - sgn * 180, 'bit', 1, 0))
  descriptions = descriptions.concat(describeRow('gold/3', x - 330, y - sgn * 180, 'bit', 1, 0))
  descriptions = descriptions.concat(describeRow('gold/2', x - 205, y - sgn * 180, 'bit', 1, 0))
  descriptions = descriptions.concat(describeRow('gold/bond', x - 560, y + sgn * 500, 'bit', 5, 350))
  window.range(8).forEach(i => {
    descriptions.push(window.client.describe({ file: `card/location-col-${i + 1}`, x: x - 740 + i * 90, y: y - sgn * 10, type: 'bit' }))
  })
  window.range(8).forEach(i => {
    descriptions.push(window.client.describe({ file: `card/location-row-${i + 1}`, x: x - 740 + i * 90, y: y + sgn * 100, type: 'bit' }))
  })
  return (descriptions)
}

const describeBank = (x, y) => {
  let descriptions = []
  descriptions = descriptions.concat(describeRow('gold/1', x, y - 650, 'bit', 3, 300, 10))
  descriptions = descriptions.concat(describeRow('gold/2', x, y - 500, 'bit', 3, 300, 10))
  descriptions = descriptions.concat(describeRow('gold/3', x, y - 340, 'bit', 3, 310, 10))
  descriptions = descriptions.concat(describeRow('gold/4', x, y - 170, 'bit', 3, 320, 10))
  descriptions = descriptions.concat(describeRow('gold/5', x, y - 0, 'bit', 3, 320, 10))
  descriptions = descriptions.concat(describeRow('gold/4', x, y + 170, 'bit', 3, 320, 10))
  descriptions = descriptions.concat(describeRow('gold/3', x, y + 340, 'bit', 3, 310, 10))
  descriptions = descriptions.concat(describeRow('gold/2', x, y + 500, 'bit', 3, 300, 10))
  descriptions = descriptions.concat(describeRow('gold/1', x, y + 650, 'bit', 3, 300, 10))
  return (descriptions)
}

const describeBonds = (x, y) => {
  let descriptions = []
  descriptions = descriptions.concat(describeColumn('gold/bond', x - 150, y, 'bit', 6, 800, numPlayers))
  descriptions = descriptions.concat(describeColumn('gold/bond', x - 0, y, 'bit', 6, 800, numPlayers))
  descriptions = descriptions.concat(describeColumn('gold/bond', x + 150, y, 'bit', 6, 800, numPlayers))
  return (descriptions)
}

const describeCompany = (x, y, letter = 'a') => {
  let descriptions = []
  const cardName = 'card/stock-' + letter
  const unitName = 'unit/' + letter
  const palaceName = 'unit/palace-' + letter
  descriptions = descriptions.concat(describeRow(cardName, x - 150, y, 'card', 5 * numPlayers, 0))
  descriptions = descriptions.concat(describeRow(cardName, x + 0, y, 'card', 5 * numPlayers, 0))
  descriptions = descriptions.concat(describeRow(cardName, x + 150, y, 'card', 5 * numPlayers, 0))
  descriptions = descriptions.concat(describeRow(unitName, x, y + 230, 'bit', 5, 350))
  descriptions = descriptions.concat(describeRow(unitName, x - 50, y + 380, 'bit', 4, 270))
  descriptions = descriptions.concat(window.client.describe({ file: palaceName, x: x + 180, y: y + 380, type: 'bit' }))
  return (descriptions)
}

const getLayer = element => {
  switch (element.type) {
    case 'board': return 1
    case 'card': return 2
    case 'bit': return 3
    case 'screen': return 4
    default: return 0
  }
}

const compareLayers = (a, b) => {
  const aLayer = getLayer(a)
  const bLayer = getLayer(b)
  return aLayer - bLayer
}

window.setup = message => {
  let playerColors = ['purple', 'yellow', 'grey', 'green', 'brown', 'blue', 'orange']
  playerColors = shuffle(playerColors)
  playerColors = playerColors.concat(['red', 'pink', 'white'])
  let descriptions = []
  descriptions = descriptions.concat(window.client.describe({ file: 'board/map', x: 0, y: 0, type: 'board' }))
  descriptions = descriptions.concat(window.client.describe({ file: 'card/stock-a', x: 120, y: 420, type: 'card' }))
  const A = 900
  const B = -780
  const C = 600
  descriptions = descriptions.concat(describeCompany(A, B + 0 * C, 'a'))
  descriptions = descriptions.concat(describeCompany(A, B + 1 * C, 'b'))
  descriptions = descriptions.concat(describeCompany(A, B + 2 * C, 'c'))
  descriptions = descriptions.concat(describeBank(1500, 0))
  descriptions = descriptions.concat(describeBonds(-1550, 0))
  origins.forEach((origin, i) => {
    const x = origin[0]
    const y = origin[1]
    const portfolio = describePortfolio(x, y, playerColors[i], i + 1)
    descriptions = descriptions.concat(portfolio)
  })
  console.log(descriptions)
  descriptions.sort(compareLayers)
  window.client.start(descriptions, message.state)
}
