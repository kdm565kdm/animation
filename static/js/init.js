var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var video = document.getElementById('video');
var appear_video=document.getElementById('appear_video');

var relay_photo=document.getElementById('relay_photo');
var relay_btn=document.getElementById('relay_btn');
var relay_div=document.getElementById('relay');
var Countdown=document.getElementById('Countdown');
var intetval=document.getElementById('intetval');

var play_btn=document.getElementById("play");
var continue_btn=document.getElementById("continue");

var range_num=document.getElementById("set_frame");
var modal_set_frame=document.getElementById("modal_set_frame");
var input_num=document.getElementById("input_num");
var cancel_range_num_btn=document.getElementById("cancel_range_num_btn");
var photo=document.getElementById("photo");
var current_page=document.getElementById("current_page");
var image_div=document.getElementById("image");
//var now=document.getElementById("now");
var queue=document.getElementById("queue");

var photos=[];

var frames=[];
var results=[];

var second=1000;
var speed=41;//1000/24~41一秒二十四帧

var set_cover=document.getElementById("set_cover");
var cover=document.getElementById("cover");
var translate=document.getElementById("tanslate");

// 抠图与打包pdf用的canvas
const oCanvas = document.getElementById('my-canvas');
const output = document.getElementById('a4_out');

// 抠图与打包pdf用的canvas实例
const ctx = oCanvas.getContext("2d");
const octx=output.getContext("2d");

//删除帧的弹出框按钮
var del_btn=document.getElementById('del');
var cancel_btn=document.getElementById('cancel');
var modal = document.getElementById('modal');

var global_width=0;
var global_height=0;
var pdf = new jsPDF('', 'pt', 'a4');
//连接摄像头
var camera_par={ video: { facingMode: { exact: "environment" } } };
//var camera_par={ video:{ width: 640, height: 426 } };
getUserMedia(camera_par,success,error);
//访问用户媒体设备的兼容方法
function getUserMedia(constrains,success,error){
    if(navigator.mediaDevices.getUserMedia){
        //最新标准API
        navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
    } else if (navigator.webkitGetUserMedia){
        //webkit内核浏览器
        navigator.webkitGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator.mozGetUserMedia){
        //Firefox浏览器
        navagator.mozGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator.getUserMedia){
        //旧版API
        navigator.getUserMedia(constrains).then(success).catch(error);
    }
}
//成功的回调函数
function success(stream){
    //兼容webkit内核浏览器
    var CompatibleURL = window.URL || window.webkitURL;
    //将视频流设置为video元素的源
	appear_video.src = CompatibleURL.createObjectURL(stream);
	video.src = CompatibleURL.createObjectURL(stream);
    //播放视频
    //video.play();
}

//异常的回调函数
function error(error){
    console.log("访问用户媒体设备失败：",error.name,error.message);
}
if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia){
    //调用用户媒体设备，访问摄像头
    getUserMedia({
        video:{width:480,height:320}
    },success,error);
} else {
    alert("你的浏览器不支持访问用户媒体设备");
}

document.onkeyup = function (e) {//按键信息对象以函数参数的形式传递进来了，就是那个e
    var code = e.charCode || e.keyCode;  //取出按键信息中的按键代码(大部分浏览器通过keyCode属性获取按键代码，但少部分浏览器使用的却是charCode)
    if (code == 13) {
        //此处编写用户敲回车后的代码
        catch_image();
    }
}

photo.addEventListener("click", function() {
	catch_image();
});

input_num.oninput=function(){
	document.getElementById('fps').innerHTML=input_num.value;
};
range_num.onclick=function(){
	modal_set_frame.style.display='block';
};
cancel_range_num_btn.onclick=function(){
	modal_set_frame.style.display='none';
};


cancel_btn.onclick=function(){
	modal.style.display='none';
};
del_btn.onclick=function(){
	var id=this.getAttribute('del-src');
	var del_frame=document.getElementById(id);
	queue.removeChild(del_frame);
	var str=del_frame;
	photos=del_ele_in_array(photos,str);
	current_page.innerHTML=photos.length;
	modal.style.display='none';
};

relay_photo.onclick=function(){
	relay_div.style.display='block';
};

relay_btn.onclick=function(){
	relay_div.style.display='none';
	count_time=parseFloat(Countdown.value);
	count_time=parseInt(count_time*1000);

	intetval_time=parseFloat(intetval.value);
	intetval_time=parseInt(intetval_time*1000);

	relay_camera(count_time,intetval_time);

};

