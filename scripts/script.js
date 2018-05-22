function setScript() {
    var val = localStorage.getItem("script");
    if (val == "devanagari") {
	$("input[name='script'][value='devanagari']").prop("checked",true);
	$("input[name='script'][value='devanagari']").parent().addClass("active");
    } else if (val == "kannada") {
	$("input[name='script'][value='kannada']").prop("checked",true);
	$("input[name='script'][value='kannada']").parent().addClass("active");
    } else {
	$("input[name='script'][value='iso']").prop("checked",true);
	$("input[name='script'][value='iso']").parent().addClass("active");
    }
    $("input[name='script']").on("change",function() {
	localStorage.setItem("script",this.value);
	location.reload();
    });
};

function translit() {
    var script = localStorage.getItem("script");
    if (script == "devanagari") { 
	iso = "kan-Deva"; 
    } else if (script == "kannada") { 
	iso ="kan-Kann";
    } else { 
	iso = "kan-Latn"; 
    }
    setTimeout(function() {
	$(document).find(".translit").contents().each(function() {
	    $(this).filter(function() {
		return this.nodeType == 3;
	    }).each(function() {
		if ($(this).parent('.trika-pattern').length && script != 'iso') {
		    q = expandTrikas($(this).text().toLowerCase());
		} else {
		    q = $(this).text().toLowerCase(); /* the content of the node */
		}
		if (script == "iso") { /* if it is iso already, ignore */
		    y = q;
		} else { /* otherwise preprocess and transliterate */
		    r = preprocess(script,q); 
		    y = Sanscript.t(r,'iso',script);
		} 
		/* wrap the entire element in a span */
		z = $('<span class="'+iso+'"></span>').append(y);
		$(this).replaceWith(z);
	    });
	});
    }, 50);
};

function expandTrikas(t) {
    var result = '';
    for (i = 0; i < t.length; i++) {
	result += t.charAt(i) + 'a';
    }
    return  result;
};

// Preprocess strings from ISO to Devanāgarī. 
function preprocess(script,x) {
    /* generic routines to remove spaces */
    var trans = x.replace(/ ’/g,"'")
 	    .replace(/’/g,"'")
	    .replace(/aï/g,"a####i")
	    .replace(/aü/g,"a####u")
	    .replace(/([rnmd]) ([gṅjñḍṇdnbmhyvrlaāiīuūeēoō])/g,"$1$2")
	    .replace(/([kcṭtpśsṣ]) ([kcṭtpśsṣ])/g,"$1$2")
	    .replace(/([vy]) ([aāiīuūeo])/g,"$1$2");
    trans = removeAccents(trans);
    if (script == "kannada") {
	trans = trans.replace(/([ṅñṇnm])([kgcjṭḍtdpbyvrlśṣs])/g,"ṁ$2");
    }
    return trans;
};

function removeAccents(string) {
    var output = string.replace(/á/g,"a")
	    .replace(/ā́/g,"ā")
	    .replace(/í/g,"i")
	    .replace(/ú/g,"u");
    return output;
};
