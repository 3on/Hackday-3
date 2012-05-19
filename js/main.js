function anim(e, CSSClass) {
	if($(e).hasClass(CSSClass))
		$(e).removeClass(CSSClass);

	$(e).addClass(CSSClass);

	setTimeout(function() {
		$(e).removeClass(CSSClass);
	}, 500);
}

function templating (tmpl, data, selector) {
	$(selector).empty();
	var template = _.template($(tmpl).html(), data);
	$(selector).append(template);
}

function squaredSized(width, height) {
  var w = 0, h = 0;

  if(width <= height) {
    w = width;
    h = width;
  } else {
    w = height;
    h = height;
  }

  return {sWidth: w, sHeight: h, sx: 0, sy: 0};
}

function addPic (file, i) {
	var reader = new FileReader();

	reader.onload = function(e) {
		var urlData = e.target.result;
		var selector = $("#grid .cell")[i];
		
		templating("#tmpl-write", {}, selector);
		var canvas = $(selector).find('canvas')[0];
		var ctx = canvas.getContext('2d');
		var image = new Image();

		image.onload = function() {
			var dim = squaredSized(image.width, image.height);
			ctx.drawImage(image, dim.sx, dim.sy, dim.sWidth, dim.sHeight, 0, 0, 160, 160);

			window.pics.push({id: i,  data: canvas.toDataURL()});
			//delete imgage;
		};

		image.src = urlData;

	};

	reader.readAsDataURL(file);
}


function bindings () {
	$(".cell").each(function(i) {
		this.ondrop = function (e){
			e.preventDefault();

			anim(this, 'cellDrop');
			
			var file = e.dataTransfer.files[e.dataTransfer.files.length - 1];
			addPic(file, i);
		};

		this.ondragenter = function(e){
			anim(this, 'cellDragEnter')
		}
	});
}

function redraw() {
	pics.forEach(function(e){
		$($("#grid .cell")[e.id]).empty();
		templating("#tmpl-read", {urlData: e.data}, $("#grid .cell")[e.id]);
	});
}


$(function() {
	bindings();
});


require(['dotcloud'], function(dotcloud){
	dotcloud.ready(function(dotcloud){
		window.pics = dotcloud.sync.synchronize('pics');

		pics.observe(function(type, change){
			console.log("change of type: " + type + " with ", change);

			if(type == "synchronized") {
				redraw();
			}
		});
	});
});
