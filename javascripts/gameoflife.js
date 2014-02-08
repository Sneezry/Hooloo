var cwidth = Math.floor(document.getElementsByTagName('header')[0].offsetWidth/5)*5;
var cheight = Math.floor(document.getElementsByTagName('header')[0].offsetHeight/5)*5;
var csize = 5;
var canvas = document.getElementById('gameoflife');
canvas.width = cwidth;
canvas.height = cheight;
var ctx = canvas.getContext('2d');
var cells = new Array();
var scount;

init();

function init(){
	ctx.fillStyle="#2e7bcf";
	ctx.fillRect(0,0,cwidth,cheight);
	for(var y=0; y<cheight/csize; y++){
		cells[y] = new Array();
		for(var x=0; x<cwidth/csize; x++){
			cells[y][x] = Math.round(Math.random()*0.56);
		}
	}
	getNewL();
}

function getNewL(){
	var ncells = new Array();
	for(var y=0; y<cheight/csize; y++){
		ncells[y] = new Array();
		for(var x=0; x<cwidth/csize; x++){
			ncells[y][x] = getState(x, y);
		}
	}
	cells = ncells;
	showCells();
	scount = setTimeout(getNewL, 200);
}

function getState(x, y){
	var n = 0
	for(var ty=y-1; ty<=y+1; ty++){
		for(var tx=x-1; tx<=x+1; tx++){
			if(ty<0 || tx<0 || ty>=cheight/csize || tx>=cwidth/csize){
				continue;
			}
			n += cells[ty][tx];
		}
	}
	n -= cells[y][x];
	if(n==3){
		return 1;
	}
	else if(n==2){
		return cells[y][x];
	}
	else{
		return 0;
	}
}

function showCells(){
	for(var y=0; y<cheight/csize; y++){
		for(var x=0; x<cwidth/csize; x++){
			if(cells[y][x]){
				ctx.fillStyle="#61a0e4";
			}
			else{
				ctx.fillStyle="#2e7bcf";
			}
			ctx.fillRect(x*csize,y*csize,csize,csize);
		}
	}
}

window.onresize = function (){
	clearTimeout(scount);
	cwidth = Math.floor(document.getElementsByTagName('header')[0].offsetWidth/5)*5;
	cheight = Math.floor(document.getElementsByTagName('header')[0].offsetHeight/5)*5;
	canvas.width = cwidth;
	canvas.height = cheight;
	init();
}
