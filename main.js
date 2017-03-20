(function(){
	//Some dom and global variables 
	const maze = document.getElementById("maze"),
		message = document.getElementById("message"),
		moves =[
		{x:"0" , y: "-50"},
		{x:"+50" , y: "0"},
		{x:"0" , y: "+50"},
		{x:"-50" , y: "0"}
	]
	
	//Add random functionality to the array prototype
	Array.prototype.randomElement = function () {
		return this[Math.floor(Math.random() * this.length)]
	}
	
	createWonderer = (e) =>{
		let initialPos, wondy;
		
		initialPos = { posX:e.target.offsetLeft, posY:e.target.offsetTop };
		maze.removeEventListener('click', startGame, false);
		e.target.classList.add("visited-once");
		
		wondy = document.createElement("div");
		wondy.id = "wonderer";
		wondy.classList.add("wonderer");
		wondy.style.left = initialPos.posX+"px";
		wondy.style.top = initialPos.posY+"px";
		maze.appendChild(wondy);
	}
	
	getElementbyPos = (pos) => {
		for(let el of maze.children){
			if(el.offsetLeft === pos.x && el.offsetTop === pos.y){
				return el;
			}
		}
	}
	
	function displayEndMessage(){
		let messageType ={
			0:"Oh Yeah!, my CHESSE... ",
			1:"DAMN!, that was easy... ",
			2:"SKRRRRT, BUGATTI BUGATTI ",
			3:"Me gusta, mi queso (^_^) "
		};
		let restartButton = "<span id='restart'>Play Again</span>";
		let index = Math.floor(Math.random() * Object.keys(messageType).length);//this way I got the object length.
		let endMessage = messageType[index];
		
		return "<p>" + endMessage + restartButton + "</p>";
	}
	
	function myNeighboursAre(box){
		let misBros = [], 
			pos = {};
		for(let coords of moves){
			pos.x = box.offsetLeft + parseInt(coords.x),
			pos.y = box.offsetTop + parseInt(coords.y);
			misBros.push(getElementbyPos(pos));
		}
		noExit(misBros,box);
		return misBros;
	}
	
	function noExit(array,box){
		let result = array.filter(function(elem){
			if(elem !== undefined && !elem.classList.contains("wall")){
				if(!elem.classList.contains("visited-twice"))
				return elem;
			}
		});
		if(result.length === 1){
			if(box.classList.contains("visited-once")){
				box.classList.remove("visited-once");
			}
			box.classList.add("visited-twice");
			return true;
		}
		return false;
	}
	
	function probablyMoves(array){
		return array.filter(function(item){
			if(item !== undefined && !item.classList.contains("wall") && !item.classList.contains("visited-twice")){
				return item;
			}
		});
	}
	
	function pickMyBox(array){
		let i,j;
		
		j = array.filter(function(elem){
			return !elem.classList.contains("visited-once");
		});
		if(j.length>0){
			i = j.randomElement();
		}else{
			i = array.randomElement();
		}
		return i;
	}
	
	function moveWonderer(array){
		let i, dude;
		
		i = pickMyBox(array),
		dude = document.getElementById("wonderer");
		dude.style.left= i.offsetLeft + "px"; 
		dude.style.top = i.offsetTop + "px";
		i.classList.add("visited-once");
		return i;
	}
	
	function isWall(e){
		return e.target.classList.contains("wall");
	}
	
	//reload the  whole thing
	function reload(){
		location.reload();
	}
	
	function isTheEnd(){
		message.innerHTML = displayEndMessage();
		document.getElementById("restart").addEventListener("click",reload,false);	
	}
	
	function play(array){
		let i = moveWonderer(array),
			myMoves = probablyMoves(myNeighboursAre(i));
		
		if(i.classList.contains("end")){
			isTheEnd();
		}else{
			setTimeout(play, 300, myMoves);
		}
	}
	
	function startGame(e){
		if(!isWall(e)){
			message.innerHTML="<p>Nice, now I'm ought to find it.</p>";
			createWonderer(e,maze);
			let myMoves = probablyMoves(myNeighboursAre(e.target));
			setTimeout(play, 500, myMoves);
		}	
	}
	
	function placeCheese(e){
		if(!isWall(e)){
			e.target.classList.add("end");
			message.innerHTML="<p>Now Choose where to start...</p>";
			maze.removeEventListener('click', placeCheese, false);
			maze.addEventListener("click", startGame, false);
		}
	}
	
	maze.addEventListener("click", placeCheese, false);

}());