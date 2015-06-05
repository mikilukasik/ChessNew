var express = require('express');
var morgan = require('morgan');
var app = express();



app.use(express.static('public'))
app.use(morgan("combined"))


//



//newAi
var dletters = ["a","b","c","d","e","f","g","h"]
var dfigures = ["","King","Queen","Rook","Bishop","Knight","Pawn"]

//this looks like a stinking hack.. 
var dcolors = ["","Black","White"]



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

players[2]=[]
players[3]=[]
players[4]=[]


var lobbyPollNum=0
var lobbyChat=[]
var allChats=[]

var firstFreeTable=2


function getTableData(origTable,isWhite){
	var returnArray=[]		// elso elem az osszes babu ertekenek osszge, aztan az osszes babu koordinataja
	var tableValue=0
	var myTempPieces=[]
	if (isWhite){
		var origColor=2
		var noc=1
	}else{
		var origColor=1
		var noc=2
	}
	for(var lookI=0;lookI<8;lookI++){
		for(var lookJ=0;lookJ<8;lookJ++){
			//alert(thisTempState[lookI][lookJ][0])
			if (origTable[lookI][lookJ][0]==origColor){
				myTempPieces.push([lookI,lookJ,origTable[lookI][lookJ][1]])
				tableValue+=origTable[lookI][lookJ][1]
			}else{
				if (origTable[lookI][lookJ][0]==noc){
					tableValue-=origTable[lookI][lookJ][1]

				}

			}
		}
	}
	returnArray.push(tableValue)
	returnArray.push(myTempPieces)
	return returnArray	// elso elem az osszes babu ertekenek osszge, aztan babkuk

}


function whatsThere(i,j,aiTable){
	var pieceThere=[]

	 //if(aiCalled){
		if (i>=0&&j>=0&&i<8&&j<8) {
			pieceThere.push(aiTable[i][j][0],aiTable[i][j][1],aiTable[i][j][2])
		}

	// }
	// else{
	// 	if (onBoard(j,8-i)) {
	// 		pieceThere.push(table[j][8-i][0],table[j][8-i][1],table[j][8-i][3])
	// 	}
	// }

	return pieceThere
}

function pushAid(x,y,hanyadik,milegyen,fromTable,hit){
	

	if (whatsThere(x,y,fromTable)[hanyadik]==milegyen) {
		
			canMoveTo.push([x,y,whatsThere(x,y,fromTable)[1]])
			
			if(bestHit<whatsThere(x,y,fromTable)[1]){
				bestHit=whatsThere(x,y,fromTable)[1]
				//alert(bestHit)
			}

				//besthit=10}//whatsThere(x,y,fromTable)[1]}
			return true
			
	
	};
	return false
}
function pawnCanMove(k,l,isWhite,moveTable){
	canMoveTo=[]
	//var hitIt=false
	
		//if(aiCalled){
		
		if (isWhite){

			if(pushAid(k,l+1,0,0,moveTable)&&l==1){pushAid(k,l+2,0,0,moveTable)}
			pushAid(k-1,l+1,0,1,moveTable,true)
			pushAid(k+1,l+1,0,1,moveTable,true)

		}else{

			if(pushAid(k,l-1,0,0,moveTable)&&l==6){pushAid(k,l-2,0,0,moveTable)}
			pushAid(k-1,l-1,0,2,moveTable,true)
			pushAid(k+1,l-1,0,2,moveTable,true)

		}

		// }else{
		// 	if(pushAid(k-1,l,0,0)&&k==7){pushAid(k-2,l,0,0)}
		// 	pushAid(k-1,l-1,0,1)
		// 	pushAid(k-1,l+1,0,1)

		// }
		 
	return canMoveTo
		
		
}
// function bPawnCanMove(k,l,isWhite){
// 	canMoveTo=[]
	// var hitIt=false
	
	// 	if(aiCalled){
			// if(pushAid(k,l-1,0,0)&&l==6){pushAid(k,l-2,0,0)}
			// pushAid(k-1,l-1,0,2)
			// pushAid(k+1,l-1,0,2)

		// }else{
		// 	if(pushAid(k+1,l,0,0)&&k==2){pushAid(k+2,l,0,0)}
		// 	pushAid(k+1,l-1,0,2)
		// 	pushAid(k+1,l+1,0,2)

		// }
		 
