const playerAidDiv = document.getElementById('playerAidDiv')
const playerAidDivContent = document.getElementById('playerAidDivContent')

function dragElement (elmnt) {
  document.getElementById(elmnt.id + 'Header').onmousedown = dragMouseDown
  let x1 = 0; let y1 = 0; let x2 = 0; let y2 = 0
  function dragMouseDown (e) {
    e = e || window.event
    e.preventDefault()
    x1 = e.clientX
    y1 = e.clientY
    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
  }
  function elementDrag (e) {
    e = e || window.event
    e.preventDefault()
    x2 = x1 - e.clientX
    y2 = y1 - e.clientY
    x1 = e.clientX
    y1 = e.clientY
    elmnt.style.top = (elmnt.offsetTop - y2) + 'px'
    elmnt.style.left = (elmnt.offsetLeft - x2) + 'px'
  }
  function closeDragElement () {
    document.onmouseup = null
    document.onmousemove = null
  }
}

dragElement(playerAidDiv)

playerAidDivContent.innerHTML = `
<ol>
  <li>Everyone takes 1 gold for each of their bonds</li>
  <li>Put 1 active stock in the market</li>
  <li>Put 1 more stock for each more powerful company</li>
  <li>Everyone secretly selects 1 row card and 1 column card</li>
  <li>Everyone secretly selects their bid</li>
  <li>Everyone reveals all their selections</li>
  <li>If the location is occupied or there is tie, trash an unplaced unit</li>
  <li>Otherwise, highest bidder places a unit at the selected location</li>
  <li>A group is surrounded if it does not neighbor any open node</li>
  <li>Attack: Active company captures surrounded enemy units</li>
  <li>If units are captured, everyone takes 1 bond</li>
  <li>Retreat: Active company's surrounded units retreat to trash</li>
  <li>Middle bidders take 1 stock from deck for each in market</li>
  <li>Highest bidder takes all stock in market</li>
  <li>All but lowest bidders pay their own bid</li>
  <li>The game ends if any company has:</li>
  <ul>
    <li>10 power</li>
    <li>0 units in reserve (10)</li>
    <li>0 stocks in reserve (15 per player)</li>
  </ul>
  <li>Scoring</li>
  <ul>
    <li>1 point per power per stock</li>
    <li>Tie breaker is most gold</li>
  </ul>
</ol>
`
