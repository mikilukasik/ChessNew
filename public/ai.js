

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
