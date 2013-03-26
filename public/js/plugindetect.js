var pluginsArray=new Array();
if(detectQuickTime()) pluginsArray.push('QuickTime');
if(detectFlash()) pluginsArray.push('Flash');
if(detectFlash10()) pluginsArray.push('Flash10Above');
if(detectDirector()) pluginsArray.push('Director');
if(detectWindowsMedia()) pluginsArray.push('WindowsMedia');
if(detectReal()) pluginsArray.push('Real');
var plugins=pluginsArray.join(',');
createCookie('plugin_list',plugins);
