var numPlayers = 5
var numCompanies = 3
var goldCardNum = Math.min(numPlayers,10)
var goldCardFile = `card/gold-card-${goldCardNum}`
var tableWidth = 3500
if([2,4,5,6].includes(numPlayers)) tableWidth = 3500
if([7,8].includes(numPlayers)) tableWidth = 4300
if([9,10].includes(numPlayers)) tableWidth = 5000
var numBottomRowPlayers = Math.round(numPlayers/2)
var numTopRowPlayers = numPlayers-numBottomRowPlayers
var topRowOrigins = []
var bottomRowOrigins = []
for(i=0; i<numTopRowPlayers; i++) {
  var alpha = (i+1)/(numTopRowPlayers+1)
  var x = -tableWidth*alpha+tableWidth*(1-alpha)
  topRowOrigins.push([x,-1400])
}
for(i=0; i<numBottomRowPlayers; i++) {
  var alpha = (i+1)/(numBottomRowPlayers+1)
  var x = -tableWidth*alpha+tableWidth*(1-alpha)
  bottomRowOrigins.push([x,1400])
}
origins = topRowOrigins.concat(bottomRowOrigins)



shuffle = v => {
  for(
    var j, x, i = v.length; i; j = parseInt(Math.random() * i),
    x = v[--i],
    v[i] = v[j],
    v[j] = x
  );
  return v;
}

const describeRow = function(file,x,y,type,n,length,clones=0) {
  let descriptions = []
  for(i=0; i<n; i++) {
    var alpha = 0
    if(n>1) alpha = i/(n-1)
    var myX = (x-0.5*length)*(1-alpha) + (x+0.5*length)*alpha
    description = client.describe({file:file,x:myX,y:y,type:type,clones:clones})
    descriptions.push(description)
  }
  return(descriptions)
}

const describeColumn = function(file,x,y,type,n,length,clones=0) {
  let descriptions = []
  for(i=0; i<n; i++) {
    var alpha = 0
    if(n>1) alpha = i/(n-1)
    var myY = (y-0.5*length)*(1-alpha) + (y+0.5*length)*alpha
    description = client.describe({file:file,x:x,y:myY,type:type,clones:clones})
    descriptions.push(description)
  }
  return(descriptions)
}

const describePortfolio = (x,y,color,player) => {
  let descriptions = []
  let sgn = Math.sign(y)
  offset = 0
  angle = 0
  if(sgn==-1) {
    angle = 90
    offset = 1
  }
  descriptions = []
  var W = 300
  var L = 350-W/2
  var R = 350+W/2
  descriptions = descriptions.concat(client.describe({file:'card/stock-a',x:x+L+0/2*W,y:y+sgn*200, type:'card'}))
  descriptions = descriptions.concat(client.describe({file:'card/stock-b',x:x+L+1/2*W,y:y+sgn*200, type:'card'}))
  descriptions = descriptions.concat(client.describe({file:'card/stock-c',x:x+L+2/2*W,y:y+sgn*200, type:'card'}))
  descriptions.push(client.describe({file:'board/ready',  x:x,y:y-sgn*400,type:'screen',player:player}))
  descriptions.push(client.describe({file:'board/screen', x:x+360,y:y,type:'screen',rotation:angle,player:player}))
  descriptions.push(client.describe({file:'board/screen', x:x-360,y:y,type:'screen',rotation:270-angle,player:player}))
  descriptions.push(client.describe({file:'board/screen-box', x:x+360,y:y,type:'board',rotation:angle}))
  descriptions.push(client.describe({file:'board/screen-box', x:x-360,y:y,type:'board',rotation:270-angle}))
  descriptions = descriptions.concat(describeRow('gold/2',x-150,y-sgn*060,'bit',n=1,length=000))
  descriptions = descriptions.concat(describeRow('gold/3',x-280,y-sgn*060,'bit',n=1,length=000))
  descriptions = descriptions.concat(describeRow('gold/4',x-410,y-sgn*060,'bit',n=1,length=000))
  descriptions = descriptions.concat(describeRow('gold/5',x-550,y-sgn*060,'bit',n=1,length=000))
  descriptions = descriptions.concat(describeRow('gold/1',x-350,y-sgn*200,'bit',n=6,length=450))
  descriptions.push(client.describe({file:'board/nametag', x:x,y:y+sgn*430,type:'board'}))
  descriptions = descriptions.concat(describeRow('gold/bond',x-520,y+sgn*430,'bit',n=4,length=350))
  return(descriptions)
} 