// 	return canMoveTo
// }

function rookCanMove(k,l,isWhite,moveTable){
	canMoveTo=[]
	// if(aiCalled){

		if(!isWhite){
			var c=2
			var nc=1
		}else{
			var c=1
			var nc=2
		}

	
	// }else {
	// 	if(table[l][8-k][0]==1){
	// 		var c=2
	// 		var nc=1
	// 	}else{
	// 		var c=1
	// 		var nc=2
	// 	}
	// }
	var goFurther=[true,true,true,true]
	for (var moveCount=1;moveCount<8;moveCount++){
		if(goFurther[0]){
			pushAid(k+moveCount,l,0,0,moveTable)
			if (pushAid(k+moveCount,l,0,c,moveTable,true)||whatsThere(k+moveCount,l,moveTable)[0]==nc){goFurther[0]=false}
		}
		if(goFurther[1]){
			pushAid(k-moveCount,l,0,0,moveTable)
			if (pushAid(k-moveCount,l,0,c,moveTable,true)||whatsThere(k-moveCount,l,moveTable)[0]==nc){goFurther[1]=false}
		}
		if(goFurther[2]){
			pushAid(k,l+moveCount,0,0,moveTable)
			if (pushAid(k,l+moveCount,0,c,moveTable,true)||whatsThere(k,l+moveCount,moveTable)[0]==nc){goFurther[2]=false}
		}
		if(goFurther[3]){
			pushAid(k,l-moveCount,0,0,moveTable)
			if (pushAid(k,l-moveCount,0,c,moveTable,true)||whatsThere(k,l-moveCount,moveTable)[0]==nc){goFurther[3]=false}
		}
	}
	return canMoveTo
}
function bishopCanMove(k,l,isWhite,moveTable){
	canMoveTo=[]
	//if(aiCalled){

		if(!isWhite){
			var c=2
			var nc=1
		}else{
			var c=1
			var nc=2
		}

	// }
	// else {
	// 	if(table[l][8-k][0]==1){
	// 		var c=2
	// 		var nc=1
	// 	}else{
	// 		var c=1
	// 		var nc=2
	// 	}
	// }
	var goFurther=[true,true,true,true]
	for (var moveCount=1;moveCount<8;moveCount++){
		if(goFurther[0]){
			pushAid(k+moveCount,l+moveCount,0,0,moveTable)
			if (pushAid(k+moveCount,l+moveCount,0,c,moveTable,true)||whatsThere(k+moveCount,l+moveCount,moveTable)[0]==nc){goFurther[0]=false}
		}
		if(goFurther[1]){
			pushAid(k-moveCount,l+moveCount,0,0,moveTable)
			if (pushAid(k-moveCount,l+moveCount,0,c,moveTable,true)||whatsThere(k-moveCount,l+moveCount,moveTable)[0]==nc){goFurther[1]=false}
		}
		if(goFurther[2]){
			pushAid(k+moveCount,l-moveCount,0,0,moveTable)
			if (pushAid(k+moveCount,l-moveCount,0,c,moveTable,true)||whatsThere(k+moveCount,l-moveCount,moveTable)[0]==nc){goFurther[2]=false}
		}
		if(goFurther[3]){
			pushAid(k-moveCount,l-moveCount,0,0,moveTable)
			if (pushAid(k-moveCount,l-moveCount,0,c,moveTable,true)||whatsThere(k-moveCount,l-moveCount,moveTable)[0]==nc){goFurther[3]=false}
		}
	}
	return canMoveTo
}

