
function ShowWindow(url,width,height, movieId) {

    if (screen.height < height){
        height = screen.height
    }
    var iev=getIEVer();
    if(iev>=6&&iev<8){
        width+=16*1;
    }
    var left = (screen.width/2)-(width/2);
    objMovieWindow=window.open(url, "movieWindow", "width=" + width + ", height=" + height + ", top=0, left="+left+", status=false, toolbar=false, menubar=false, location=false, directories=false, scrollbars=1, resizable=1"); 
    objMovieWindow.focus();
};
function setWatched(obj){
	if(obj){obj.className = 'viewedMovie';}
	return false;
};
function getIEVer(){
  var rv = -1;
  if (navigator.appName == 'Microsoft Internet Explorer')  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
};
function gebid(e) {
    if(typeof(e)!='string') return e;
    if(document.getElementById) e=document.getElementById(e);
    else if(document.all) e=document.all[e];
    else e=null;
    return e;
};
function CheckMovie(movieId){
    movieId = 'imgChecked_' + movieId;
    var myImage = gebid(movieId);
    if(myImage){
        var myRow = myImage.parentNode.parentNode.parentNode;
        var myCells = myRow.getElementsByTagName("td");
        var myMovieLink = gebid(myCells[1].getElementsByTagName("a")[0].id);
        myMovieLink.className = 'coursesColumnTitle visitedLink';
        myImage.parentNode.style.display='block';
    }
};
function ShowWindowN(userId,url,width,height,courseId) {
    var iev=getIEVer();
    if(iev>=6&&iev<8){
        width+=16*1;
    }
    var w=screen.availWidth<width?screen.availWidth:width;
    
    var csCookie=readCookie('course_settings_'+userId);
    var found=false;
    
    if(csCookie!=null){
        csCookie=eval('({'+csCookie.replace(/&/g,',').replace(/=/g,':')+'})');
        if(csCookie[courseId]!=null){
            height+=1*csCookie[courseId].height;
            found=true;
        }
    }
    if(!found){
        var plCookie=readCookie('player_settings_'+userId);
        if(plCookie!=null){
            plCookie=eval('({'+plCookie.replace(/&/g,',').replace(/=/g,':')+'})');
            height+=1*plCookie.window_extra_height;
        }else{
            height+=16;
        }
    }
    var h=screen.availHeight<height?screen.availHeight:height;
    
    var left = (screen.availWidth/2)-(w/2);
    
    objMovieWindow=window.open(url, "movieWindow", "width=" + w + ", height=" + h + ", top=0, left="+left+", status=false, toolbar=false, menubar=false, location=false, directories=false, scrollbars=1, resizable=1"); 
    objMovieWindow.focus();
};

function ShowWindowVideoTour(userId, url, width, height) {
    height += 15;
    if (userId == -1) {
        height += 35;
    }

    var left = (screen.availWidth / 2) - (width / 2);
    objMovieWindow = window.open(url, "VideoTrailer", "width=" + width + ", height=" + height + ", top=0, left=" + left + ", scrollbars=false");
    objMovieWindow.focus();
};

function ShowFlashWindow(url, width, height) {
    var left = (screen.availWidth / 2) - (width / 2);
    objMovieWindow = window.open(url, "VideoTrailer", "width=" + width + ", height=" + height + ", top=0, left=" + left + ", scrollbars=false");
    objMovieWindow.focus();
};
