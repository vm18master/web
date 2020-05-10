//////////////////////////////
// Plugin vm18.
//////////////////////////////

function VM18() {
	this.$ = window.$18;
}
VM18.prototype.$ = this.$;



//////////////////////////////
// Global Configuration.
//////////////////////////////
// Configuration of plugin css
// TODO Public url
//var PLUGIN_CSS = "../style/plugin-vm18.css"

// TODO Metadata resource
// Na versão GM 1.2, carregar css a partir do metadata.
// Os valores de @resource estarão em GM_info.script.resources.
// Substituir o método "styleDynamicLoad(url)" em cada plugin por um automático aqui.

// Load style dynamically.
function styleDynamicLoad(url) {
	var css = document.createElement("link");
	css.href = url;
	css.type = "text/css";
	css.rel ="stylesheet";
	$("head").append(css);
}

// Configuration with @grant
//var cssResource = GM_getResourceText("jquery-ui-css");
//GM_addStyle(cssResource);

// Configuration of plugin css
//var pluginCss = document.createElement("link");
//pluginCss.href = PLUGIN_CSS;
//pluginCss.type = "text/css";
//pluginCss.rel ="stylesheet";
//$("head").append(pluginCss);

var vm18css =
'<style type="text/css">                ' +
'                                       ' +
'#plugin-panel {                        ' +
'    cursor: help;                      ' +
'    left: 50%;                         ' +
'    position: fixed;                   ' +
'    top: 0;                            ' +
'    width: 300px;                      ' +
'    z-index: 1000000;                  ' +
'}                                      ' +
'#container-evaluate-toggle {           ' +
'    background: buttonface;            ' +
'    border: 2px outset buttonshadow;   ' +
'    height: 10px;                      ' +
'    margin: auto;                      ' +
'    width: 100px;                      ' +
'}                                      ' +
'#container-evaluate textarea {         ' +
'	 font-family: monospace;            ' +
'    font-size: 12px;                   ' +
'    width: 98%;                        ' +
'}                                      ' +
'#plugin-panel .configuration {         ' +
'    width: 98%;                        ' +
'    text-align: right;                 ' +
'}                                      ' +
'                                       ' +
'#plugin-panel .configuration label {   ' +
'    color: white;                      ' +
'    background: steelblue;             ' +
'    border-radius: 3px;                ' +
'}                                      ' +
'                                       ' +
'</style>                               ' +
'';

var vm18panel =

'<div id="plugin-panel">                                                        ' +
'	<div id="container-evaluate">                                               ' +
'	<div class="configuration">                                                 ' +
'	<label title="Ambiente de Desenvolvimento"><input type="checkbox" id="ambienteDesenvolvimento">Desenvolvimento</label>' +
'	</div>                                                                      ' +
'	<textarea id="evaluate" rows="1" cols="20"></textarea>                      ' +
'	<textarea id="plugin-message" rows="3" cols="20"></textarea>                ' +
'	</div>                                                                      ' +
'	<div id="container-evaluate-toggle"></div>                                  ' +
'</div>                                                                         ' +
'';



/**
 * Register a component in window.
 * 
 * @param component - class, function or attribute
 * @param name - optional
 * @returns component
 */
function registerComponent(component, name) {
	try {
		if (!name) {
			name = component.name;
		}
		if (!name) {
			console.error("Erro ao registrar componente.", "[Component]", component, "[Name]", name);
			return;
		}
		window[name] = component;
		return component;
	} catch (e) {
		console.error("Exceção ao registrar componente.", component, name, e);
	}
}