function queenCanMove(k,l,isWhite,moveTable){
	canMoveTo=[]
	//if(aiCalled){

		if(!isWhite){
			var c=2
			var nc=1
		}else{
			var c=1
			var nc=2
		}

	// }
	// else {
	// 	if(table[l][8-k][0]==1){
	// 		var c=2
	// 		var nc=1
	// 	}else{
	// 		var c=1
	// 		var nc=2
	// 	}
	// }
	var goFurther=[true,true,true,true,true,true,true,true]
	for (var moveCount=1;moveCount<8;moveCount++){
		if(goFurther[0]){
			pushAid(k+moveCount,l+moveCount,0,0,moveTable)
			if (pushAid(k+moveCount,l+moveCount,0,c,moveTable,true)||whatsThere(k+moveCount,l+moveCount,moveTable)[0]==nc){goFurther[0]=false}
		}
		if(goFurther[1]){
			pushAid(k-moveCount,l+moveCount,0,0,moveTable)
			if (pushAid(k-moveCount,l+moveCount,0,c,moveTable,true)||whatsThere(k-moveCount,l+moveCount,moveTable)[0]==nc){goFurther[1]=false}
		}
		if(goFurther[2]){
			pushAid(k+moveCount,l-moveCount,0,0,moveTable)
			if (pushAid(k+moveCount,l-moveCount,0,c,moveTable,true)||whatsThere(k+moveCount,l-moveCount,moveTable)[0]==nc){goFurther[2]=false}
		}
		if(goFurther[3]){
			pushAid(k-moveCount,l-moveCount,0,0,moveTable)
			if (pushAid(k-moveCount,l-moveCount,0,c,moveTable,true)||whatsThere(k-moveCount,l-moveCount,moveTable)[0]==nc){goFurther[3]=false}
		}

		if(goFurther[4]){
			pushAid(k+moveCount,l,0,0,moveTable)
			if (pushAid(k+moveCount,l,0,c,moveTable,true)||whatsThere(k+moveCount,l,moveTable)[0]==nc){goFurther[4]=false}
		}
		if(goFurther[5]){
			pushAid(k-moveCount,l,0,0,moveTable)
			if (pushAid(k-moveCount,l,0,c,moveTable,true)||whatsThere(k-moveCount,l,moveTable)[0]==nc){goFurther[5]=false}
		}
		if(goFurther[6]){
			pushAid(k,l+moveCount,0,0,moveTable)
			if (pushAid(k,l+moveCount,0,c,moveTable,true)||whatsThere(k,l+moveCount,moveTable)[0]==nc){goFurther[6]=false}
		}
		if(goFurther[7]){
			pushAid(k,l-moveCount,0,0,moveTable)
			if (pushAid(k,l-moveCount,0,c,moveTable,true)||whatsThere(k,l-moveCount,moveTable)[0]==nc){goFurther[7]=false}
		}
	}
	return canMoveTo
}

function kingCanMove(k,l,isWhite,moveTable){
	//sancolni is kene tudni
	canMoveTo=[]

	//if(aiCalled){

		if(!isWhite){
			var c=2
			var nc=1
		}else{
			var c=1
			var nc=2
		}

	// }
	// else {
	// 	if(table[l][8-k][0]==1){
	// 		var c=2
	// 		var nc=1
	// 	}else{
	// 		var c=1
	// 		var nc=2
	// 	}
	// }
	moveCount=1
	pushAid(k+moveCount,l+moveCount,0,0,moveTable)
	pushAid(k-moveCount,l+moveCount,0,0,moveTable)
	pushAid(k+moveCount,l-moveCount,0,0,moveTable)
	pushAid(k-moveCount,l-moveCount,0,0,moveTable)
	pushAid(k+moveCount,l,0,0,moveTable)
	pushAid(k-moveCount,l,0,0,moveTable)
	pushAid(k,l+moveCount,0,0,moveTable)
	pushAid(k,l-moveCount,0,0,moveTable)
	
	pushAid(k+moveCount,l+moveCount,0,c,moveTable,true)
	pushAid(k-moveCount,l+moveCount,0,c,moveTable,true)
	pushAid(k+moveCount,l-moveCount,0,c,moveTable,true)
	pushAid(k-moveCount,l-moveCount,0,c,moveTable,true)
	pushAid(k+moveCount,l,0,c,moveTable,true)
	pushAid(k-moveCount,l,0,c,moveTable,true)
	pushAid(k,l+moveCount,0,c,moveTable,true)
	pushAid(k,l-moveCount,0,c,moveTable,true)
	
	return canMoveTo	
}

