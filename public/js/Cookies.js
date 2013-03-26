function createCookie(name,value,days){
	if(days){
		var date=new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires="; expires="+date.toGMTString();
	}else{
	    var expires = "";
	}
	document.cookie=name+"="+value+expires+"; path=/";
};
function readCookie(name){
	var cname = name + "=";               
	var dc = document.cookie;

    if (dc.length > 0) {              
		begin = dc.indexOf(cname);       
			if (begin != -1) {           
			begin += cname.length;       
			end = dc.indexOf(";", begin);
				if (end == -1) end = dc.length;
				return unescape(dc.substring(begin, end));
			} 
		}
	return null;
};
function readJSONCookie(name)
{
		var cookies = document.cookie.match(name + '=(.*?)(;|$)');
		if (cookies) {
			return unescape(cookies[1]);
		} else { 
			return null;
		}
};
function eraseCookie(name){
	createCookie(name,"",-1);
};
function createCookieObj(cname,obj,days){
	if(days){
		var date=new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires="; expires="+date.toGMTString();
	}else{
	    var expires = "";
	}
	var cookiestr='';
	var first_run = true;
	for(var name in obj){
		if(!first_run)
		{
			 cookiestr+='&';
			 
		}
	    cookiestr+=name+'='+obj[name];
		first_run=false;
	}
	
	//cookiestr=cookiestr.replace('&','');
	
	document.cookie=cname+'='+cookiestr+expires+"; path=/";
};