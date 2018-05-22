var verse = '',
    edition = "xml/edition-i.xml",
    translation = "xml/translation.xml",
    msa = "xml/ms_a.xml",
    msb = "xml/ms_b.xml",
    msc = "xml/ms_c.xml";

function initialize() {
    var chapter = getUrlParameter('c'),
	verse = getUrlParameter('v'),
	dfd = $.Deferred();
    load_edition(chapter,verse);
    load_translation(chapter,verse);
    load_apparatus(chapter,verse);
    load_manuscripts(chapter,verse,'a');
    load_manuscripts(chapter,verse,'b');
    load_manuscripts(chapter,verse,'c');
    setTimeout(function() {
	loadConspectus();
	$('[data-toggle="tooltip"]').tooltip();
    },500);
};

function toc() {
    $.when($.get(msa),$.get(msb),$.get(msc),$.get(edition),$.get(translation)).done(function(a,b,c,ed,tr) {
	var container = $("<div class='toc-columns mx-2 my-2'></div>"),
	    chapters = 3,
	    verses = [ 149, 155, 231 ],
	    atotal = 0, 
	    btotal = 0,
	    ctotal = 0,
	    edtotal = 0,
	    trtotal = 0,
	    totalverses = 0,
	    verse, chapter;
	for (chapter = 1; chapter < 4; chapter++) {
	    var chaptercontainer = $("<div class='chapter'></div>"),
		list = $("<ul class='list-unstyled'></ul>");
	    chaptercontainer.append("<h4 class='ml-1'>Chapter "+chapter.toString()+"</h4>");
	    for (verse = 1; verse <= verses[chapter-1]; verse++) {
		var link = $("<span class='text-muted'>"+verse.toString()+"</span>"),
		    li = $("<li class='unedited' style='display:none;'></li>"),
		    left = $("<span class='leftside'></span>");
		    edition = $(ed).find("div[n='"+chapter.toString()+"']").find("*[n='"+verse.toString()+"']");
		if (edition.length) {
		    var manuscripta = $(ed).find("div[n='"+chapter.toString()+"']").find("*[n='"+verse.toString()+"']"),
			manuscriptb = $(ed).find("div[n='"+chapter.toString()+"']").find("*[n='"+verse.toString()+"']"),
			manuscriptc = $(ed).find("div[n='"+chapter.toString()+"']").find("*[n='"+verse.toString()+"']"),
			translation = $(ed).find("div[n='"+chapter.toString()+"']").find("*[n='"+verse.toString()+"']"),
			excerpt = edition.find("l").first();
		    if (manuscripta.length) {
			atotal++;
			left.append("<span>a</span>");
		    }
		    if (manuscriptb.length) {
			btotal++;
			left.append("<span>b</span>");
		    }
		    if (manuscriptc.length) {
			ctotal++;
			left.append("<span>c</span>");
		    }
		    if (translation.length) {
			trtotal++;
			left.append("<span>tr</span>");
		    }
		    if (excerpt.length) {
			li.append("<span class='excerpt float-right'>"+excerpt.prop('innerHTML')+"</span>");
		    }
		    link = $("<a href='view.html?c="+chapter+"&v="+verse+"'>"+verse+"</a>");
		    edtotal++;
		    li.removeClass('unedited');
		    li.addClass('edited d-flex justify-content-between');
		}
		left.prepend(link);
		li.prepend(left);
		list.append(li);
		totalverses++;
	    }
	    chaptercontainer.append(list);
	    container.append(chaptercontainer);
	    /*
	    $(document).on("mouseenter",".edited", function() {
		$(this).find(".excerpt").show();
		console.log('triggered');
	    });
	    $(document).on("mouseleave",".edited", function() {
		$(this).find(".excerpt").hide();
	    });
	    */
	}
	$("#krm-index").append(container);
	var aprogress = percentageBar(atotal,totalverses),
	    bprogress = percentageBar(btotal,totalverses),
	    cprogress = percentageBar(ctotal,totalverses),
	    edprogress = percentageBar(edtotal,totalverses),
	    trprogress = percentageBar(trtotal,totalverses);
	$("#progress-a").append(aprogress);
	$("#progress-b").append(bprogress);
	$("#progress-c").append(cprogress);
	$("#progress-ed").append(edprogress);
	$("#progress-tr").append(trprogress);
	console.log(atotal,btotal,ctotal);
	$("#onlyedited").change(function() {
	    var unedited = $(".unedited");
	    if (this.checked) {
		unedited.hide();
		console.log(unedited);
	    } else { unedited.show(); }
	});
	$(".edited").on('click', function() {
	    var link = $(this).find("a[href]").attr('href');
	    window.location.href = link;
	});
    });
};

function filterTerms() {
    var $input = $("input[name='searchterm']"),
	$context = $("li");
    $input.on("input", function() {
	var term = $(this).val();
	$context.show().unmark();
	if (term) {
	    $context.mark(term, {
		done: function() {
		    $context.not(":has('mark')").hide();
		}
	    });
	}
    });
};

