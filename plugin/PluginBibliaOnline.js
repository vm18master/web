//////////////////////////////
// PluginBibliaOnline
//////////////////////////////

//////////////////////////////
// Overlay para localizar livro, capítulo e versículo.
//   - Tecla Esc
// Copiar um verso.
//   - Duplo clique
// Corrige o estilo.
// Remove ad.
//////////////////////////////

var WINDOW_OPEN_DELAY = 5000;

// Bible dialog object
var dialogBible = null;

function init() {
	configBibliaOnline();
}

/**
 * Configura BibliaOnline.
 */
function configBibliaOnline() {
	console.log("Script configBibliaOnline");
	
	// Style
	configDesign();
	
	// Localizar versículo
	highlightVersiculo();
	
	$(document).bind('keydown', function(e){
		// Previous and Next Chapter
		//if (e.keyCode == 37) {        // <-
		//	$("a.previous")[0].click();
		//} else if (e.keyCode == 39) { // ->
		//	$("a.next")[0].click();
		//} else 
		if ((e.ctrlKey && e.shiftKey)       || // ctrl + shift
			(e.ctrlKey && e.keyCode == 222) || // ctrl + '
			(e.keyCode == 145)) {              // Scroll Lock
			manageBibleTool();
		}
		if (e.keyCode == 27) { // Esc
			manageBibleTool();
		}
		//	} else if (e.keyCode == 188) {     // <
		//		$(".rsArrowLeft").click();     // Previous
		//	} else if (e.keyCode == 190) {     // >
		//		$(".rsArrowRight").click();    // Next
	});
    
	// Configurar evento para copiar versos
	configCopy();
	
	// Retira focus do search input
	$("header button").focus();
	
    log('Plugin BibliaOnline ready!');
}

function configDesign() {
	var $header = $(".entered h1");
    $header.append(" <b>18</b>");
	
	// Flutuar side bar
	//	var $chapterSidebar = $("#ChapterSidebar")
	//	var $children = $chapterSidebar.children();
	//	var $flutuar = $('<div class="sidebar-flutuar">').appendTo($chapterSidebar).append($children);
	
	removeAd();
}

/**
 * Remove ad
 * Verifica o aparecimento de ad,
 * a cada 3s durante 30s desde o último encontrado.
 */
function removeAd() {
	// console.log("Removing ad",$("iframe").length,new Date())
	
	$("script[src*=ads],link[href*=ads]").remove();
	$("script[src*=facebook]").remove();
	$("script[src*=twitter]").remove();
	
	$("iframe").remove();
	
	checkReady('$("iframe").length > 0',removeAd,"",3000,30000);
}

/**
 * Localiza um versículo na página, de acordo com a url.
 * 
 * Ex.
 * http://www.bibliaonline.com.br/nvi+acf/jo/3/16+
 */
function highlightVersiculo() {
	var SCROLL_OFFSET = 300;
	
	var url = window.location.href;
	url = url.split("/");
	
	var numero = url[6];
	if (!numero) { return; }
	numero = numero.substr(0, numero.indexOf('+'));
	var $versoNumber = $("sup:contains(" + numero + ")");
	if (!$versoNumber.length) { return;	}
	
	$versoNumber.css('color', 'blue');
	$('html, body').animate({
		scrollTop: $versoNumber.offset().top - SCROLL_OFFSET
	}, 200);
}

// Function to open window with localization
// Firefox preference config to open tab in background.
// "browser.tabs.loadDivertedInBackground"
var openLocalization = function(href, info="", delay=0) {
	console.log('Plugin open', info ? "["+info+"]" : "", href);
	setTimeout(function() { window.open(href); }, delay);
};

/**
 * Localiza o capítulo da Bíblia. Redireciona a página.
 * @param localization Ex. "jo 3 16"
 * @returns
 * 
 * Book/Chapter/Verse key
 * Ex. jo 3    => jo/3
 *     jo 3 16 => jo/3/16+
 *     jo 3 16/gn 1 1/ap 1 1 => Abrem-se múltiplas abas com a barra.
 * http://www.bibliaonline.com.br/nvi+aa/jo/3
 * http://www.bibliaonline.com.br/nvi+aa/jo/3/16+
 */