function horseCanMove(k,l,isWhite,moveTable){
	
	canMoveTo=[]
	pushAid(k+1,l+2,0,0,moveTable)
	pushAid(k+1,l-2,0,0,moveTable)
	pushAid(k-1,l+2,0,0,moveTable)
	pushAid(k-1,l-2,0,0,moveTable)
	
	pushAid(k+2,l+1,0,0,moveTable)
	pushAid(k+2,l-1,0,0,moveTable)
	pushAid(k-2,l+1,0,0,moveTable)
	pushAid(k-2,l-1,0,0,moveTable)
	
	//if(aiCalled){

		if(!isWhite){
			var c=2
			var nc=1
		}else{
			var c=1
			var nc=2
		}

	// }
	// else {
	// 	if(table[l][8-k][0]==1){
	// 		var c=2
	// 		var nc=1
	// 	}else{
	// 		var c=1
	// 		var nc=2
	// 	}
	// }

	pushAid(k+1,l+2,0,c,moveTable,true)
	pushAid(k+1,l-2,0,c,moveTable,true)
	pushAid(k-1,l+2,0,c,moveTable,true)
	pushAid(k-1,l-2,0,c,moveTable,true)
	
	pushAid(k+2,l+1,0,c,moveTable,true)
	pushAid(k+2,l-1,0,c,moveTable,true)
	pushAid(k-2,l+1,0,c,moveTable,true)
	pushAid(k-2,l-1,0,c,moveTable,true)
	

	
	 return canMoveTo

		
}
function moveArrayToStrings(moveArray){
	var strArray=[]
	moveArray.forEach(function(thisMove){
		strArray.push(dletters[thisMove[0]]+(thisMove[1]+1)+dletters[thisMove[2]]+(1+thisMove[3]))


	})
	return strArray
}	

//var switchCount=0;

