// JScript File

function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}
   
function openWindow(partialURL)
{
     var selectedIdx=gebid(lbxSelectCourse).selectedIndex;
     var selectedValue=gebid(lbxSelectCourse)[selectedIdx].value;

    MM_openBrWindow(partialURL + selectedValue ,'CourseDescription','scrollbars=1,resizable=0,width=760,height=800');
}

function openWindowRegistration()
{
     var selectedIdx=gebid(lbxSelectCourse).selectedIndex;
     var selectedValue=gebid(lbxSelectCourse)[selectedIdx].value;

    MM_openBrWindow('../home/DisplayCourse.aspx?lpk2=' + selectedValue ,'CourseDescription','scrollbars=1,resizable=0,width=760,height=800');
}