function percentageBar(q,r) {
    p = q/r * 100;
    return $('<div class="progress-bar" role="progressbar" style="width: '+p+'%" aria-valuenow="'+p+'" aria-valuemin="0" aria-valuemax="100"></div>');
}

function createRow(chapter,verse) {
    var chv = chapter + "-" + verse,
	row = $("<tr id='"+chv+"'></tr>");
    row.append("<td id='"+chv+"-label'></td>");
    row.append("<td id='"+chv+"-msa'></td>");
    row.append("<td id='"+chv+"-msb'></td>");
    row.append("<td id='"+chv+"-msc'></td>");
    row.append("<td id='"+chv+"-ed'></td>");
    row.append("<td id='"+chv+"-app'></td>");
    row.append("<td id='"+chv+"-tr'></td>");
    row.append("<td id='"+chv+"-notes'></td>");
    $("#krm-index-body").append(row);
}

function load_edition(chapter,verse) {
    var ixml = "xml/edition-i.xml",
        kxml = "xml/edition-k.xml",
	xslt = "xsl/edition.xsl";
    $.when($.get(ixml),$.get(kxml),$.get(xslt)).done(function(q,r,s) {
	var thisVerseTranslit = $(q).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']"),
	    thisVerseKannada = $(r).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']");
	/* build the navigation elements */
	var prev = $(thisVerseTranslit).prev("lg,trailer").attr("n");
	var next = $(thisVerseTranslit).next("lg,trailer").attr("n");
	if (prev != null) {
	    var q = $('<a class="btn btn-primary btn-sm" href="view.html?c='+chapter+'&v='+prev+'" role="button"><span class="fas fa-chevron-left" style="font-size:18px;vertical-align:middle;line-height:1.5em;"></span><br/><span class="nav-label">'+prev+'</span></a></div>');
	    $("#back-nav").append(q);
	}
	if (next != null) {
	    var q = $('<a class="btn btn-primary btn-sm" href="view.html?c='+chapter+'&v='+next+'" role="button"><span class="fas fa-chevron-right" style="font-size:18px;vertical-align:middle;line-height:1.5em;"></span><br/><span class="nav-label">'+next+'</span></a></div>');
	    $("#forward-nav").append(q);
	}
	/* other data: verse number */
	$("#number").append(verse);
	/* other data: name of the meter */
	var met = $(thisVerseTranslit).attr("met");
	$("#meter").append(met);
	/* generate the content using XSLT */
	var iContent = transformXSLT(thisVerseTranslit[0],s[0]),
	    kContent = transformXSLT(thisVerseKannada[0],s[0]);
	/* append the content in the right place */
	$('#ed-roman').append(iContent);
	$('#ed-kannada').append(kContent);
    });
};

function load_apparatus(chapter,verse) {
    var xml = 'xml/edition-i.xml',
	xslt = 'xsl/apparatus.xsl';
    $.when($.get(xml),$.get(xslt)).done(function(q,r) {
	var thisverse = $(q).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']"),
	    apparatus = thisverse.find("note[type='apparatus']"),
	    parallels = thisverse.find("note[type='parallels']");
	if (apparatus.length !== 0) {
	    var content = transformXSLT(apparatus[0],r[0]);
	    $('#apparatus').append(content);
	}
	if (parallels.length !== 0) {
	    var pars = transformXSLT(parallels[0],r[0]);
	    $("#parallels").append(pars);
	}
    });
}

function load_translation(chapter,verse) {
    var txml = 'xml/translation.xml',
	xslt = 'xsl/translation.xsl';
    $.when($.get(txml),$.get(xslt)).done(function(q,r) {
	var thisVerseTrans = $(q).find("div[n='"+chapter+"']").find("lg[n='"+verse+"'],trailer[n='"+verse+"']"),
	    content = transformXSLT(thisVerseTrans[0],r[0]);
	$('#translation').append(content);
    });
};

