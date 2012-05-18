function anim(e, CSSClass) {
	if($(e).hasClass(CSSClass))
		$(e).removeClass(CSSClass);

	$(e).addClass(CSSClass);

	setTimeout(function() {
		$(e).removeClass(CSSClass);
	}, 1000);
}


$(function() {

	$(".cell").each(function() {
		this.ondrop = function (e){
			e.preventDefault();

			anim(this, 'cellDrop')

			console.log(e.dataTransfer.files)
		};
	});


});