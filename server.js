var express = require('express');
var morgan = require('morgan');
var app = express();



app.use(express.static('public'))
app.use(morgan("combined"))


//




var dletters = ["a","b","c","d","e","f","g","h"]
//var dfigures = ["","King","Queen","Rook","Bishop","Knight","Pawn"]

//this looks like a stinking hack.. 
//var dcolors = ["","Black","White"]



var allTables=[]
//var table=[]
var allMoves=[]
// var allStepsStringHTML=""
var allStepsStringHTML=[]

// var pollNum=0
var pollNum=[]
var allWNexts=[]
var players=[]

var playerDisconnectConst=15000

players[0]=[]	//player names

players[1]=[]	//players last polled

players[2]=[]	//bolleans true if game is to start
players[3]=[]	//player colors for new games
players[4]=[]	//table numbers for new games


var lobbyPollNum=0
var lobbyChat=[]
var allChats=[]

var firstFreeTable=2


function moveIt(moveString,intable){
		var thistable=[]
		//var thistable=[]
		for (var i=0;i<8;i++){
			thistable[i]=new Array(8)
			for (var j=0;j<8;j++){
				thistable[i][j]= new Array (4)

				intable[i][j].forEach(function (value,feCount){
					thistable[i][j][feCount]=value
				})
			}
		}
				//itt indil sanc bastyatolas
	if(thistable[dletters.indexOf(moveString[0])][moveString[1]-1][1]==9&&thistable[dletters.indexOf(moveString[0])][moveString[1]-1][3]){
	  	//if(moveString.substring(2)=="")
	  	switch(moveString.substring(2)){
	  		case "c1":
	  				thistable=moveIt("a1d1",thistable)
	  			break;
	  		
	  		case "g1":
	  				thistable=moveIt("h1f1",thistable)
	  			break;
	  		
	  		case "c8":
	  				thistable=moveIt("a8d8",thistable)
	  			break;
	  		
	  		case "g8":
	  				thistable=moveIt("h1f1",thistable)
	  			break;
	
	  	}
	}
	//es itt a vege



//itt indul en passant mark the pawn to be hit




//unmark all first

for (ij=0;ij<8;ij++){ 
	//if(thistable[ij][3][1]==1){
		thistable[ij][3][3]=false
	//}
	//if(thistable[ij][4][1]==1){
		thistable[ij][4][3]=false
	//}
}




if(thistable[dletters.indexOf(moveString[0])][moveString[1]-1][1]==1&&((moveString[1]==2&&moveString[3]==4)||(moveString[1]==7&&moveString[3]==5))){ //ha paraszt kettot lep
  	
	thistable[dletters.indexOf(moveString[0])][moveString[1]-1][3]=true
  	
}
//es itt a vege
//en passt lepett

if(thistable[dletters.indexOf(moveString[0])][moveString[1]-1][1]==1&&  //paraszt
	thistable[dletters.indexOf(moveString[2])][moveString[3]-1][0]==0&&	//uresre
	!(moveString[0]==moveString[2])){	//keresztbe

		thistable[dletters.indexOf(moveString[2])][moveString[3]-1]=thistable[dletters.indexOf(moveString[2])][moveString[1]-1]
		//thistable[dletters.indexOf(moveString[2])][moveString[3]-1][0]=thistable[dletters.indexOf(moveString[2])][moveString[1]-1][0]//= [0,0,false,false,false]//ures
		thistable[dletters.indexOf(moveString[2])][moveString[1]-1]= [0,0,false,false,false]//ures

}	


		hitValue=thistable[dletters.indexOf(moveString[2])][moveString[3]-1][1]					//this will be captured in another function
		// thistable=othistable
		


		if(thistable[dletters.indexOf(moveString[0])][moveString[1]-1][1]==1&&	(				//ha paraszt es
		
		(	thistable[dletters.indexOf(moveString[0])][moveString[1]-1][0]==2&&				//es feher
			moveString[3]==8)	||																//es 8asra lep vagy
			(thistable[dletters.indexOf(moveString[0])][moveString[1]-1][0]==1&&				//vagy fekete
			moveString[3]==1)					)												//1re
		){			
			//
			//console.log(moveString)																		//AKKOR
			thistable[dletters.indexOf(moveString[0])][moveString[1]-1][1]=5  					//kiralyno lett
			//thistable[dletters.indexOf(moveString[0])][moveString[1]-1][5]=queenCanMove  		//ugy is mozog
		}




		
		thistable[dletters.indexOf(moveString[2])][moveString[3]-1]=
			thistable[dletters.indexOf(moveString[0])][moveString[1]-1]
		thistable[dletters.indexOf(moveString[0])][moveString[1]-1]=[0,0,false,false,false]//,blankFunction]
		if(!(thistable[dletters.indexOf(moveString[2])][moveString[3]-1][1]==1)){
			thistable[dletters.indexOf(moveString[2])][moveString[3]-1][3]=false
		}
		//wNext=!wNext
		return thistable
}

app.get('/move', function (req, res) {
  //console.log(req)
  

var moveStr=String(req.query.m)




	var toPush=  String(allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][0])+allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][1]+moveStr+
	allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[3]-1][0]+allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[3]-1][1]


	allMoves[req.query.t].push(toPush)
  	allTables[req.query.t]=moveIt(moveStr,allTables[req.query.t])
  

  var result=allTables[req.query.t]
  pollNum[req.query.t]++
  allWNexts[req.query.t]=!allWNexts[req.query.t]
  
 	res.json({table: result});


});

app.get('/getTable', function (req, res) {
  //console.log(req)
  
  var result=allTables[req.query.t]
  
 	res.json({table: result, next: allWNexts[req.query.t], allmoves: allMoves[req.query.t], chat: allChats[req.query.t], pollnum: pollNum[req.query.t]});

});

