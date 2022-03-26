playerAidDiv = document.getElementById("playerAidDiv")
playerAidDivContent = document.getElementById("playerAidDivContent")

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    x1 = e.clientX;
    y1 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    x2 = x1 - e.clientX;
    y2 = y1 - e.clientY;
    x1 = e.clientX;
    y1 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - y2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - x2) + "px";
  }
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

dragElement(playerAidDiv);


playerAidDivContent.innerHTML = `
<ul>
  <li>Everyone takes 1 gold for each of their bonds</li>
  <li>Put 1 active stock in the market.</li>
  <ul>
    <li>Put one more stock for each more powerful company</li>
  </ul>
  <li>If there is a tie for the highest bid</li>
  <ul>
    <li>Highest bidders pay 1 gold</li>
    <li>Start the next round</li>
  </ul>
  <li>Middle bidders take stock from company</li>
  <li>Highest bidder places a unit, prisoner, or palace</li>
  <ul>
    <li>Place units or prisoners from the active company anywhere</li>
    <li>Place a palace from the active company on land</li>
  </ul>
  <li>A group is surrounded if it does not neighbor any open node</li>
  <li>Attack: Active company takes surrounded units prisoner</li>
  <ul>
    <li>If units are captured, everyone takes 1 bond</li>
    <li>Palaces always stay on the map</li>
  </ul>
  <li>Retreat: Active company's surrounded units go to trash</li>
  <li>Highest bidder takes stock from market</li>
  <li>All but the lowest bidders pay their own bid</li>
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