function getAllMoves(rawTableData,tableToMoveOn,whiteNext){		// elso elem az osszes babu ertekenek osszge, aztan babkuk
	
	// var moveArrays=[]
	// var moveStrings=[]
	var tableData=rawTableData[1]
	thisArray=[]
	thisStrArray=[]
	//var whiteNext=false
	//if (tableToMoveOn[tableData[0][1]][tableData[0][0]][0]=2){
		//whiteNext=true
	//}


	for(var pieceNo=0;pieceNo<tableData.length;pieceNo++){
		
		// 	var thisString=""
		//switchCount++
		switch (tableData[pieceNo][2]) {
		    // case 0:
		
		    case 1:
		       
		        	
		        		pawnCanMove(tableData[pieceNo][0],tableData[pieceNo][1],whiteNext,tableToMoveOn)
		        			.forEach(function(stepItem){
									thisArray.push([tableData[pieceNo][0],tableData[pieceNo][1],stepItem[0],stepItem[1]])
								})
		        	



		        	// thisArray.push(tableData[pieceNo][0],tableData[pieceNo][1])
		        	// moveArrays.push(pawnCanMove(tableData[pieceNo][0],tableData[pieceNo][1],whiteNext,tableToMoveOn))
		    		
		        break;
		    case 2:
		        //alert("bishop")
		        	bishopCanMove(tableData[pieceNo][0],tableData[pieceNo][1],whiteNext,tableToMoveOn)
		        			.forEach(function(stepItem){
									thisArray.push([tableData[pieceNo][0],tableData[pieceNo][1],stepItem[0],stepItem[1]])
								})
		        	
		        	//console.log(moveArrays)
		        break;
		    case 3:
		        //alert("horse")
		        	horseCanMove(tableData[pieceNo][0],tableData[pieceNo][1],whiteNext,tableToMoveOn)
		        			.forEach(function(stepItem){
									thisArray.push([tableData[pieceNo][0],tableData[pieceNo][1],stepItem[0],stepItem[1]])
								})
		        	
		        	//console.log(moveArrays)
		        break;
		    case 4:
		        //alert("rook")
		        	rookCanMove(tableData[pieceNo][0],tableData[pieceNo][1],whiteNext,tableToMoveOn)
		        			.forEach(function(stepItem){
									thisArray.push([tableData[pieceNo][0],tableData[pieceNo][1],stepItem[0],stepItem[1]])
								})
		        	
		        	//console.log(moveArrays)
		        
		        break;
		    case 5:
		        //alert("queen")
		        	queenCanMove(tableData[pieceNo][0],tableData[pieceNo][1],whiteNext,tableToMoveOn)
		        			.forEach(function(stepItem){
									thisArray.push([tableData[pieceNo][0],tableData[pieceNo][1],stepItem[0],stepItem[1]])
								})
		        	
		        	//console.log(moveArrays)
		        break;
		    case 9:
		    	//alert("king")
		    		kingCanMove(tableData[pieceNo][0],tableData[pieceNo][1],whiteNext,tableToMoveOn)
		        			.forEach(function(stepItem){
									thisArray.push([tableData[pieceNo][0],tableData[pieceNo][1],stepItem[0],stepItem[1]])
								})
		        	//console.log(moveArrays)
		    	break;
		}
		
	}
	//console.log('switch was called: '+switchCount)

	return thisArray
	
}
function validateTable(tableToValidate, wNx){
	bestHit=0
	var myMoves=moveArrayToStrings(getAllMoves(getTableData(tableToValidate,wNx),tableToValidate,wNx))
	var mybest =bestHit
	bestHit=0
	
	//var hisMoves=getAllMoves(getTableData(tableToValidate,!wNx),tableToValidate,!wNx)
	//var hisbest=bestHit
	return [mybest]//,myMoves[0]]
	
}

function createFirstTableState(cfTable,cfColor){
	
	var cfMoves=moveArrayToStrings(getAllMoves(getTableData(cfTable,cfColor),cfTable,cfColor))
	var tempTable=new Array(8)
	var allTempTables=[]
	var opponentsOrigValue=validateTable(cfTable,!cfColor)
	var myOrigValue=validateTable(cfTable,cfColor)

	allTempTables.push([cfColor,fadeConst,0])				//array heading:color,fadeConst(will bw multiplied),howDeep
	
	i=0
	
	cfMoves.forEach(function(stepMove){
		
		tempTable=moveIt(stepMove,cfTable)
		
		var myOrigValue=hitValue
		hitValue=0
	
		tTableValue=myOrigValue-escConst*(validateTable(tempTable,!cfColor)-opponentsOrigValue)+(validateTable(tempTable,cfColor)/2)
		//console.log(tTableValue)
		// allTempTables.push([stepMove,tTableValue])

		//tempTableValue=0
		

		// one deeper

		var cf2Moves=moveArrayToStrings(getAllMoves(getTableData(tempTable,cfColor),tempTable,cfColor))
		//console.log(cf2Moves)
		var tempTable2=new Array(8)
		var tTable2Value=0
		//var allTempTables=[]
		var opponents2OrigValue=validateTable(tempTable,!cfColor)
		var myOrigValue=validateTable(tempTable,cfColor)

		cf2Moves.forEach(function(step2Move,moveNo){

			temp2Table=moveIt(step2Move,tempTable)

			var myOrig2Value=hitValue
			hitValue=0
			
			tTable2Value -=myOrig2Value-(escConst*escConst*(validateTable(temp2Table,!cfColor)-
				opponents2OrigValue)+(validateTable(temp2Table,cfColor)/10)/10)
	
			//alert(tTable2Value)
	
		})



		// deepening ends




		//allTempTables.push([stepMove,tTableValue])









		//totalArrayValue=0

		//aiLoop([tempTable],!cfColor,cfColor,myOrigValue)

		var repValue=tTable2Value/50+tTableValue
		allTempTables.push([stepMove,
		parseInt(repValue*100),parseInt(tTableValue*100),parseInt(tTable2Value*100)])//,tableHitValue]) //row: movestring, ai val, deepen val, deep hit val, [tables]
		
	})
	//console.clear()
	tempstr=""
	if(wNext){
		tempstr="White's move, "
	}else{
		tempstr="Black's move, "
	}	
	//console.log(tempstr+i+' tables generated.')
	allTempTables=allTempTables.sort(sortAiArray)
	return allTempTables
}
function listArray(rankedMoves){
	rankedMoves.forEach(function(thismove){
		console.log(thismove)
	})
}
function sortAiArray(a,b){
	if(typeof(a[0])=="boolean"){
		return -1}
	if(a[1]>b[1]){
		return -1
	}else{
		if(a[1]<b[1]){return +1}
	}

	// if(a[2]>b[2]){
	// 	return -1
	// }else{
	// 	if(a[2]<b[2]){return +1}
	// }

	// if(a[3]>b[3]){
	// 	return -1
	// }else{
	// 	if(a[3]<b[3]){return +1}
	// }
	return 0
}
function ai(wn){
	tableToAi=createFirstTableState(table,wn)

	// tableToAi.forEach(function(tableTo){
	// 	console.log(tableTo[0],tableTo[1],tableTo[2],tableTo[3])
	// })
	//aiLoop([table],1,wn,wn)
	console.clear()
	for (var i=0;i<tableToAi.length;i++)
		console.log(tableToAi[i])
	return tableToAi[1][0]

}

