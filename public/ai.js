

function canMove(what,k,l,isWhite,moveTable){
	var possibleMoves=[]
	switch (what) {
	    // case 0:
	
	    case 1:
	       
	        	
	        		possibleMoves= pawnCanMove(k,l,isWhite,moveTable)
	        			
	    		
	        break;
	    case 2:
	        		possibleMoves= bishopCanMove(k,l,isWhite,moveTable)
	        		
	        break;
	    case 3:
	        		possibleMoves= horseCanMove(k,l,isWhite,moveTable)
	        		
	        break;
	    case 4:
	       			possibleMoves= rookCanMove(k,l,isWhite,moveTable)
	        		
	        
	        break;
	    case 5:
	        		possibleMoves= queenCanMove(k,l,isWhite,moveTable)
	        		
	        break;
	    case 9:
	    			possibleMoves= kingCanMove(k,l,isWhite,moveTable)
	        		
	    	break;
	
		
	}
	
	for(var  i=possibleMoves.length-1;i>=0;i--){							//sakkba nem lephetunk
		if(validateTable(moveIt(coordsToMoveString(k,l,possibleMoves[i][0],possibleMoves[i][1]),moveTable),!isWhite)==9){
			possibleMoves.splice(i,1)
		}
	}
	


	if (what==9&&moveTable[k][l][3]){					//lesznek sanc lepesek is a possibleMoves tombben
		if(validateTable(moveTable,!isWhite)==9){		// de sakkban allunk
			for(var spliceCount=possibleMoves.length-1; spliceCount>=0; spliceCount--){
				if(possibleMoves[spliceCount][1]==l&&(possibleMoves[spliceCount][0]==k-2||possibleMoves[spliceCount][0]==k+2)){
					possibleMoves.splice(spliceCount,1)
				}
			}

		}


		// remove the sakkot atugrani sem er
		var removeKmin2=true
		var removeKplus2=true
		var removeThis=false
		for(var  i=possibleMoves.length-1;i>=0;i--){
			if(possibleMoves[i][1]==l&&possibleMoves[i][0]==k-1) removeKmin2=false
			if(possibleMoves[i][1]==l&&possibleMoves[i][0]==k+1) removeKplus2=false
		}

		for(var  i=possibleMoves.length-1;i>=0;i--){
			if(possibleMoves[i][1]==l&&possibleMoves[i][0]==k-2&&removeKmin2){
				//possibleMoves.splice(i,1)
				removeThis=true
				console.log("to be removed")
			}
			if((possibleMoves[i][1]==l&&possibleMoves[i][0]==k+2&&removeKplus2)||removeThis){
				possibleMoves.splice(i,1)
				console.log("removed")
			}
		}



		

	}

	return possibleMoves



}
function coordsToMoveString(a,b,c,d){
	
	//console.log( dletters[a]+(b+1)+dletters[c]+(d+1))
	
	return dletters[a]+(b+1)+dletters[c]+(d+1)
}


function blankFunction(){
	alert("blankFunction called");

}
function isEven(n) {
  return n == parseFloat(n)? !(n%2) : void 0;
}

