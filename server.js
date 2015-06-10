

var express = require('express');
var morgan = require('morgan');
var app = express();


//http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
var fs = require('fs');

// file is included here:
eval(fs.readFileSync('public/brandNewAi.js')+'');
//http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files



app.use(express.static('public'))
app.use(morgan("combined"))



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
players[5]=[]	//opponents name

var lobbyPollNum=0
var lobbyChat=[]
var allChats=[]

var firstFreeTable=0

var aiOn=[]


setInterval(function(){
	
	 	for(var xx=1; xx<allTables.length; xx++){
			 if(aiOn[xx]){
				 console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
				console.log(xx)
					var thisAiMove=ai(allTables[xx],allWNexts[xx])
					if (thisAiMove){
						
						//console.log(thismove)
					   allTables[xx]=moveIt(thisAiMove[1][0],allTables[xx])
					   pollNum[xx]++
					   allWNexts[xx]=!allWNexts[xx]	
					}else{
						initTable[xx]		
					}
				 
				 
				 
			 }
		 }
	
	},2500);





app.get('/move', function (req, res) {
 var moveStr=String(req.query.m)

	var toPush=  String(allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][0])+allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][1]+moveStr+
	allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[3]-1][0]+allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[3]-1][1]

	allMoves[req.query.t].push(toPush)
  	allTables[req.query.t]=moveIt(moveStr,allTables[req.query.t])
	  
	  //trick here:
	 // allTables[req.query.t]=moveIt(ai(allTables[req.query.t],false),allTables[req.query.t])
	   allWNexts[req.query.t]=!allWNexts[req.query.t]
  allTables[req.query.t]=addMovesToTable(allTables[req.query.t],allWNexts[req.query.t])
  // protectPieces(allTables[req.query.t],true)
  // protectPieces(allTables[req.query.t],false)
  
  var result=allTables[req.query.t]
  pollNum[req.query.t]++
 
 	res.json({table: result});

});
// app.get('/getAllMoves', function (req, res) {
//   //console.log(req)
  
//   if(req.query.p==2){
// 	   var result=validateTable(allTables[req.query.t],true,true)
//   }else{
// 	  var result=validateTable(allTables[req.query.t],false,true)
  
//   }
 
//  	res.json({allmoves: result});
// });

app.get('/aiMove', function (req, res) {

  
  if(req.query.p==2){			//2 stands for white
	   var result=ai(allTables[req.query.t],true)
  }else{
	  var result=ai(allTables[req.query.t],false)
	  
  }
  result1=result[1][0]
 
 	res.json({aimove: result1, fulltable: result});

});

app.get('/startAiGame', function (req, res) {

  
  firstFreeTable++
  initTable(firstFreeTable)
  aiOn[firstFreeTable]=true
 
 	res.json({tableno: firstFreeTable});

});
app.get('/getTPollNum', function (req, res) {
  //console.log(req)
  
 // var result=allTables[req.query.t]
  
 	res.json({tablepollnum: pollNum[req.query.t]});

});
app.get('/getTable', function (req, res) {
  //console.log(req)
  
  var result=allTables[req.query.t]
  
 	res.json({table: result, next: allWNexts[req.query.t], allmoves: allMoves[req.query.t], chat: allChats[req.query.t]});//, pollnum: pollNum[req.query.t]});

});



app.get('/chat', function (req, res) {
  //console.log(req)
  
  

  allChats[req.query.t].push(req.query.c)
  
  pollNum[req.query.t]++
  
 	res.json({chat: allChats[req.query.t]});

});

app.get('/startGame', function (req, res) {
 
	var wPNum=players[0].indexOf(req.query.w)
	var bPNum=players[0].indexOf(req.query.b)
	
	firstFreeTable++
	
	players[2][wPNum]=true;		//ask wplayer to start game
	players[2][bPNum]=true;		//ask bplayer to start game
	
	players[3][wPNum]=true;		//will play w
	players[3][bPNum]=false;		//will play b
	
	players[4][wPNum]=firstFreeTable
	players[4][bPNum]=firstFreeTable

	players[5][wPNum]=req.query.b;		//give them the opponents name
	players[5][bPNum]=req.query.w;		
 
 	res.json({none: 0});

});