app.get('/chat', function (req, res) {
  //console.log(req)
  
  

  allChats[req.query.t].push(req.query.c)
  
  pollNum[req.query.t]++
  
 	res.json({chat: allChats[req.query.t]});

});

app.get('/startGame', function (req, res) {
  //console.log(req)
  // var firstFreeTable=0
  // do{
  // 	firstFreeTable++
  // } while(!(allTables[firstFreeTable]==null))
  var wPNum=players[0].indexOf(req.query.w)
  var bPNum=players[0].indexOf(req.query.b)

  firstFreeTable++

  players[2][wPNum]=true;		//ask wplayer to start game
  players[2][bPNum]=true;		//ask bplayer to start game

  players[3][wPNum]=true;		//will play w
  players[3][bPNum]=false;		//will play w

  players[4][wPNum]=firstFreeTable
  players[4][bPNum]=firstFreeTable



  
  
 	res.json({none: 0});

});

app.get('/lobbyChat', function (req, res) {
  //console.log(req)
  
  

  lobbyChat.push(req.query.c)
  
  lobbyPollNum++
  
 	res.json({lobbychat: lobbyChat});

});

function clearDisconnectedPlayers(){
	for(var i=players.length-1;i>=0;i--){

		if(players[1][i]+playerDisconnectConst<(new Date()).getTime()){
			players[1].splice(i,1)
			players[0].splice(i,1)
			lobbyPollNum++

		}


	}
}

app.get('/getLobby', function (req, res) {
  //console.log(req)
  clearDisconnectedPlayers()
  if(players[0].indexOf(req.query.p)==-1){
  		players[0].push(req.query.p)
  		players[1].push((new Date()).getTime())
  		
  		//players.sort(sortPlayers)
  		lobbyPollNum++
  
  }else{
  		players[1][players[0].indexOf(req.query.p)]=(new Date()).getTime()
  }

  	playerIndex=players[0].indexOf(req.query.p)
  	if(players[2][playerIndex]){
  		//var askToOpen=true;
  		lobbyPollNum++
  		var openTableNum=players[4][playerIndex]
  		var openTableColor=players[3][playerIndex]

  		players[2][playerIndex]=false

  		res.json({players: players[0], lobbypollnum: lobbyPollNum, lobbychat: lobbyChat,
  			asktoopen: true, opentablenum: openTableNum, opentablecolor: openTableColor});


  	}else{
  		res.json({players: players[0], lobbypollnum: lobbyPollNum, lobbychat: lobbyChat,
  			asktoopen: false});

  	}
  	
  
 	//res.json({players: players[0], lobbypollnum: lobbyPollNum, lobbychat: lobbyChat});

});


app.get('/initTable', function (req,res) {


	pollNum[req.query.t]=1

//function initTable(){	
	allWNexts[req.query.t]=true
	allChats[req.query.t]=[]
	allMoves[req.query.t]=[]
	//var tempString=""							
	//var 
	allTables[req.query.t] = new Array(8)							//create 8x8 array
	for (var i = 0; i < 8; i++) {
		allTables[req.query.t][i] = new Array(8)
	}
	


	for(j=2; j<6; j++){ 							//make the blanks blank
		for(i=0; i<8; i++){
			allTables[req.query.t][i][j]=[0,0,false,false,false]//,blankFunction]		
			//[][]=[color,piece,selected,isInItsOriginalPosition for king and rook or CanBeHitEnPass for pawns,highLighted,canMoveTo]
		}
	}




	//wNext=true



	// [3] is isInItsOriginalPosition for king and rook or CanBeHitEnPass for pawns
	
	for (var i = 0; i < 8; i++) {									//row of white pawns
		
		allTables[req.query.t][i][1]=[2,1,false,false,false]//,pawnCanMove]
	}
	for (var i = 0; i < 8; i++) {									//row of black pawns
		allTables[req.query.t][i][6]=[1,1,false,false,false]//,pawnCanMove]
	}
	allTables[req.query.t][0][0]=[2,4,false,true,false]//,rookCanMove]				//rooks
	allTables[req.query.t][7][0]=[2,4,false,true,false]//,rookCanMove]
	allTables[req.query.t][0][7]=[1,4,false,true,false]//,rookCanMove]
	allTables[req.query.t][7][7]=[1,4,false,true,false]//,rookCanMove]

	allTables[req.query.t][1][0]=[2,3,false,true,false]//,horseCanMove]					//knights
	allTables[req.query.t][6][0]=[2,3,false,true,false]//,horseCanMove]
	allTables[req.query.t][1][7]=[1,3,false,true,false]//,horseCanMove]
	allTables[req.query.t][6][7]=[1,3,false,true,false]//,horseCanMove]
	
	allTables[req.query.t][2][0]=[2,2,false,true,false]//,bishopCanMove]				//bishops
	allTables[req.query.t][5][0]=[2,2,false,true,false]//,bishopCanMove]
	allTables[req.query.t][2][7]=[1,2,false,true,false]//,bishopCanMove]
	allTables[req.query.t][5][7]=[1,2,false,true,false]//,bishopCanMove]

	allTables[req.query.t][3][0]=[2,5,false,true,false]//,queenCanMove]				//w queen
	allTables[req.query.t][4][0]=[2,9,false,true,false]//,kingCanMove]				//w king
	
	allTables[req.query.t][3][7]=[1,5,false,true,false]//,queenCanMove]				//b q
	allTables[req.query.t][4][7]=[1,9,false,true,false]//,kingCanMove]				//b k
	
	console.log("initTable done")
	
//}
  console.log(allTables[req.query.t])
  
 
  var result=allTables[req.query.t]

	res.json({table: result});

});


var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});