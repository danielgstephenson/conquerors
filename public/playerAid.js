playerAidDiv = document.getElementById('playerAidDiv')
playerAidDivContent = document.getElementById('playerAidDivContent')

function dragElement (elmnt) {
  const pos1 = 0; const pos2 = 0; const pos3 = 0; const pos4 = 0
  document.getElementById(elmnt.id + 'Header').onmousedown = dragMouseDown
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
<ul>
  <li>Everyone takes 1 gold for each of their bonds</li>
  <li>Put 1 active stock in the market.</li>
  <ul>
    <li>Put one more stock for each more powerful company</li>
  </ul>
  <li>Everyone secretly selects their bid and location</li>
  <ul>
    <li>Place bid gold on right</li>
    <li>Place 1 row card and 1 column card on right/li>
  </ul>
  <li>Highest bidder places a unit at the selected location</li>
  <ul>  
    <li>If the location is occupied or there is tie, trash a unit</li>
  </ul>
  <li>A group is surrounded if it does not neighbor any open node</li>
  <li>Attack: Active company takes surrounded units prisoner</li>
  <ul>
    <li>If units are captured, everyone takes 1 bond</li>
    <li>Palaces always stay on the map</li>
  </ul>
  <li>Retreat: Active company's surrounded units go to trash</li>
  <li>All but lowest bidders pay bid and take stock</li>
  <li>Then, the game ends if any company has</li>
  <ul>
    <li>10 power</li>
    <li>0 units in reserve (10)</li>
    <li>0 stocks in reserve (15 per player)</li>
  </ul>
  <li>Scoring</li>
  <ul>
    <li>points per stock = power</li>
    <li>Tie Breaker: Gold</li>
  </ul>
</ul>
`
