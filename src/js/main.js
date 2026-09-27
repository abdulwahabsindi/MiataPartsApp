$("#scrim").onclick=closePart;
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePart();});
$("#q").addEventListener("input",e=>{Q=e.target.value.trim().toLowerCase();renderGrid();});
$("#btn-en").onclick=()=>{LANG="en";renderChrome();renderGrid();closePart();};
$("#btn-ar").onclick=()=>{LANG="ar";renderChrome();renderGrid();closePart();};
renderChrome();renderGrid();