play_btn.onclick=function(){
	appear_video.style.display='none';
	image_div.style.display='block';
	photo.style.display='none';
	continue_btn.style.display='block';
	var frame=parseInt(input_num.value);
	speed=parseInt(1000/frame)
	play();
};

continue_btn.onclick=function(){
	image_div.style.display='none';
	appear_video.style.display='block';
	photo.style.display='block';
	continue_btn.style.display='none';
};
set_cover.onclick=function(){
	// if (photos.length<70) {
	// 	alert('请排满70张再合成！！当前张数为：'+photos.length);
	// }else{
	// 	cover.style.display='block';
	// }
	cover.style.display='block';
	
};
translate.onclick=function(){

	var i=0;
	onImageLoad(i);
	cover.style.display='none';

};
// $(document).ready(function(){
// 	translate.onclick=function(){
// 		upload_to_server_to_merge();
// 	};
// });

function catch_image(){
    context.drawImage(video, 0, 0, 1280,720);
    var dataURL=canvas.toDataURL('image/jpeg'); //转换图片为dataURL
 	var img = document.createElement("img");
	img.setAttribute("src",dataURL);
	var id=Math.random();
	img.setAttribute("id",id);
	img.onclick=function(){
		var frame=document.getElementById("frame");
		frame.innerHTML='';
		var frame_img=document.createElement("img");
		frame_img.setAttribute('src',this.getAttribute('src'));
		frame.appendChild(frame_img);
		modal.style.display='block';
		
		del_btn.setAttribute('del-src',this.id);

		image_div.setAttribute('src',this.getAttribute('src'));
	}

	queue.appendChild(img);
	photos.push(img);
	current_page.innerHTML=photos.length;
}
//预览播放
function play(speed){
	
	var time=time;
	var i=0;
	var len=photos.length;
	var file=photos[i];
	cicle_show_image(i,len,speed);

}

//循环展示图片
function cicle_show_image(i,len){
	if(i>=len){
		return;
	}
	var img=photos[i];

	image_div.setAttribute("src",img.getAttribute('src'));

    i++;
    setTimeout('cicle_show_image('+i+','+len+')',speed);
}
//从数组中删除帧图片数据
function del_ele_in_array(arr,ele){
	var arr=arr;
	var ele=ele;
	for(var i=0, len=arr.length; i<len; i++){
		if(arr[i]===ele){
			arr.splice(i,1); 
			
			return arr;
		}
	}
	return arr;
}


function relay_camera(count_time,intetval_time){
	var count_time=count_time;
	var intetval_time=intetval_time;
	if(count_time<=0){
		upload_to_server_to_merge();
		return;
	}
	catch_image();
	count_time-=intetval_time;
	setTimeout('relay_camera('+count_time+','+intetval_time+')',intetval_time);

}

//抠图与打包pdf

// 上面读取资源的操作后，将图像画到canvas上
function onImageLoad(i) {
	if (photos[i]===undefined) {
		var j=10;
		mregeBackground(j,frames.length);
		return;
	};
	var image=new Image;
	image.src=photos[i].src;
	image.onload=function(){
	    const width = oCanvas.width = image.naturalWidth || image.width;
	    const height = oCanvas.height = image.naturalHeight || image.height;
	    global_width=width;
	    global_height=height;
	    ctx.drawImage(image, 0, 0);

	    // 获取画布像素信息
	    const imageData = ctx.getImageData(0, 0, width, height);

	    // 一个像素点由RGBA四个值组成，data为[R,G,B,A [,R,G,B,A[...]]]组成的一维数组
	    // 可以通过修改该数组的数据，达到修改图片内容的目的
	    const data = imageData.data;
	    filter(data);// 这里对图像数据进行处理

	    // 把新的内容画进画布里
	    ctx.putImageData(imageData, 0, 0);
	    
	    var bg = new Image;
	    bg.src='/static/bg.jpg';

		bg.addEventListener('load', function(event) {
			ctx.globalCompositeOperation="destination-over";
	    	ctx.drawImage(bg, 0, 0,width,height);
			var dataURL=oCanvas.toDataURL('image/jpeg'); //转换图片为dataURL

			frames.push(dataURL);
			//console.log(frames.length);
			i++;
			onImageLoad(i);
		});
	};




}