////////////////////////////////////////
// Style Configuration.
////////////////////////////////////////
$18(document).ready(function($) {
	
	// TODO Config function context.
	// var context = window or VM18.prototype
	// function createDialogReady() {alert($.fn.jquery);}
	// context.createDialogReady = createDialogReady;
	// window.createDialogReady = createDialogReady;
	// VM18.prototype.createDialogReady = createDialogReady;

	// Plugin style
    $("head").append(vm18css);
    // Plugin panel
    $("body").append(vm18panel);
    $("#evaluate").blur(function() {
        try {
            var result = eval(this.value);
            log(result);
        } catch(e) {
            log(e);
        }
    });
    $("#container-evaluate-toggle").click(function() {
        $("#container-evaluate").slideToggle(250);
    });
    $("#container-evaluate-toggle").trigger("click");
    // Plugin extra css
    $("head").append('<style type="text/css">' + vm18extraCss + '</style>');
    
    // Configuração do ambiente de Desenvolvimento
    $("#plugin-panel #ambienteDesenvolvimento").prop("checked", AMBIENTE_DESENVOLVIMENTO);
    if (AMBIENTE_DESENVOLVIMENTO) {
    	$("#container-evaluate-toggle").css("background", "steelblue");
	}
    $("#plugin-panel #ambienteDesenvolvimento").change(function(event){
      var desenv = this.checked ? 1 : "";
      localStorage.setItem(STORAGE_KEY_AMBIENTE_DESENVOLVIMENTO, desenv);
    });



    // Dialog UI
    /**
     * Dialog jQuery UI.
     * @param Javascript object with options. See examples. Optional.
     * @returns jQuery object with dialog content.
     * 
     * Ex.
     * 
     * var dialogBox = createDialog();
     * var dialogBox = createDialog({
     * 	   title    : "Message",
     * 	   modal    : true,
     * 	   autoOpen : false,
     * });
     * var dialogBox = createDialog({
     * 	   title    : "Message",
     * 	   modal    : true,
     * 	   autoOpen : true,
     * 	   width    : 370,
     * 	   height   : 200,
     * 	   buttons: {
     * 	   	Ok: function() {
     * 	   		$(this).dialog("close");
     * 	   	}
     * 	   }
     * });
     * 
     */
    var DIALOG_CLASS = "vm18-dialog";
    function createDialog({
    	    title = "",
    		modal = true,
    		autoOpen = true,
    		width = 370,
    		height = 200,
    	}={}) {
    	// Default parameter options
    	var options = {
    		title: title,
    		modal: modal,
    		autoOpen: autoOpen,
    		width: width,
    		height: height,
    	};
    	
    	// Join all options
    	var parameterOptions = arguments[0];
    	Object.assign(options, parameterOptions);
    	
    	var dialogBox = $('<div>');
    	dialogBox.dialog(options);
    	
    	// Default css style
    	dialogBox.parent().addClass(DIALOG_CLASS);
    	
    	//console.log("Dialog options ",options);
    	
    	return dialogBox;
    }

    function openDialog(dialogBox) {
    	$(dialogBox).dialog("open");
    }

    function closeDialog(dialogBox) {
    	$(dialogBox).dialog("close");
    }
    
    ////////////////////////////////////////
    // Registry of component
    ////////////////////////////////////////
    registerComponent(createDialog);
    registerComponent(openDialog);
    registerComponent(closeDialog);

}); // ready

// jQuery $ alias
//(function($) {
//	  $(function() {
//	  });
//	  console.log("jQuery version", $.fn.jquery)
//})($18);

/**
 * Configuration of extra css.
 * @param css
 *     Ex. "body {color: red;}"
 * @returns
 */
var vm18extraCss = "";
function styleConfiguration(css) {
	vm18extraCss += css;
}

//////////////////////////////
// Configuration of plugin css
// TODO Public url. File style/plugin-vm18.css.
//////////////////////////////
styleConfiguration(
'/**                                    ' +
'Plugin vm18 Style.                     ' +
'**/                                    ' +
'                                       ' +
'/**                                    ' +
'Basic                                  ' +
'**/                                    ' +
'.center {                              ' +
'	text-align: center;                 ' +
'}                                      ' +
'.left {                                ' +
'	text-align: left;                   ' +
'}                                      ' +
'.right {                               ' +
'	text-align: right;                  ' +
'}                                      ' +
'.nodisplay {                           ' +
'    display: none;                     ' +
'}                                      ' +
'.hidden {                              ' +
'    visibility: hidden;                ' +
'}                                      ' +
'.block {                               ' +
'    display: block;                    ' +
'}                                      ' +
'.float-left {                          ' +
'    float: left;                       ' +
'}                                      ' +
'.float-right {                         ' +
'    float: right;                      ' +
'}                                      ' +
'                                       ' +
'                                       ' +
'/**                                    ' +
'Table                                  ' +
'**/                                    ' +
'.table {                               ' +
'	display: table;                     ' +
'	width: 100%;                        ' +
'}                                      ' +
'.tr {                                  ' +
'	display: table-row;                 ' +
'}                                      ' +
'.td {                                  ' +
'	display: table-cell;                ' +
'}                                      ' +
'                                       ' +
'.table-colecao {                       ' +
'    font-size: 9px;                    ' +
'    margin-left: 40px;                 ' +
'}                                      ' +
'.table-colecao tr:nth-child(odd) {     ' +
'    background: #eeeeee;               ' +
'}                                      ' +
'.table-colecao td {                    ' +
'    padding-right: 10px;               ' +
'}                                      ' +
''
)



