var path = decodeURIComponent(location.hash.substr(2));
var page = 1;
if(location.search.substr(1,19)=='_escaped_fragment_='){
	path = decodeURIComponent(location.search.substr(20).split('&')[0]);
}
if(path == '/'){path = ''; window.history.replacetate(null, '', '/');page=1;}
else if(path && !location.search){window.history.replaceState(null, '', (isroot?'':('/'+repos))+'/#!'+path);}
var converter = new Showdown.converter();
var content = document.getElementById('content');
var dis = document.getElementById('disqus_thread');
var loading = document.getElementById('loading');
var backhome = document.getElementById('backhome');
var xmlhttp;
var disqus_url;
var kw;
var postList;
var pending;
var commentscount = new Array();
var isroot=((repos.indexOf('github.com')==-1 && repos.indexOf('github.io')==-1)?false:true);

main();

function main(){
	var disqusCounts = document.getElementsByName('commentscount');
	for(var i=0; i<disqusCounts.length; i++){
		commentscount[Number(disqusCounts[i].id.substr(5))] = disqusCounts[i].innerText;
	}
	content.innerHTML = '';
	loading.style.display = 'block';
	if(path.split('/')[1] == 'search'){
		search(path.split('/')[2]);
	}
	else if(path && path.split('/')[1] != 'page'){
		disqus_url = hostbase + lowerCase(path);
		//disqus_url = disqus_url.toLowerCase();
		showpost(path);
		(function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
	}
	else{
		//backhome.style.display = 'none';
		document.title = sitetitle;
		if(postList){
			showlist(postList);
		}
		else{
			pending = true;
			document.getElementById('takinglonger').style.display = 'none';
			chktakinglonger();
			var el = document.createElement('script');
			el.src = 'https://api.github.com/repos/' + githubname + '/' + repos + '/contents/md?callback=showlist'+(branch?('&ref='+branch):'');
			document.getElementsByTagName('head')[0].appendChild(el);
		}
	}
}

function home(){
	path = '';
	dis.style.display = 'none';
	dis.innerHTML = '';
	if(page==1){
		window.history.pushState(null, '', (isroot?'':('/'+repos))+'/');
	}
	else{
		path = '/page/'+page;
		window.history.pushState(null, '', (isroot?'':('/'+repos))+'/#!/page/'+page);
	}
	main();
}

function lowerCase(path){
	path = path.split('%');
	newPath = path[0];
	for(var i=1; i<path.length; i++){
		newPath += '%'+path[i].substr(0,2).toLowerCase()+path[i].substr(2);
	}
	return newPath;
}

function loadXMLDoc(url){
	var xmlhttp=null;
	if (window.XMLHttpRequest){// code for IE7, Firefox, Opera, etc.
		xmlhttp=new XMLHttpRequest();
	}
	else if (window.ActiveXObject){// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlhttp!=null){
		pending = true;
		document.getElementById('takinglonger').style.display = 'none';
		chktakinglonger();
		xmlhttp.onreadystatechange = function (){
			if (xmlhttp.readyState==4){// 4 = "loaded"
				pending = false;
				document.getElementById('takinglonger').style.display = 'none';
				loading.style.display = 'none';
				//backhome.style.display = 'block';
				if (xmlhttp.status==200){// 200 = "OK"
					var blog_text = xmlhttp.responseText;
					var encoded = false;
					if(blog_text.substr(0,2)=='::'){
						blog_text = Base64.decode(blog_text.substr(2));
						encoded = true;
					};
					blog_text = filterJekyllHeader(blog_text);
					var converter = new Showdown.converter();
					content.innerHTML = '<div id="content_inner"><div id="back_home"><a href="/" onclick="home();return false;">'+sitetitle+'</a><span>&nbsp;›&nbsp;</span></div><div id="post_title">' + decodeUtf8(getPostName(path)) + (encoded?Base64.decode('PHN1cCBzdHlsZT0iZm9udC1zaXplOjAuNWVtO3ZlcnRpY2FsLWFsaWduOiBzdXBlcjsiIHRpdGxlPSLmraTmlofnq6Dlt7Looqvph43mlrDnvJbnoIHku6XourLpgb/lrqHmn6UiPuKYmuiiq+e8lueggeeahOWGheWuuTwvc3VwPg=='):'') + '</div>' + converter.makeHtml(blog_text) + '<div class="date">Posted at ' + pdate + '</div></div>';
					if(dis){
						dis.style.display = 'block';
					}
				}
				else if(xmlhttp.status==404) {
					document.title = 'Not Found - '+sitetitle;
					content.innerHTML = '<img src="images/despicable_me.png" />';
				}
				else {
					document.title = 'Technology Problem - '+sitetitle;
					content.innerHTML = '<div id="takinglonger"><blockquote>We meet a problem when try to handle ' + path + ' (Err: ' + xmlhttp.status + ').</blockquote></div>';
				}
			}
		}
		xmlhttp.open("GET",url,true);
		xmlhttp.send(null);
	}
}

function chktakinglonger(){
	setTimeout(function(){
		if(pending){
			document.getElementById('takinglonger').style.display = 'block';
		}
	}, 10000);
}

function showpost(path){
	var url = location.protocol + '//' + location.hostname + (isroot?'':('/'+repos))+'/md/' + path.substr(1).replace(/\//g, '-')+(suffix?suffix:'');
	document.title = decodeUtf8(getPostName(path)) + ' - '+sitetitle;
	pdate = path.substr(1).split('/')[0]+'-'+path.substr(1).split('/')[1]+'-'+path.substr(1).split('/')[2];
	loadXMLDoc(url);
}

function showlist(list){
	if(path.split('/')[1] == 'page'){
		page = Number(path.split('/')[2]);
		if(isNaN(page) || page < 1){
			page = 1;
		}
		if(page == 1){
			window.history.replaceState(null, '', (isroot?'':('/'+repos))+'/');
		}
	}
	pending = false;
	document.getElementById('takinglonger').style.display = 'none';
	postList = list;
	var txt = '';
	if(page*20-20>=list.data.length && page!=1){
		page = Math.ceil(list.data.length/20);
		window.history.replaceState(null, '', (isroot?'':('/'+repos))+'/#!/page/'+page);
	}
	for(var i = list.data.length-(page-1)*20; i > 0 && i > list.data.length-page*20; i--){
		if(suffix && list.data[i-1].name.substr(-suffix.length)==suffix){
			list.data[i-1].name = list.data[i-1].name.substr(0, list.data[i-1].name.length-suffix.length);
		}
		txt += '<postlist><a href="'+(isroot?'':('/'+repos))+'/#!/' + encodePath(list.data[i-1].name, true) + '">' + getPostName(list.data[i-1].name) + '</a><div class="post_info"><span class="post_date">Posted at '+list.data[i-1].name.split('-')[0]+'-'+list.data[i-1].name.split('-')[1]+'-'+list.data[i-1].name.split('-')[2]+'</span><span class="disqus_count"><a href="' + hostbase + '/' + encodePath(list.data[i-1].name, false) + (commentscount[i]?'':'#disqus_thread') + '" name="commentscount" id="post-'+i+'">'+(commentscount[i]?commentscount[i]:'')+'</a></span></div></postlist>';
	}
	if(page==1 && page*20<list.data.length){
		txt += '<postlist><a class="prev_page" href="'+(isroot?'':('/'+repos))+'/#!/page/'+(page+1)+'">←较早的文章</a><div style="clear:both"></div></postlist>';
	}
	else if(page>1 && page*20>=list.data.length){
		txt += '<postlist><a class="next_page" href="'+(isroot?'':('/'+repos))+'/#!/page/'+(page-1)+'">较新的文章→</a><div style="clear:both"></div></postlist>';
	}
	else if(page>1 && page*20<list.data.length){
		txt += '<postlist><a class="prev_page" href="'+(isroot?'':('/'+repos))+'/#!/page/'+(page+1)+'">←较早的文章</a><a class="next_page" href="'+(isroot?'':('/'+repos))+'/#!/page/'+(page-1)+'">较新的文章→</a><div style="clear:both"></div></postlist>';
	}
	loading.style.display = 'none';
	content.innerHTML = txt;
	(function () {
        var s = document.createElement('script'); s.async = true;
		s.type = 'text/javascript';
        s.src = '//' + disqus_shortname + '.disqus.com/count.js';
        (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
    }());
}

function encodePath(path, isdecode){
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
	return isdecode?decodeUtf8(path):path;
}

function decodeUtf8(str){
	try{
		var tmp = decodeURIComponent(str);
		if(tmp==str){
			return str;
		}
		else{
			return decodeUtf8(tmp);
		}
	}
	catch(e){
		return str;
	}
}

function getPostName(name){
	if(name.substr(0,1)=='/'){
		name = name.substr(1);
	}
	name = name.replace(/\//g, '-');
	name = name.split('-');
	var newName = name[3];
	for(var i=4; i<name.length; i++){
		newName += '-'+name[i];
	}
	return newName.replace(/_/g, ' ');
}

function filterJekyllHeader(post){
	return post.replace(/^\-\-\-[\s\S]+\-\-\-[\n\r]+/g, '');
}

window.onhashchange = function(){
	if(location.hash && location.hash.substr(1,1) != '!'){
		window.history.replaceState(null, '', (isroot?'':('/'+repos))+'/#!'+path);
		return;
	}
	//goToTop();
	if (document.documentElement) {
		document.documentElement.scrollLeft = 0;
		document.documentElement.scrollTop = 0;
	}
	if (document.body) {
		document.body.scrollLeft = 0;
		document.body.scrollTop = 0;
	}
	dis.style.display = 'none';
	dis.innerHTML = '';
	path = location.hash.substr(2);
	if(path == (isroot?'':('/'+repos))+'/'){path = ''; window.history.replaceState(null, '', (isroot?'':('/'+repos))+'/');}
	main();
}