//抠图算法
function filter(data) {
	
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i],
            g = data[i + 1],
            b = data[i + 2];
        //g通道的值与r,b通道的值各相差大于20时
        var difference_g_r=g-r;
        var difference_g_b=g-b;
        if(difference_g_b>10&&difference_g_r>10){
        	var average=(r+g+b)/3;
        	if (g<=20) {
        		data[i]=data[i + 1]=data[i + 2]=0;
        		
        		data[i + 3]=150;
        	}
        	else if(g<=30){
        		data[i]=data[i + 1]=data[i + 2]=average;
        		
        		data[i + 3]=150;
        	}
        	else if(g<=60){
        		data[i]=data[i + 1]=data[i + 2]=average;
        		
        		data[i + 3]=150;
        	}else{
        		data[i + 3] = 0;
        	}
        	
        }

    }
}
function onImageErr() {
    oInput.classList.add('err');
}

function mregeBackground(i,len){

	if(len<=10){
		var j=0;
		var bg=new Image;
		bg.src='/static/background/10.jpg';
		bg.onload=function(){
			octx.globalCompositeOperation="source-over";
	    	octx.drawImage(bg,0,0,2480,3508);

			mergeImages(j,j+10,375,150);

		};
		return;
	}
	var len=len;
	var i=i;
	var j=i-10;

	if(i>len){

		return;
	}

	
	var bg=new Image;
	bg.src='/static/background/'+i+'.jpg';
	bg.onload=function(){
		octx.globalCompositeOperation="source-over";
    	octx.drawImage(bg,0,0,2480,3508);

		mergeImages(j,j+10,375,150);

	};

}
function mergeImages(i,j,x,y){

		if(frames[i]===undefined){
			var pageData=output.toDataURL('image/jpeg'); //转换图片为dataURL
			results.push(pageData);
			
			console.log('print pdf document');

			//addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
			pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/output.width * output.height );
			//pdf.save('stone.pdf');
			octx.clearRect(0,0,2480,3508);
			setCover();
			return;
		}
		if(i>j){
			i=i-1+10;
			console.log(i);
			var pageData=output.toDataURL('image/jpeg'); //转换图片为dataURL
			//addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
			pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/output.width * output.height);
			pdf.addPage();
			results.push(pageData);
			octx.clearRect(0,0,2480,3508);
			console.log('add a page of A4 paper');
			mregeBackground(i,frames.length);
			return;
		}

	const width=800;
	const height=450;
    var bg = new Image;
    bg.src=frames[i];
	bg.addEventListener('load', function(event) {
		octx.drawImage(bg,x,y,width,height);
		// if(x!=375){
		// 	x=375;
		// 	y+=673;
		// }else{
		// 	x+=1100;
		// }

		if(y>=2842){
			y=150;
			x+=1100;
		}else{
			y+=673;
		}

		i+=1;

		mergeImages(i,j,x,y);
	});


}
// function setCover(){
// 	var title=document.getElementById('title').value;
// 	var editor=document.getElementById('editor').value;
// 	var time=getNowDate();
// 	ctx.globalCompositeOperation="source-over";
// 	ctx.clearRect(0,0,global_width,global_height);
// 	ctx.fillStyle='#00f';
// 	ctx.fillRect(0,0,global_width,global_height);

// 	var back_cover=oCanvas.toDataURL('image/jpeg');
// 	ctx.fillStyle='#00f';
// 	ctx.fillRect(0,0,global_width,global_height);
// 	ctx.font = "italic 60px 黑体";
// 	ctx.fillStyle = "Red";
// 	ctx.fillText(title,330,160);
// 	ctx.fillText(editor,330,400);
// 	ctx.fillText(time,230,640);

// 	var cover=oCanvas.toDataURL('image/jpeg');
// 	ctx.clearRect(0,0,global_width,global_height);

	
// 	const width=800;
// 	const height=450;