//newAi


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
			pieceThere.push(aiTable[i][j][0],aiTable[i][j][1],aiTable[i][j][2],aiTable[i][j][3])//,aiTable[i][j][3])
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

			//en pass
			if(whatsThere(k-1,l,moveTable)[3]){
				
				pushAid(k-1,l+1,0,0,moveTable,true)

			}
			if(whatsThere(k+1,l,moveTable)[3]){
				
				pushAid(k+1,l+1,0,0,moveTable,true)

			}


		}else{

			if(pushAid(k,l-1,0,0,moveTable)&&l==6){pushAid(k,l-2,0,0,moveTable)}
			pushAid(k-1,l-1,0,2,moveTable,true)
			pushAid(k+1,l-1,0,2,moveTable,true)

			//en pass
			if(whatsThere(k-1,l,moveTable)[3]){
				
				pushAid(k-1,l-1,0,0,moveTable,true)

			}
			if(whatsThere(k+1,l,moveTable)[3]){
				
				pushAid(k+1,l-1,0,0,moveTable,true)

			}




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

	

		if(!isWhite){
			var c=2
			var nc=1
		}else{
			var c=1
			var nc=2
		}

	
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
	


	//console.log("mit keres itt")

	//sanc
	if(moveTable[k][l][3]){					//if the king hasnt moved yet, 
		//if(l==0){		

			// ja nincs sakkban, nem is ugrik at sakkot, minden ures kozotte

							//white king
			if(table[0][l][3]&&whatsThere(1,l,moveTable)[0]==0&&whatsThere(2,l,moveTable)[0]==0&&whatsThere(3,l,moveTable)[0]==0){				// unmoved rook on [0][l]
				pushAid(2,l,0,0,moveTable)			//mark that cell if empty

			}
			if(table[7][l][3]&&whatsThere(5,l,moveTable)[0]==0&&whatsThere(6,l,moveTable)[0]==0){				// unmoved rook on [7][l]
				pushAid(6,l,0,0,moveTable)			//mark that cell if empty

			}

		//}else{								//black king


		//}



	}



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
	for(var i=strArray.length-1;i>=0;i--){
		if(validateTable(moveIt(strArray[i],table),!wNext)==9){
			strArray.splice(i,1)
		}
	}
	






	return strArray




}	

//var switchCount=0;

function getAllMoves(rawTableData,tableToMoveOn,whiteNext){		
	
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
		//console.log(pieceNo)
		
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
	
	var myMoves=
		getAllMoves(getTableData(tableToValidate,wNx),tableToValidate,wNx)
	
	var mybest =bestHit
	bestHit=0
	
	
	return [mybest]
	
}
function validateTable2(tableToValidate, wNx){
	bestHit=0
	
	var myMoves=getAllMoves(getTableData(tableToValidate,wNx),tableToValidate,wNx)
	
	var mybest =bestHit
	bestHit=0
	
	
	return [mybest]
	
}



function sortAiArray(a,b){
	if(typeof(a[0])=="boolean"){
		return -1}
	if(a[1]>b[1]){
		return -1
	}else{
		if(a[1]<b[1]){return +1}
	}

	
	return 0
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
function createFirstTableState(cfTable,cfColor){
	
	var cfMoves=moveArrayToStrings(getAllMoves(getTableData(cfTable,cfColor),cfTable,cfColor))
	

	var tempTable=new Array(8)
	var allTempTables=[]
	var opponentsOrigValue=validateTable(cfTable,!cfColor)
	var myOrigValue=validateTable(cfTable,cfColor)

	allTempTables.push([cfColor,fadeConst,0])				//array heading:color,fadeConst(will be multiplied),howDeep
	
	i=0
	
	cfMoves.forEach(function(stepMove){
		
		tempTable=moveIt(stepMove,cfTable)
		
		var myOrigValue=hitValue
		hitValue=0
	
		tTableValue=myOrigValue-escConst*(validateTable(tempTable,!cfColor)-opponentsOrigValue)+(validateTable(tempTable,cfColor)/2)
		

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
	
			
	
		})



		// deepening ends






		//aiLoop([tempTable],!cfColor,cfColor,myOrigValue)

		var repValue=tTable2Value/50+tTableValue
		allTempTables.push([stepMove,
		parseInt(repValue*100),parseInt(tTableValue*100),parseInt(tTable2Value*100)])//,tableHitValue]) //row: movestring, ai val, deepen val, deep hit val, [tables]
		
	})
	
	allTempTables=allTempTables.sort(sortAiArray)
	return allTempTables
}



function ai(tablE,wn){
	
	//var tableToAi=createFirstTableState(tablE,wn)
	
	return createFirstTableState(tablE,wn)[1][0]
	//tableToAi[1][0]

}