function load_manuscripts(chapter,verse,wit) {
    var a = 'xml/ms_'+wit+'.xml',
	logical = 'xsl/edition.xsl',
	physical = 'xsl/ms_physical.xsl';
    $.when($.get(a),$.get(logical),$.get(physical)).done(function(a,logical,physical) {
	var thisVerse = $(a).find("div[n='"+chapter+"']").find("lg[n='"+verse+"'],trailer");
	// if the manuscript does transmit the section of text
	if ($(thisVerse).find("l").length) {
	    var content = transformXSLT(thisVerse[0],physical[0]),
		contentL = transformXSLT(thisVerse[0],logical[0]),
		folio = '',
		separator = '',
		line = '';
	    // if a preceding sibling has a foliation element
	    if ($(thisVerse).prev().find("pb").last().attr("n")) {
		folio += "folio " +$(thisVerse).prev().find("pb").last().attr("n"); 
	    // if the parent of the current verse has a foliation element
	    } else if ($(thisVerse).parent().find("pb").attr("n")) {
		folio += "folio " + $(thisVerse).parent().find("pb").attr("n");
	    // if the parent of the parent of the current verse...
	    } else if ($(thisVerse).parent().parent().find("pb").attr("n")) {
		folio += "folio " + $(thisVerse).parent().parent().find("pb").attr("n");
	    } else {
		folio += "[No folio number available.]";
	    }
	    if (folio != '') {
		separator = " – "
	    }
	    // if a preceding sibling has a lineation element
	    if ($(thisVerse).prev().find("lb").attr("n")) {
		line += "line ";
		line += $(thisVerse).prev().find("lb").attr("n"); 
		line += ":";
	    // if the sibling's parent (the chapter div) has a lineation
	    } else if ($(thisVerse).parent().find("lb").attr("n")) {
		line += "line "
		line += $(thisVerse).parent().find("lb").attr("n");
		line += ":";
	    // get a lineation anywhere in the text
	    } else if ($(thisVerse).parent().parent().find("lb").attr("n")) {
		line += "line "
		line += $(thisVerse).parent().parent().find("lb").attr("n");
		line += ":";
	    } else {
		line += "[No line number available.]";
	    }
	    var logicalWrapper = $('<div class="ms-logical-content" id="ms-'+wit+'-logical-content"></div>'),
		physicalWrapper = $('<div class="ms-physical-content" id="ms-'+wit+'-physical-content"></div>'),
		lineation = $('<div><p>'+folio+separator+line+'</p></div>');
	    logicalWrapper.append(contentL);
	    physicalWrapper.append(content);
	    $("#ms-"+wit+"-physical").append(lineation.clone());
	    $("#ms-"+wit+"-physical").append(notes);
	    if ($(content).length > 0) {
		$("#ms-"+wit+"-physical").append(physicalWrapper);
	    }
	    $("#ms-"+wit+"-logical").append(lineation.clone());
	    $("#ms-"+wit+"-logical").append(notes);
	    $("#ms-"+wit+"-logical").append(logicalWrapper);
	} else {
	// if the manuscript does not transmit the section of text
	    var warning = $("<span class='text-warning'>This manuscript does not transmit this part of the text.</span>");
	    $("#ms-"+wit+"-physical").append(warning.clone());
	    $("#ms-"+wit+"-logical").append(warning.clone());
	    if ($(thisVerse).find("note").length) {
		var note = $(thisVerse).find("note"),
		    notes = $(transformXSLT(note[0],logical[0]));
		$("#ms-"+wit+"-physical").append(notes.clone());
		$("#ms-"+wit+"-logical").append(notes.clone());
	    }
	}
    });
};

function loadConspectus(chapter,verse) {
    var a = $("#ms-a-logical-content").contents().clone(),
	b = $("#ms-b-logical-content").contents().clone(),
	c = $("#ms-c-logical-content").contents().clone();
    for (i = 0; i < 4; i++) {
	var row = $("<div class='row mb-2'></div>"),
	    col = $("<div class='col mx-4'></div>"),
	    num = i+1,
	    head = $("<h5 style='display:block;' class='m-0'>Line "+num.toString()+"</h5>");
	var atext = a.find(".l:nth-child("+num+")"),
	    btext = b.find(".l:nth-child("+num+")"),
	    ctext = c.find(".l:nth-child("+num+")");
	atext.add(btext).add(ctext)
	    .find(".lineation, .foliation, .label-line-number, .del, .binding-hole").remove();
	var aline = parLine(atext.html(),'A',num),
	    bline = parLine(btext.html(),'B',num),
	    cline = parLine(ctext.html(),'C',num);
	col.append(head).append(aline).append(bline).append(cline);
	var abdiff = diffLine('A','B',atext.text(),btext.text()),
	    bcdiff = diffLine('B','C',btext.text(),ctext.text()),
	    acdiff = diffLine('A','C',atext.text(),ctext.text());
	col.append(abdiff).append(bcdiff).append(acdiff);
	row.append(col);
	$("#conspectus").append(row);
    }
    $("#conspectus").prepend("<p class='mt-4'>This conspectus is for consultation purposes only: scribal insertions and deletions, as well as lineation and foliation, have been filtered out for the sake of visibility.</p>");
};

function parLine(text,label,num) {
    var par = $("<p class='mb-0'></p>");
    return par.append("<b>"+label+":</b> ")
	        .append("<span>"+text+"</span>");
}

function diffLine(label1,label2,string1,string2) {
    var diff = JsDiff.diffChars(string1,string2),
	par = $("<p class='mb-0 ml-1'></p>");
    par.append("<b>diff "+label1+" & "+label2+":</b> ");
    diff.forEach(function(part) {
	var color = part.added ? 'rgba(0,255,0,0.3)' :
		part.removed ? 'rgba(255,0,0,0.3)' : 'rgba(0,0,0,0)',
	    span = $("<span></span>").css('background-color',color);
	span.append(part.value);
	par.append(span);
    });
    return par;
}

/* gets the given parameter from the url */
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
/* XSLT transformation */
function transformXSLT(node,xsl) {
  xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  return xsltProcessor.transformToFragment(node,document);
}
