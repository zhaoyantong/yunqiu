window.onload=function(){
				var ulObj=document.getElementById("list");
				var liObj=ulObj.getElementsByTagName("li"); //li数组
				var contObj=document.getElementById("content");
				var pObj=contObj.getElementsByTagName("p");   //p数组
				for(var i=0; i<liObj.length; i++){
					liObj[i].index=i;     //设置索引值
					liObj[i].onclick=function(){
						for(var j=0; j<liObj.length; j++){
							liObj[j].className="normal";
							pObj[j].style.display="none";
						}
						liObj[this.index].className="active";
						pObj[this.index].style.display="block";
					}	
				}
			}