var path = location.pathname;
if(path == '/rss' || path == '/rss/' || path == '/feed' || path == '/feed/' || path == '/atom' || path == '/atom/'){
	location.href = 'http://feeds.feedburner.com/Sneezry';
}
else{
	location.href = '/#!' + path;
}
