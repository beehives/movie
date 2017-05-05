$(function(){
	$(".del").click(function(e){
		var target=e.target;
		var id=target.getAttribute("dataId");
		var tr=$(".item-id-"+id);
		var text=$.ajax({
			type:"DELETE",
			url:"/admin/list/"+id,
			success:function(data,textStatus){
                 if(tr.length>0){
                 	$(tr).remove();
                 }
			}
		});
		
		
	});
})