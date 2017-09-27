var verse = '',
    edition = "xml/edition-i.xml",
    translation = "xml/translation.xml",
    msa = "xml/ms_a.xml",
    msb = "xml/ms_b.xml",
    msc = "xml/ms_c.xml";

function initialize() {
    chapter = getUrlParameter('c');
    verse = getUrlParameter('v');
    load_edition(chapter,verse);
    load_translation(chapter,verse);
    load_apparatus(chapter,verse);
    load_manuscripts(chapter,verse,'a');
    load_manuscripts(chapter,verse,'b');
    load_manuscripts(chapter,verse,'c');
};

function toc() {
    for (chapter = 1; chapter < 4; chapter++) {
	if (chapter == 1) {
	    for (verse = 1; verse < 150; verse++) {
		createRow(chapter,verse);
	    }
	} else if (chapter == 2) {
	    for (verse = 1; verse < 156; verse++) {
		createRow(chapter,verse);
	    }
	} else if (chapter == 3) {
	    for (verse = 1; verse < 232; verse++) {
		createRow(chapter,verse);
	    }
	}
    }
    $.when($.get(msa),$.get(msb),$.get(msc),$.get(edition),$.get(translation)).done(function(a,b,c,ed,tr) {
	var totalverses = $("tr[id]").length,
	    atotal = 0,
	    btotal = 0,
	    ctotal = 0,
	    edtotal = 0,
	    apptotal = 0,
	    trtotal = 0,
	    notetotal = 0;
	$("tr[id]").each(function() {
	    var id = $(this).attr("id"),
		ch = id.split('-')[0],
		v = id.split('-')[1].split('-')[0],
		aEl = $(a).find("div[n='"+ch+"']").find("lg[n='"+v+"'],trailer[n='"+v+"']"),
		bEl = $(b).find("div[n='"+ch+"']").find("lg[n='"+v+"'],trailer[n='"+v+"']"),	    
		cEl = $(c).find("div[n='"+ch+"']").find("lg[n='"+v+"'],trailer[n='"+v+"']"),
		edEl = $(ed).find("div[n='"+ch+"']").find("lg[n='"+v+"'],trailer[n='"+v+"']"),
		appEl = edEl.find("note[type='apparatus']"),
		trEl = $(tr).find("div[n='"+ch+"']").find("lg[n='"+v+"'],trailer[n='"+v+"']"),
		noteEl = trEl.find("note"),
		livelink = $("<a href='view.html?c="+ch+"&v="+v+"'>"+ch+"."+v+"</a>"),
		deadlink = $("<span class='text-muted'>"+ch+"."+v+"</span>"),
		linktd = $("tr[id='"+id+"']").find("td[id='"+id+"-label']");
	    linktd.html(deadlink);
	    if (aEl.length !== 0) {
		$("tr[id='"+id+"']").find("td[id='"+id+"-msa']").append("<b>✓</b>");
		atotal++;
		linktd.html(livelink);
	    } else { 
		$("tr[id='"+id+"']").find("td[id='"+id+"-msa']").append("<span class='text-muted'>—</span>");
	    }
	    if (bEl.length !== 0) {
		$("tr[id='"+id+"']").find("td[id='"+id+"-msb']").append("<b>✓</b>");
		btotal++;
		linktd.html(livelink);
	    } else { 
		$("tr[id='"+id+"']").find("td[id='"+id+"-msb']").append("<span class='text-muted'>—</span>");
	    }
	    if (cEl.length !== 0) {
		$("tr[id='"+id+"']").find("td[id='"+id+"-msc']").append("<b>✓</b>");
		ctotal++;
		linktd.html(livelink);
	    } else { 
		$("tr[id='"+id+"']").find("td[id='"+id+"-msc']").append("<span class='text-muted'>—</span>");
	    }
	    if (edEl.length !== 0) {
		$("tr[id='"+id+"']").find("td[id='"+id+"-ed']").append("<b>✓</b>");
		edtotal++;
		linktd.html(livelink);
	    } else { 
		$("tr[id='"+id+"']").find("td[id='"+id+"-ed']").append("<span class='text-muted'>—</span>");
	    }
	    if (appEl.length !== 0) {
		$("tr[id='"+id+"']").find("td[id='"+id+"-app']").append("<b>✓</b>");
		apptotal++;
		linktd.html(livelink);

	    } else { 
		$("tr[id='"+id+"']").find("td[id='"+id+"-app']").append("<span class='text-muted'>—</span>");
	    }
	    if (trEl.length !== 0) {
		$("tr[id='"+id+"']").find("td[id='"+id+"-tr']").append("<b>✓</b>");
		trtotal++;
		linktd.html(livelink);
	    } else { 
		$("tr[id='"+id+"']").find("td[id='"+id+"-tr']").append("<span class='text-muted'>—</span>");
	    }
	    if (noteEl.length !== 0) {
		$("tr[id='"+id+"']").find("td[id='"+id+"-notes']").append("<b>✓</b>");
		notetotal++;
		linktd.html(livelink);
	    } else { 
		$("tr[id='"+id+"']").find("td[id='"+id+"-notes']").append("<span class='text-muted'>—</span>");
	    }
	    /* give the progress */
	});
	var aprogress = percentageBar(atotal,totalverses),
	    bprogress = percentageBar(btotal,totalverses),
	    cprogress = percentageBar(ctotal,totalverses),
	    edprogress = percentageBar(edtotal,totalverses),
	    appprogress = percentageBar(apptotal,totalverses),
	    trprogress = percentageBar(trtotal,totalverses),
	    noteprogress = percentageBar(notetotal,totalverses);
	$("#progress-a").append(aprogress);
	$("#progress-b").append(bprogress);
	$("#progress-c").append(cprogress);
	$("#progress-ed").append(edprogress);
	$("#progress-app").append(appprogress);
	$("#progress-tr").append(trprogress);
	$("#progress-notes").append(noteprogress);
    });
    $("#excuse-me").delay(2000).queue(function() { 
	$(this).remove(); 
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
	var prev = $(thisVerseTranslit).prev("lg,trailer").attr("n")
	var next = $(thisVerseTranslit).next("lg,trailer").attr("n")
	if (prev != null) {
	    var q = $('<a class="btn btn-primary btn-sm" href="view.html?c='+chapter+'&v='+prev+'" role="button"><span class="fa fa-chevron-left" style="font-size:18px;vertical-align:middle;line-height:1.5em;"></span><br/><span class="nav-label">'+prev+'</span></a></div>');
	    $("#back-nav").append(q);
	}
	if (next != null) {
	    var q = $('<a class="btn btn-primary btn-sm" href="view.html?c='+chapter+'&v='+next+'" role="button"><span class="fa fa-chevron-right" style="font-size:18px;vertical-align:middle;line-height:1.5em;"></span><br/><span class="nav-label">'+next+'</span></a></div>');
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
	var apparatus = $(q).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']").find("note[type='apparatus']");
	if (apparatus.length !== 0) {
	    content = transformXSLT(apparatus[0],r[0]);
	    $('#apparatus').append(content);
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
	console.log("trying "+chapter+"."+verse+", witness "+wit);
	var thisVerse = $(a).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']");
	console.log(thisVerse);
	var content = transformXSLT(thisVerse[0],physical[0]),
	    contentL = transformXSLT(thisVerse[0],logical[0]),
	    folio = 'folio ',
	    separator = '',
	    line = '';
	if ($(thisVerse).prev().find("pb").last().attr("n")) {
	    folio += $(thisVerse).prev().find("pb").last().attr("n"); 
	    console.log("case 1");
	} else if ($(thisVerse).parent().find("pb").attr("n")) {
	    folio += $(thisVerse).parent().find("pb").attr("n");
	    console.log("case 2");
	} else {
	    folio += "[No folio number available.]";
	}
	if (folio != '') {
	    separator = " – "
	}
	if ($(thisVerse).prev().find("lb").last().attr("n")) {
	    line += "line ";
	    line += $(thisVerse).prev().find("lb").last().attr("n"); 
	    line += ":";
	} else if ($(thisVerse).parent().find("lb").last().attr("n")) {
	    line += "line "
	    line += $(thisVerse).parent().find("lb").last().attr("n");
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
	$("#ms-"+wit+"-physical").append(physicalWrapper);
	$("#ms-"+wit+"-logical").append(lineation.clone());
	$("#ms-"+wit+"-logical").append(logicalWrapper);
    });
};

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