app.get('/watchGame', function (req, res) {
 
	var viewerNum=players[0].indexOf(req.query.v)
	//var bPNum=players[0].indexOf(req.query.b)
	
	//firstFreeTable++
	
	//players[6][viewerNum]=true;		//ask viewer to open game
	players[2][viewerNum]=true;		//ask viewer to open game
	
	players[3][viewerNum]=true;		//will watch w
	
	players[4][viewerNum]=req.query.t	//tablenum
	
	// will have to give names
	
	// players[7][wPNum]=req.query.b;		//give them the opponents name
	players[5][viewerNum]="Spectator";		//tell lobby to open spect mode
 
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
		var opponentsName=players[5][playerIndex]

  		players[2][playerIndex]=false

  		res.json({players: players[0], lobbypollnum: lobbyPollNum, lobbychat: lobbyChat,
  			asktoopen: true, opentablenum: openTableNum, opentablecolor: openTableColor, opponentsname: opponentsName});


  	}else{
  		res.json({players: players[0], lobbypollnum: lobbyPollNum, lobbychat: lobbyChat,
  			asktoopen: false});

  	}
  	
  
 	//res.json({players: players[0], lobbypollnum: lobbyPollNum, lobbychat: lobbyChat});

});

function initTable(tNo){
		aiOn[tNo]=false
	
	pollNum[tNo]=1

//function initTable(){	
	allWNexts[tNo]=true
	allChats[tNo]=[]
	allMoves[tNo]=[]
	//var tempString=""							
	//var 
	allTables[tNo] = new Array(8)							//create 8x8 array
	for (var i = 0; i < 8; i++) {
		allTables[tNo][i] = new Array(8)
	}
	


	for(j=2; j<6; j++){ 							//make the blanks blank
		for(i=0; i<8; i++){
			allTables[tNo][i][j]=[0,0,false,false,false]//,blankFunction]		
			//[][]=[color,piece,selected,isInItsOriginalPosition for king and rook or CanBeHitEnPass for pawns,highLighted,canMoveTo]
		}
	}




	//wNext=true



	// [3] is isInItsOriginalPosition for king and rook or CanBeHitEnPass for pawns
	
	for (var i = 0; i < 8; i++) {									//row of white pawns
		
		allTables[tNo][i][1]=[2,1,false,false,false]//,pawnCanMove]
	}
	for (var i = 0; i < 8; i++) {									//row of black pawns
		allTables[tNo][i][6]=[1,1,false,false,false]//,pawnCanMove]
	}
	allTables[tNo][0][0]=[2,4,false,true,false]//,rookCanMove]				//rooks
	allTables[tNo][7][0]=[2,4,false,true,false]//,rookCanMove]
	allTables[tNo][0][7]=[1,4,false,true,false]//,rookCanMove]
	allTables[tNo][7][7]=[1,4,false,true,false]//,rookCanMove]

	allTables[tNo][1][0]=[2,3,false,true,false]//,horseCanMove]					//knights
	allTables[tNo][6][0]=[2,3,false,true,false]//,horseCanMove]
	allTables[tNo][1][7]=[1,3,false,true,false]//,horseCanMove]
	allTables[tNo][6][7]=[1,3,false,true,false]//,horseCanMove]
	
	allTables[tNo][2][0]=[2,2,false,true,false]//,bishopCanMove]				//bishops
	allTables[tNo][5][0]=[2,2,false,true,false]//,bishopCanMove]
	allTables[tNo][2][7]=[1,2,false,true,false]//,bishopCanMove]
	allTables[tNo][5][7]=[1,2,false,true,false]//,bishopCanMove]

	allTables[tNo][3][0]=[2,5,false,true,false]//,queenCanMove]				//w queen
	allTables[tNo][4][0]=[2,9,false,true,false]//,kingCanMove]				//w king
	
	allTables[tNo][3][7]=[1,5,false,true,false]//,queenCanMove]				//b q
	allTables[tNo][4][7]=[1,9,false,true,false]//,kingCanMove]				//b k
	
	//console.log("initTable done")
	
//}
  console.log(allTables[tNo])
  
  allTables[tNo]=addMovesToTable(allTables[tNo],true)
  protectPieces(allTables[tNo],true)
  protectPieces(allTables[tNo],false)
}
app.get('/initTable', function (req,res) {

	initTable(req.query.t)
  var result=allTables[req.query.t]

	res.json({table: result});

});//


var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});