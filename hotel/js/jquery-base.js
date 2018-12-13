/*
 * file    : jquery-base.js
 * author  : chao.Radish@gmail.com
 */

//判断User-Agent
var system={
	win:false,
	mac:false,
	xll:false
};
var platform=navigator.platform;
system.win=platform.indexOf('Win')==0;
system.mac=platform.indexOf('Mac')==0;
system.x11=(platform=='X11')||(platform.indexOf('Linux')==0);
if(system.win){
	document.write('<link href="/Public/Css/font_win.css" rel="stylesheet" type="text/css" />');
}else if(system.mac){
	document.write('<link href="/Public/Css/font_mac.css" rel="stylesheet" type="text/css" />');
}else if(system.xll){
	document.write('<link href="/Public/Css/font_xll.css" rel="stylesheet" type="text/css" />');
}

//jQuery插件
(function(jQuery){
	$.fn.focusMap=function(options){        
		var defaults={
			speed:300,
			time:3000,
			play:true
		}
		var options=$.extend(defaults,options);
		
		this.each(function(){
			
			var obj=$(this),
				element=obj.find('li'),
				len=element.size(),
				nowNum=0,
				picTimer=false,
				active=false;
				
			obj.find('ul').show();
				
			if(len<=1) return;
			
			obj.find('.btn a').eq(0).addClass('on');
		
			obj.find('.btn a').click(function(){
				nowNum=obj.find('.btn a').index(this);
				showPics();
			});
			
			obj.find('a.prev').click(function(){
				if(nowNum<=0) nowNum=len;
				nowNum--;
				showPics();
			});
			
			obj.find('a.next').click(function(){
				nowNum++;
				if(nowNum==len) nowNum=0;
				showPics();
			});
			
			element.css({'opacity':0,'z-index':0});
			element.eq(0).css({'opacity':1,'z-index':1});
			element.eq(0).find('img').fadeIn(500);
			
			if(options.play){
				obj.hover(function(){
					clearInterval(picTimer);
				},function(){
					picTimer=setInterval(function(){
						nowNum++;
						if(nowNum==len) nowNum=0;
						showPics();
					},options.time);
				}).trigger('mouseleave');
			}
			
			function showPics(){
				active=true;
				element.css({'z-index':0});
				obj.find('li.on').css({'z-index':1});
				
				element.eq(nowNum).find('img').hide();
				element.eq(nowNum).css({opacity:0,'z-index':2});
				
				element.eq(nowNum).animate({'opacity':1},options.speed,function(){
					jQuery(this).find('img').fadeIn(500);
					jQuery(this).siblings().find('img').fadeOut();
					active=false;
				});
								
				element.removeClass('on').eq(nowNum).addClass('on');
				
				obj.find('.btn a').eq(nowNum).addClass('on').siblings().removeClass('on');
			}
		});
	}
	
	$.fn.albumFoucs=function(options){
		var defaults={
			num:5,
			height:129,
			time:300
		};
		var options=$.extend(defaults,options);
		
		this.each(function(){
			var obj=$(this);
			var list=obj.find('.list');
			var ul=list.find('ul:first');
			var len=list.find('li').length;
			var ulHeight=options.height*len;
			//为UL赋值
			ul.height(ulHeight);
			//插入大图
			//var showHtml='<div class="show"></div>';
			//obj.prepend(showHtml);
			
			var show=obj.find('.img');
			//为第一张缩略图增加选中效果
			list.find('li:first a').addClass('on');
			//获取第一张缩略图大图路径
			var firstSrc=list.find('li:first a').attr('href');
			loadingImg(show,firstSrc);
			
			//判断缩略图数量
			if(len>options.num){
				//向前滚动按钮绑定方法
				obj.find('.prev').live('click',function(){
					scrollPrev();
				});
				//向后滚动按钮绑定方法
				obj.find('.next').live('click',function(){
					scrollNext();
				});
			}
			//缩略图点击
			list.find('li a').bind('click',function(){
				var isSelect=0;
				if($(this).hasClass('on') || $(this).parent().index()==0) isSelect=1;
				//获取大图SRC
				var src=$(this).attr('href');
				//改变缩略图选中效果
				$(this).addClass('on').parent().siblings('li').find('a').removeClass('on');
				//如果缩略图数量满足要求向后滚动
				if(len>options.num && isSelect==0){
					scrollNext();
					loadingImg(show,src);
				}else{
					loadingImg(show,src);
				}
				//屏蔽A标签跳转
				return false;
			});
			//加载图片
			function loadingImg(obj,src,callback){
				//加载等待图标
				obj.html('<i></i>');
				var img=new Image();
				img.src=src;
				
				if(img.complete){
					obj.html(img);
					
					//回调函数
					if(callback) callback.call(null,callback);
				}else{
					img.onload=function(){
						obj.html(img);
						
						//回调函数
						if(callback) callback.call(null,callback);
						img.onload=null;
					};
				};
			}
			//向前滚动
			function scrollPrev(){
				if(!ul.is(":animated")){
					ul.css('margin-top','-'+options.height+'px').find('li:last').prependTo(ul);
					ul.animate({
						'margin-top':0
					},options.time);
				}
			}
			//向后滚动
			function scrollNext(){
				if(!ul.is(":animated")){
					ul.animate({
						'margin-top':'-'+options.height+'px'
					},options.time,function(){
						ul.css('margin-top',0).find('li:first').appendTo(ul);
					});
				}
			}
		});
	};
})(jQuery);

$(function(){
	//TopBar
	var windowWidth=$(window).width();
	//if(windowWidth>1440) $('.topbar').css('left',(windowWidth-1440)/2+'px');
	//二维码
	$('.topbar .code img').hover(function(){
		var codeLeft=$(this).offset().left-(356-21)/2;
		$('#code').css({'left':codeLeft+'px'}).show();
	},function(){
		$('#code').hide();
	});
	//文本框提示
	$('input,textarea').placeholder();
	//友情链接
	$('#getFriendly').hover(function(){
		var width=($(this).width()-202)/2;
		var top=$(this).css('marginTop').replace('px','');
		var height=-(48*$('#friendly .box a').length+24+parseInt(top));
		
		$(this).addClass('on');
		$('#friendly').css({'padding-bottom':top+'px','left':width+'px','top':height+'px'}).show();
	},function(){
		$('#friendly').hide();
		$(this).removeClass('on');
	});
	//导航
	var getMenuIndex=0
	$(window).load(function(){
		getMenuIndex=$('.header .menu li.on').index();
	});
	$('.header .menu li').hover(function(){
		$(this).addClass('on').siblings().removeClass('on');
		$(this).find('div').show();
	},function(){
		$('.header .menu li').eq(getMenuIndex).addClass('on').siblings().removeClass('on')
		$(this).find('div').hide();
	});
	//滚动到顶部
	$('#goto').bind('click',function(){
		 $('html,body').animate({scrollTop:0},500);
	});
	
	//二级导航固定
	$(window).scroll(function(){
		var scrollTop=$(this).scrollTop();
		
		if(scrollTop>=618){
			$('.menu_sub').css({'width':1460,'position':'fixed','left':0,'top':0,'z-index':9999999});
			
			if($('#menuBg').length==0) $('.menu_sub').after('<div id="menuBg" style="height:53px; overflow:hidden;"></div>')
		}else{
			if($('#menuBg').length>0) $('#menuBg').remove();
			
			$('.menu_sub').removeAttr('style');
		}
	});
});