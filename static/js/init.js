var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');

var play_btn=document.getElementById("play");
var continue_btn=document.getElementById("continue");
//var change_speed=document.getElementById("change_speed");

var photo=document.getElementById("photo");
var image_div=document.getElementById("image");
var queue=document.getElementById("queue");
var photos=[];

var speed=500;

var translate=document.getElementById("tanslate");



//删除帧的弹出框按钮
var del_btn=document.getElementById('del');
var cancel_btn=document.getElementById('cancel');
var modal = document.getElementById('modal');
//连接摄像头
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        //video.play();
    });
}

photo.addEventListener("click", function() {
    context.drawImage(video, 0, 0, 300,150);
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
	}

	queue.appendChild(img);
	photos.push(img);
});
cancel_btn.onclick=function(){
	modal.style.display='none';
};
del_btn.onclick=function(){
	var id=this.getAttribute('del-src');
	var del_frame=document.getElementById(id);
	queue.removeChild(del_frame);
	var str=del_frame;
	photos=del_ele_in_array(photos,str);
	console.log(photos);
	modal.style.display='none';
};

play_btn.onclick=function(){
	video.style.display='none';
	image_div.style.display='block';
	play();
};

continue_btn.onclick=function(){
	image_div.style.display='none';
	video.style.display='block';
};

// change_speed.onchange=function(){
// 	var time=change_speed.value;
// 	speed=parseInt(time);

// };
$(document).ready(function(){
	translate.onclick=function(){

		var updatas=[];
		for(var i=0, len=photos.length; i<len; i++){
			updatas.push(photos[i].getAttribute('src'));

		}
		var post_data = {
		    'images':updatas,
		};
	    $.ajax({
	        url:'/animation/',
	        type:'POST',
	        data:post_data, 
	        async:true,    //或false,是否异步
	        dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
	        success:function(data){
	       		console.log(data);


	        },
	        error:function(){
	            console.log("error");
	        }

	    });

	};
});
// translate.onclick=function(){
// 	var updatas={'images':2};
// 	//var updatas=[];
// 	// for(var i=0, len=photos.length; i<len; i++){
// 	// 	updatas.push(photos[i].getAttribute('src'));
// 	// }
// 	updatas=JSON.stringify({'data':updatas});

// 	Ajax.post('/animation/',updatas,function(data){
// 		console.log(data);
// 	});
// };
//播放定格动画函数
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

       
       //在页面上显示文件
	   image_div.setAttribute("src",img.getAttribute('src'));

    i++;
    setTimeout('cicle_show_image('+i+','+len+')',speed);
}

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



// var Ajax={
//   get: function(url, fn) {
//     // XMLHttpRequest对象用于在后台与服务器交换数据   
//     var xhr = new XMLHttpRequest();            
//     xhr.open('GET', url, true);
//     xhr.onreadystatechange = function() {
//       // readyState == 4说明请求已完成
//       if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
//         // 从服务器获得数据 
//         fn.call(this, xhr.responseText);  
//       }
//     };
//     xhr.send();
//   },
//   // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
//   post: function (url, data, fn) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     // 添加http头，发送信息至服务器时内容编码类型
//     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
//     xhr.onreadystatechange = function() {
//       if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
//         fn.call(this, xhr.responseText);
//       }
//     };
//     xhr.send(data);
//   }
// }