/**
 * Obter objeto "window" original da janela.
 */
function originalWindow() {
	return unsafeWindow;
}



/**
 * Check for a condition until it is ready and execute a function.
 * 
 * Ex.
 * checkReady("window.ok", function($) {
 * 	console.log("Service checkReady call ",$);
 * }, "$", 300, 5000);
 */
function checkReady(evalCondition, callback, evalReturn=undefined, frequency=100, timeout=60000) {
	if (eval(evalCondition)) {
		callback(eval(evalReturn));
	} else {
		if (timeout <= 0) {
			console.log("Service checkReady '"+evalCondition+"' timeout");
			return;
		}
		window.setTimeout(function() { checkReady(evalCondition, callback, evalReturn, frequency, timeout-frequency); }, frequency);
	}
}

/**
 * XPath.
 * @param expression
 *     Ex. '//img[@src]'
 * @returns
 */
function findXPath(expression, scope) {
	if (!scope) {scope = document;}
	
	// XPath
	var result = document.evaluate(expression,
		scope,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);

    var elements = new Array(result.snapshotLength);
    for (var i = 0; i < result.snapshotLength; i++) {
        elements[i] = result.snapshotItem(i);
    }

    return elements;
}

function message(msg) {
    $("#plugin-message").val("");
    $("#plugin-message").val(msg);
}

function log(msg) {
	var atual = $("#plugin-message").val();
	$("#plugin-message").val(atual + '\n' + msg);
}

/**
 * Selects the text nodes.
 * @param selector - jQuery selector.
 * @param whitespaces - Boolean.
 */
function textNodes(selector, whitespaces) {
	// text nodes
	var $textNodes = $(selector).contents().filter(function() {
	    return this.nodeType == Node.TEXT_NODE; // 3
	});
	if (whitespaces) {
		return $textNodes;
	}
	// filter whitespaces
	$textNodes = $textNodes.filter(function() {
		return this.data.trim() != "";
	});
	return $textNodes;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * List events of element.
 * 
 * Ex. getEvents("body")
 */
function getEvents(uniqueElementSelector) {
  var $element = $(uniqueElementSelector).eq(0);
  return $._data($element[0], "events");
}

// Seleciona partes de texto, simulando um mouse dragging.
function selectText(selector) {
	var $element = $(selector);
	var selection, range;
	
	if (window.getSelection) {
		selection = window.getSelection();        
		//selection.removeAllRanges();
		$element.each(function(i) {
			range = document.createRange();
			range.selectNodeContents(this);
			selection.addRange(range);
		});
	}
}

var clipboardFlashHtml =
                                   
'<object id="clippy" width="${width}" height="${height}"                        ' +
'     classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">                     ' +
'<param value="https://www.assembla.com/clippy.swf" name="movie">               ' +
'<param value="text=${clipboard}" name="FlashVars">                             ' +
'<param value="always" name="allowScriptAccess">                                ' +
'<param value="high" name="quality">                                            ' +
'<param value="noscale" name="scale">                                           ' +
'<param value="#FFFFFF" name="bgcolor">                                         ' +
'<param value="transparent" name="wmode">                                       ' +
'<embed width="${width}" height="${height}" bgcolor="#FFFFFF"                   ' +
'	flashvars="text=${clipboard}" type="application/x-shockwave-flash"          ' +
'	name="clippy" src="https://www.assembla.com/clippy.swf"                     ' +
'	pluginspage="http://www.macromedia.com/go/getflashplayer"                   ' +
'	allowscriptaccess="always" quality="high" wmode="transparent">              ' +
'</object>                                                                      ' +
'';

/**
 * Clipboard Flash.
 * Constrói um flash para copiar texto para o clipboard.
 * A cópia ocorre no evento onclick.
 * Ex.
 * $("body").append(clipboardFlash("Copy this to clipboard!"));
 */
function clipboardFlash(string, width, height) {
	if (!width) {width = 150}
	if (!height) {height = 20}
	
	var html = clipboardFlashHtml;
	html = html.replace(/\${clipboard}/g, string);
	html = html.replace(/\${width}/g, width);
	html = html.replace(/\${height}/g, height);
	return html;
}


