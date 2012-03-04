function playVideo(url) {
	url = url || "http://video-js.zencoder.com/oceans-clip.mp4";
	var video='<video id="video_1" class="video-js vjs-default-skin" controls autoplay preload="auto" width="640" height="264" data-setup="{}"><source src="'+url+'" type="video/mp4"/></video>';
	$('#stage').empty().append(video);
	$('#video_1').focus();
}

function openURL(url) {
	url = url || "http://v.youku.com/v_showMini/id_XMzU2NDQ2MTUy.html";
	var ifm = '<iframe name="inner" width="640" height="480" src="'+url+'"></iframe>';
	$('#stage').empty().append(ifm);
}

var base = 'http://localhost:8080/';
var uid = Math.ceil(Math.random()*1000);
var cnname = 'CCTV-05';
var root = io.connect(base);

$('#uid').html(uid);

$(document).ready(function(){
	
	root.emit('person', uid);
	root.emit('channel', cnname);
	var person = base+uid;
	var channel = base+cnname;
	
	io.connect(person).on('message', function (res) {
		console.log(res);
		$("#pool").append("["+res.data.op+"] "+ res.data.content+"</br>");
		//eval(data.msg)();
		switch(res.data.op) {
			case 'sendMessage': break;
			case 'playVideo': {
				playVideo(res.data.content);
				break;
			}
			case 'openURL': {
				openURL(res.data.content);
				break;
			}
		}
	});
	
	io.connect(channel).on('message', function (res) {
		console.log(res);
		$("#pool").append("["+res.data.op+"] "+ res.data.content+"</br>");
	});
	
	root.on('broadcast', function (res) {
		console.log(res);
		$("#pool").append(res.data.content+"</br>");
	});

});
