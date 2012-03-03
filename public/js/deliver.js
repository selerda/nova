$(document).ready(function(){

	$('#push').click(function(){
		var uid = $('#uid').val();
		var content = $('#content').val();
		var op = $('input:radio[name="op"]:checked').val();	
		$.ajax({
			type: "POST",
			url: "/push",
			data: {'uid':uid, 'op':op, 'content':content},
			success: function(data){
				//console.log(data);
			}
		});
	});

	$('#chat').click(function(){
		var cnname = $('#cnname').val();	
		$.ajax({
			type: "POST",
			url: "/chat",
			data: {'cnname':cnname, 'op':'chat', 'content':'this is '+cnname+' channel chat'},
			success: function(data){
				//console.log(data);
			}
		});
	});
	
	$('#bc').click(function(){
		var bcontent = $('#bcontent').val();	
		$.ajax({
			type: "POST",
			url: "/broadcast",
			data: {'op':'broadcast', 'content':bcontent},
			success: function(data){
				//console.log(data);
			}
		});
	});

	$('input:radio[name="op"]').click(function(){
		var selected = $(this).val();
		if(selected=="sendMessage") $('#content').val("");
		else if(selected=="playVideo") $('#content').val("http://video-js.zencoder.com/oceans-clip.mp4");
		else if(selected=="openURL") $('#content').val("http://v.youku.com/v_showMini/id_XMzU2NDQ2MTUy.html");
		$('#content').focus();
	});
});