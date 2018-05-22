var ei = "xml/edition-i.xml",
    ek = "xml/edition-k.xml";

function check() {
    $.when($.get(ei),$.get(ek)).done(function(x,y) {
	var row = $("<div class='row mt-4'></div>"),
	    col = $("<div class='col-10 offset-1'></div>"),
	    rowh = $("<div class='row mt-4'><div class='col-4 offset-1 text-center'><p class='m-0'><b>Romanized Edition</b></p></div><div class='col-4 offset-1 text-center'><p class='mb-0'><b>Kannada Edition</b></p></div></div>");
	$(x).find("lg").each(function(n) {
	    var chapter = $(this).closest("div").attr("n"),
		verse = $(this).attr("n"),
		vrow = $("<div class='row mb-1'></div>"),
		leftcol = $("<div class='col-6'></div>"),
		rightcol = $("<div class='col-6'></div>"),
		ekverse = $(y).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']"),
		comprow = $("<div class='row mb-3'></div>"),
		compheader = $("<div class='col-1 text-right'><b>diff:</b></div>"),
		compcol = $("<div class='col-10'></div>"),
		left = [],
		right = [];
	    col.append("<h5>"+chapter+"."+verse+"</h5>");
	    $(this).find("l").each(function(o) {
		var text = $(this).text()
			        .replace(/’/g,'')
			        .replace(/ /g,'')
		                .replace(/-/g,'');
		leftcol.append(text+"<br/>");
		left.push(text);
	    });
	    $(ekverse).find("l").each(function(n) {
		var ktext = $(this).text(),
		    rtext = Sanscript.t(ktext,'kannada','iso')
		                  .replace(/ṁ([td])/g,'n$1')
		                  .replace(/ṁ([kg])/g,'ṅ$1')
                                  .replace(/’/g,'')
			          .replace(/ /g,'')
		                  .replace(/-/g,'');
		rightcol.append(rtext+"<br/>");
		right.push(rtext);
	    });
	    vrow.append(leftcol).append(rightcol);
	    col.append(vrow);
	    for (var q = 0; q < left.length; q++) {
		var l = left[q],
		    r = right[q],
		    ds = JsDiff.diffChars(l,r);
		ds.forEach(function(part) {
		    var color = part.added ? 'rgba(0,255,0,0.3)' :
			          part.removed ? 'rgba(255,0,0,0.3)' : 'rgba(0,0,0,0)',
			span = $("<span></span>").css('background-color',color);
		    span.append(part.value);
		    compcol.append(span);
		});
		compcol.append("<br/>");
	    }
	    comprow.append(compheader).append(compcol);
	    col.append(comprow);
	});
	row.append(col);
	$("#check").append(rowh).append(row);
    });
};