function aimove(){
		console.log('working...')
		table=moveIt(ai(wNext),table)
		showTable()
				// wNext=!wNext
				// wNext=!wNext

			
}
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




		//sancolni se volna rossz
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
// var toPush=  String(allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][0])+allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][1]+moveStr+
// 	allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[3]-1][0]+allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[3]-1][1]


// allMoves[req.query.t].push(toPush)

//itt indil sanc bastyatolas
if(allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][1]==9&&allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][3]){
  	//if(moveStr.substring(2)=="")
  	switch(moveStr.substring(2)){
  		case "c1":
  				allTables[req.query.t]=moveIt("a1d1",allTables[req.query.t])
  			break;
  		
  		case "g1":
  				allTables[req.query.t]=moveIt("h1f1",allTables[req.query.t])
  			break;
  		
  		case "c8":
  				allTables[req.query.t]=moveIt("a8d8",allTables[req.query.t])
  			break;
  		
  		case "g8":
  				allTables[req.query.t]=moveIt("h1f1",allTables[req.query.t])
  			break;

  	}
}
//es itt a vege


//itt indul en passant mark the pawn to be hit




//unmark all first

for (ij=0;ij<8;ij++){ 
	//if(allTables[req.query.t][ij][3][1]==1){
		allTables[req.query.t][ij][3][3]=false
	//}
	//if(allTables[req.query.t][ij][4][1]==1){
		allTables[req.query.t][ij][4][3]=false
	//}
}




if(allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][1]==1&&((moveStr[1]==2&&moveStr[3]==4)||(moveStr[1]==7&&moveStr[3]==5))){ //ha paraszt kettot lep
  	
	allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][3]=true
  	
}
//es itt a vege


//en passt lepett

if(allTables[req.query.t][dletters.indexOf(moveStr[0])][moveStr[1]-1][1]==1&&  //paraszt
	allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[3]-1][0]==0&&	//uresre
	!(moveStr[0]==moveStr[2])){	//keresztbe

		allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[3]-1]=allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[1]-1]
		//allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[3]-1][0]=allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[1]-1][0]//= [0,0,false,false,false]//ures
		allTables[req.query.t][dletters.indexOf(moveStr[2])][moveStr[1]-1]= [0,0,false,false,false]//ures

	}	

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