// 	octx.clearRect(0,0,2480,3508);
// 	octx.fillStyle='#fff';
// 	octx.fillRect(0,0,2480,3508);
//     var first = new Image;
//     first.src=cover;
// 	first.addEventListener('load', function(event) {
// 		octx.drawImage(first,375,150,width,height);
// 		var last= new Image;
// 		last.src=back_cover;
// 		last.addEventListener('load', function(event) {
// 			octx.drawImage(last,1100,150,width,height);
// 			pdf.addPage();
// 			var pageData=output.toDataURL('image/jpeg');
// 			pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/output.width * output.height);
// 			pdf.save('test.pdf');
// 		});
// 	});	
// }
function setCover(){
	var title=document.getElementById('title').value;
	var editor=document.getElementById('editor').value;
	var time=getNowDate();
	// ctx.globalCompositeOperation="source-over";
	// ctx.clearRect(0,0,global_width,global_height);
	// ctx.fillStyle='#00f';
	// ctx.fillRect(0,0,global_width,global_height);

	// var back_cover=oCanvas.toDataURL('image/jpeg');
	// ctx.fillStyle='#00f';
	// ctx.fillRect(0,0,global_width,global_height);
	// ctx.font = "italic 60px 黑体";
	// ctx.fillStyle = "Red";
	// ctx.fillText(title,330,160);
	// ctx.fillText(editor,330,400);
	// ctx.fillText(time,230,640);

	// var cover=oCanvas.toDataURL('image/jpeg');
	// ctx.clearRect(0,0,global_width,global_height);

	
	const width=2480;
	const height=678;

	octx.clearRect(0,0,2480,3508);
	octx.fillStyle='#fff';
	octx.fillRect(0,0,2480,3508);
	octx.globalCompositeOperation="source-over";
	var cover=new Image;
	cover.src='/static/cover.jpg';
	cover.addEventListener('load', function(event) {
		octx.drawImage(cover,0,150,width,height);
		octx.font = "italic 60px 黑体";
		octx.fillStyle = "#000";
		octx.fillText(title,330,320);
		octx.fillText(editor,330,500);
		octx.fillText(time,230,740);
		pdf.addPage();
		var pageData=output.toDataURL('image/jpeg');
		pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/output.width * output.height);
		pdf.save('test.pdf');

	});
 //    var first = new Image;
 //    first.src=cover;
	// first.addEventListener('load', function(event) {
	// 	octx.drawImage(first,375,150,width,height);
	// 	var last= new Image;
	// 	last.src=back_cover;
	// 	last.addEventListener('load', function(event) {
	// 		octx.drawImage(last,1100,150,width,height);
	// 		pdf.addPage();
	// 		var pageData=output.toDataURL('image/jpeg');
	// 		pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/output.width * output.height);
	// 		pdf.save('test.pdf');
	// 	});
	// });	
}
function getNowDate() {
	 var date = new Date();
	 var sign1 = "-";
	 var sign2 = ":";
	 var year = date.getFullYear() // 年
	 var month = date.getMonth() + 1; // 月
	 var day  = date.getDate(); // 日
	 var hour = date.getHours(); // 时
	 var minutes = date.getMinutes(); // 分
	 var seconds = date.getSeconds() //秒
	 var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
	 var week = weekArr[date.getDay()];
	 // 给一位数数据前面加 “0”
	 if (month >= 1 && month <= 9) {
	  month = "0" + month;
	 }
	 if (day >= 0 && day <= 9) {
	  day = "0" + day;
	 }
	 if (hour >= 0 && hour <= 9) {
	  hour = "0" + hour;
	 }
	 if (minutes >= 0 && minutes <= 9) {
	  minutes = "0" + minutes;
	 }
	 if (seconds >= 0 && seconds <= 9) {
	  seconds = "0" + seconds;
	 }
	 var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds + " " + week;
	 return currentdate;
}
// function upload_to_server_to_merge(){
// 		var frame=parseInt(input_num.value);
// 		//var updatas=[];
// 		var frame={
// 			'frame_per_second':frame
// 		}
// 		for(var i=0, len=photos.length; i<len; i++){
// 			var tem_img=photos[i].getAttribute('src');
// 			var post_data = {
// 			    'image':tem_img   
// 			};
// 		    $.ajax({
// 		        url:'/animation/',
// 		        type:'POST',
// 		        data:post_data, 
// 		        async:true,    //或false,是否异步
// 		        dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
// 		        success:function(data){
// 		       		//console.log(data);


// 		        },
// 		        error:function(){
// 		            console.log("error");
// 		        }

// 		    });

// 		}
// 		var post_data = {
// 		    'frame_per_second':frame
// 		};
// 	    $.ajax({
// 	        url:'/animation/',
// 	        type:'POST',
// 	        data:frame, 
// 	        async:true,    //或false,是否异步
// 	        dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
// 	        success:function(data){
	       		
// 	       		window.location.href='http://127.0.0.1:8000/upload/';

// 	        },
// 	        error:function(){
// 	            console.log("error");
// 	        }

// 	    });
// }