const describeBank = (x,y) => {
  var descriptions = []
  descriptions = descriptions.concat(describeRow('gold/1',x,y-650,type='bit',n=3,length=300,clones=10))
  descriptions = descriptions.concat(describeRow('gold/2',x,y-500,type='bit',n=3,length=300,clones=10))
  descriptions = descriptions.concat(describeRow('gold/3',x,y-340,type='bit',n=3,length=310,clones=10))
  descriptions = descriptions.concat(describeRow('gold/4',x,y-170,type='bit',n=3,length=320,clones=10))
  descriptions = descriptions.concat(describeRow('gold/5',x,y-000,type='bit',n=3,length=320,clones=10))
  descriptions = descriptions.concat(describeRow('gold/4',x,y+170,type='bit',n=3,length=320,clones=10))
  descriptions = descriptions.concat(describeRow('gold/3',x,y+340,type='bit',n=3,length=310,clones=10))
  descriptions = descriptions.concat(describeRow('gold/2',x,y+500,type='bit',n=3,length=300,clones=10))
  descriptions = descriptions.concat(describeRow('gold/1',x,y+650,type='bit',n=3,length=300,clones=10))
  return(descriptions)
}

const describeBonds = (x,y) => {
  var descriptions = []
  descriptions = descriptions.concat(describeColumn('gold/bond',x-150,y,type='bit',n=6,length=800,clones=numPlayers))
  descriptions = descriptions.concat(describeColumn('gold/bond',x-000,y,type='bit',n=6,length=800,clones=numPlayers))
  descriptions = descriptions.concat(describeColumn('gold/bond',x+150,y,type='bit',n=6,length=800,clones=numPlayers))
  return(descriptions)
}

const describeCompany = (x,y,letter='a') => {
  var descriptions = []
  cardName = 'card/stock-'+letter
  unitName = 'unit/'+letter
  palaceName = 'unit/palace-'+letter
  descriptions = descriptions.concat(describeRow(cardName,x-150,y,type='card',n=5*numPlayers,length=0))
  descriptions = descriptions.concat(describeRow(cardName,x+000,y,type='card',n=5*numPlayers,length=0))
  descriptions = descriptions.concat(describeRow(cardName,x+150,y,type='card',n=5*numPlayers,length=0))
  descriptions = descriptions.concat(describeRow(unitName,x,y+230,'bit',n=5,length=350))
  descriptions = descriptions.concat(describeRow(unitName,x-50,y+380,'bit',n=4,length=270))
  descriptions = descriptions.concat(client.describe({file:palaceName,x:x+180,y:y+380,type:'bit'}))
  return(descriptions)
}

const compareFunction = (a,b) => {
  aLayer = 1
  bLayer = 1
  if(a.file.substring(0,5)=='board') { aLayer = 0 }
  if(b.file.substring(0,5)=='board') { bLayer = 0 }
  if(a.file.substring(0,4)=='card') { aLayer = 1 }
  if(b.file.substring(0,4)=='card') { bLayer = 1 }
  if(a.file.substring(0,4)=='gold') { aLayer = 2 }
  if(b.file.substring(0,4)=='gold') { bLayer = 2 }
  if(a.file.substring(0,4)=='unit') { aLayer = 3 }
  if(b.file.substring(0,4)=='unit') { bLayer = 3 }
  if(a.file.substring(0,11)=='unit/palace') { aLayer = 4 }
  if(b.file.substring(0,11)=='unit/palace') { bLayer = 4 }
  if(a.file.substring(0,12)=='unit/empress') { aLayer = 5 }
  if(b.file.substring(0,12)=='unit/empress') { bLayer = 5 }
  if(a.file.substring(0,12)=='board/screen') { aLayer = 7 }
  if(b.file.substring(0,12)=='board/screen') { bLayer = 7 }
  return aLayer-bLayer
}

const setup = message => {
  var playerColors = ['purple','yellow','grey','green','brown','blue','orange']
  playerColors = shuffle(playerColors)
  playerColors = playerColors.concat(['red','pink','white'])
  let descriptions = []
  descriptions = descriptions.concat(client.describe({file:'board/map',x:0,y:0,type:'board'}))
  descriptions = descriptions.concat(client.describe({file:'card/stock-a',x:120,y:420,type:'card'}))
  A = 900
  B = -780
  C = 600
  descriptions = descriptions.concat(describeCompany(A,B+0*C,'a'))
  descriptions = descriptions.concat(describeCompany(A,B+1*C,'b'))
  descriptions = descriptions.concat(describeCompany(A,B+2*C,'c'))
  descriptions = descriptions.concat(describeBank(1500,0))
  descriptions = descriptions.concat(describeBonds(-1550,0))
  origins.map((origin,i) => { 
    x = origin[0]
    y = origin[1]
    const portfolio = describePortfolio(x,y,playerColors[i],i+1) 
    descriptions = descriptions.concat(portfolio)
  })
  descriptions.sort(compareFunction)
  console.log(descriptions)
  client.start(descriptions,message.state)
}
