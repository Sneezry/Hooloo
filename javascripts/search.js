var listTotal;
var currentTotal = 0;
var searchResult = false;
var isCache = false;
var isroot=((repos.indexOf('github.com')==-1 && repos.indexOf('github.io')==-1)?false:true);

function doSearch(q){
	if(q){
		window.history.pushState(null, '', (isroot?'':('/'+repos))+'/#!/search/'+q);
		search(q);
	}
}

function search(q){
	if(!q){
		home();
	}
	else{
		content.innerHTML = '';
		loading.style.display = 'block';
		dis.style.display = 'none';
		dis.innerHTML = '';
		document.title = 'Search:' + q + ' - '+sitetitle;
		kw = q;
		if(postList){
			searchlist(postList);
		}
		else{
			var el = document.createElement('script');
			el.src = 'https://api.github.com/repos/' + githubname + '/' + repos + '/contents/md?callback=searchlist'+(branch?('&ref='+branch):'');
			document.getElementsByTagName('head')[0].appendChild(el);
		}
	}
}

function searchlist(list){
	postList = list;
	listTotal = list.data.length;
	currentTotal = 0;
	for(var i = list.data.length; i > 0; i--){
		if(suffix && list.data[i-1].name.substr(-suffix.length)==suffix){
			list.data[i-1].name = list.data[i-1].name.substr(0, list.data[i-1].name.length-suffix.length);
		}
		if(list.data[i-1].name.toLowerCase().indexOf(kw.toLowerCase()) != -1){
			content.innerHTML += '<postlist><a href="'+(isroot?'':('/'+repos))+'/#!/' + encodePath(list.data[i-1].name) + '">' + getPostName(list.data[i-1].name) + '</a></postlist>';
			searchResult = true;
			currentTotal++;
		}
		else{
			var url = location.protocol + '//' + location.hostname + (isroot?'':('/'+repos))+'/md/' + list.data[i-1].name+(suffix?suffix:'');
			searchLoadXMLDoc(url, list.data[i-1].name);
		}
	}
}

function searchLoadXMLDoc(url, pname){
	var xmlhttp=null;
	if (window.XMLHttpRequest){// code for IE7, Firefox, Opera, etc.
		xmlhttp=new XMLHttpRequest();
	}
	else if (window.ActiveXObject){// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlhttp!=null){
		xmlhttp.onreadystatechange = function (){
			if (xmlhttp.readyState==4){// 4 = "loaded"
				currentTotal++;
				loading.style.display = 'none';
				//backhome.style.display = 'block';
				if (xmlhttp.status==200){// 200 = "OK"
					if(xmlhttp.responseText.toLowerCase().indexOf(kw.toLowerCase()) != -1){
						content.innerHTML += '<postlist><a href="'+(isroot?'':('/'+repos))+'/#!/' + pname.replace(/-/g, '/') + '">' + pname.split('-')[pname.split('-').length-1] + '</a></postlist>';
						searchResult = true;
					}
				}
				if(currentTotal == listTotal){
					loading.style.display = 'none';
					if(!searchResult){
						content.innerHTML = '<blockquote id="no_results">No Results.</blockquote>';
					}
					searchResult = false;
				}
			}
		}
		xmlhttp.open("GET",url,true);
		xmlhttp.send(null);
	}
}

function cache(){
	if(!isCache){
		isCache = true;
		if(postList){
			docache(postList);
		}
		else{
			var el = document.createElement('script');
			el.src = 'https://api.github.com/repos/' + githubname + '/' + repos + '/contents/md?callback=docache'+(branch?('&ref='+branch):'');
			document.getElementsByTagName('head')[0].appendChild(el);
		}
	}
}

function docache(list){
	postList = list;
	for(var i = list.data.length; i > 0; i--){
		var url = location.protocol + '//' + location.hostname + (isroot?'':('/'+repos))+'/md/' + list.data[i-1].name+(suffix?suffix:'');
		var xmlhttp=null;
		if (window.XMLHttpRequest){// code for IE7, Firefox, Opera, etc.
			xmlhttp=new XMLHttpRequest();
		}
		else if (window.ActiveXObject){// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		if (xmlhttp!=null){
			xmlhttp.open("GET",url,true);
			xmlhttp.send(null);
		}
	}
}

function getPostName(name){
	name = name.split('-');
	var newName = name[3];
	for(var i=4; i<name.length; i++){
		newName += '-'+name[i];
	}
	return newName.replace(/_/g, ' ');
}

function encodePath(path){
	path = encodeURIComponent(path);
	path = path.split('-');
	var newPath = path[0]+'/'+path[1]+'/'+path[2]+'/'+path[3];
	for(var i=4; i<path.length; i++){
		newPath += '-'+path[i];
	}
	path = newPath;
	for(var i=0; i<path.length; i++){
		if(path.substr(i,1) == '%'){
			path = path.substr(0,i+1)+path.substr(i+1,2).toLowerCase()+path.substr(i+3);
			i+=2;
		}
	}
	return path;
}