function localizarBiblia(localizationExpression) {
	// Single localization
	if (localizationExpression.indexOf('/') == -1) {
		var url = gerarUrlBiblia(localizationExpression);
		console.log(localizationExpression);
		window.location = url;
		return;
	}
	
	// Multiple localization
	var listLocalization = localizationExpression.split('/');
	var timer = 0;
	for (var i = 0; i < listLocalization.length; i++) {
		var localization = listLocalization[i];
		var url = gerarUrlBiblia(localization);
		// Abrir novas abas
		openLocalization(url, localization, timer * WINDOW_OPEN_DELAY);
		timer += 1;
	}
	$(".ui-dialog-titlebar").css("background","linear-gradient(#3b5588, white)");
}

/**
 * Gerar url Bíblia.
 * @param localization. Ex. jo 3 16 or jo 3.16
 * @returns url. Ex. http://www.bibliaonline.com.br/nvi+aa/jo/3/16+
 */
function gerarUrlBiblia(localization) {
	var delimiters = /[ .]/; // jo 3 16 or jo 3.16
	var part = localization.toLowerCase().split(delimiters);
	var livro     = part[0];
	var capitulo  = part[1];
	var versiculo = part[2];
	
	var url = window.location.href;
	url = url.split("/");
	var version = url[3];
	url = "//www.bibliaonline.com.br/" + version;
	url += "/" + livro;
	url += "/" + capitulo;
	if (versiculo) {
		url += "/" + versiculo + "+";
	}
	return url;
}

/**
 * Criar Bible tool.
 * @param id
 * @param content Html content. Ex. "<div><h2>Title</h2><div>Content</div></div>"
 * @returns jQuery div object with content.
 */
function manageBibleTool() {
	// Bible tool created
	if (dialogBible) {
		dialogBible.parent().toggle();
		var localization = dialogBible.find("#localization");
		localization.focus();
		return dialogBible;
	}
	
	// Bible tool construction
	var dialogBox = createDialog({
		title    : "Bíblia Online 18",
		modal    : false,
		autoOpen : true,
		width    : 500,
	});
	
	dialogBible = dialogBox
	
	var content = $('<div id="bible-tool">');
	var localization = $('<input type="text" id="localization">');
	content.append(localization);
	localization.attr("placeholder", "Referência...");
	localization.keydown(function(e){
		if (e.keyCode==13) {
			localizarBiblia(localization.val());
		}
	});
	localization.focus(function(e){
		if (localization.val().indexOf('/') == -1) {
			this.select();
		}
	});
	
	localization.val("jo 3 16");

	dialogBible.html(content);
	
	//css
	dialogBible.parent().css("border","8px solid rgba(82, 82, 82, 0.33)");
	dialogBible.parent().css("border-radius","15px");
	
	localization.focus();

	return dialogBible;
}

/**
 * Criar copy dialog.
 * @param verso
 * @param referência bíblica
 * @returns jQuery div object with content.
 */
var createCopyDialog = function(verso, reference) {
	// Copy dialog construction
	var dialogBox = createDialog({
		title    : reference,
		modal    : false,
		autoOpen : true,
		width    : 500,
	});
	
	var content = $('<div class="verso-copy">');
	var copy = $('<textarea>');
	content.append(copy);
	copy.val(verso + "\n" + reference);
	copy.keyup(function(e){
		if (copy.val() == "") {
			closeDialog(dialogBox);
		}
	});
	copy.focus(function(e){
		this.select();
	});
	dialogBox.html(content);
	copy.focus();
	return dialogBox;
};

/**
 * Configurar ação para copiar versos.
 * 
 * Duplo clique para copiar um verso.
 */
function configCopy() {
	var $chapter = $("header h2").eq(0).text();
	var $versos = $("article div p");
	$versos.dblclick(function(e){
		var $verso = $(this).clone();
		var $numeroVerso = $verso.find("sup").text();
		$verso.find("sup").remove();
		var text = $verso.text().trim();
		var reference = $chapter + "." + $numeroVerso;
		createCopyDialog(text, reference);
	});
}

$(document).ready(function() {
    try {
    	init();
	} catch (e) {
		console.log("Script exception!");
		console.log(e);
	}
});
