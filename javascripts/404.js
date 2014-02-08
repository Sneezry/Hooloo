document.title = sitetitle;
var path = location.pathname;
if(rss && (path == '/rss' || path == '/rss/' || path == '/feed' || path == '/feed/' || path == '/atom' || path == '/atom/')){
	location.href = rss;
}
else{
	location.href = '/#!' + path;
}
