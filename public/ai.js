


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
	//console.clear()
	// tempstr=""
	// if(wNext){
	// 	tempstr="White's move, "
	// }else{
	// 	tempstr="Black's move, "
	// }	
	//console.log(tempstr+i+' tables generated.')
	allTempTables=allTempTables.sort(sortAiArray)
	return allTempTables
}



function ai(tablE,wn){
	
	tableToAi=createFirstTableState(tablE,wn)
	
	return tableToAi[1][0]

}
