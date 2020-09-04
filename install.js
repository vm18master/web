////////////////////////////////////////
// Install
////////////////////////////////////////
console.log("Manager Install Plugin");

// Indicador de ambiente de desenvolvimento
var STORAGE_KEY_AMBIENTE_DESENVOLVIMENTO = "ambienteDesenvolvimento";
var AMBIENTE_DESENVOLVIMENTO = ambienteDesenvolvimento();

var url = window.location.href;

var BASE_URL = "https://vm18master.github.io/web";

// Url padrão de plugin 
var PLUGIN_URL = BASE_URL + "/plugin/{plugin}.js";

var VM18_INSTALL_VERSION      = "HEAD";
var VM18_INSTALL_URL          = BASE_URL + "/js/plugin-vm18.js";
var JQUERY_VERSION            = "1.12.4";
var JQUERY_INSTALL_URL        = "https://code.jquery.com/jquery-"+JQUERY_VERSION+".min.js";
var BOOTSTRAP_INSTALL_CSS     = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css";
var BOOTSTRAP_INSTALL_JS      = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js";
var JQUERY_UI_INSTALL_URL     = "https://code.jquery.com/ui/1.12.1/jquery-ui.js";
var JQUERY_UI_INSTALL_CSS     = "//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
var PLUGIN_DESIGN_INSTALL_CSS = BASE_URL + "/css/plugin-design.css";

var collectionPlugin = {
	// TODO Configurar dependências
	// "PluginBibliaOnline"  : new PluginConfiguration({url:/www.bibliaonline.com.br/,dependency:[{jQueryScriptInstaller:1,vm18ScriptInstaller:2}]}),
	"PluginBibliaOnline"   : /www.bibliaonline.com.br/,
	"PluginInscricaoCulto" : /ministeriodafe.com.br|doity.com.br/,
	"PluginWImoveis"       : /www.wimoveis.com.br|www.imovelweb.com.br/,
	"PluginMultiplus"      : /book.latam.com\/TAM\/dyn\/air\/redemption\/availability/,
	"pluginModelo"         : /Plugin Modelo pattern/,
	"PluginCred"           : /\/principal.jsp/,
	"PluginSimuladorCaixa" : /www8.caixa.gov.br\/siopiinternet/,
	"PluginFirefoxBookmark": /www.mozilla.org\/en-US\/firefox\/62.0\/releasenotes\//,
	"plugin3"              : /Plugin 3 pattern/, 
};

////////////////////////////////////////
// Configuração de desenvolvimento
////////////////////////////////////////
if (AMBIENTE_DESENVOLVIMENTO) {
	// Check ambiente desenvolvimento
	INSTALL_URL = "http://localhost:8080/web/install.js";
	if (!document.querySelector('script[src="'+INSTALL_URL+'"]')) {
		installDynamicScript(INSTALL_URL)
		.then(function(){
			console.log("Install desenvolvimento local");
		})
		.catch(function(err){
			console.error("Error on loading plugin desenvolvimento - " + err);
	    });
		throw new Error("Restarting with [Ambiente de Desenvolvimento]..."); // break script execution
	}
	PLUGIN_URL = "http://localhost:8080/web/plugin/{plugin}.js";
	VM18_INSTALL_URL = "http://localhost:8080/web/js/plugin-vm18.js";
	PLUGIN_DESIGN_INSTALL_CSS = "http://localhost:8080/web/css/plugin-design.css";
}

var SyncChainCollection = [
	jQueryScriptInstaller,
	vm18ScriptInstaller,
	jQueryUiScriptInstaller,
	jQueryUiCssInstaller,
	PluginDesignCssInstaller,
//	BootstrapJsInstaller,
//	BootstrapCssInstaller,
	StartPluginManager,
];

var sequence = Promise.resolve();

////////////////////////////////////////
// start
////////////////////////////////////////
start();
function start() {
	SyncChainCollection.forEach(function(promiseFunction){
	    sequence = sequence.then(function(){
	        return promiseFunction()
	    }).then(function(promiseValue){
	        console.log(promiseValue ? promiseValue + ' Ok' : promiseFunction);
	    }).catch(function(err){
	        console.log('Error! ' + err);
	    })
	})
}

// Install a plugin
function install(id) {
	var url = PLUGIN_URL.replace("{plugin}", id);
	installDynamicScript(url)
		.then(function(){
			console.log("Plugin " + id);
		})
		.catch(function(err){
			console.log("Error! Plugin " + id + " - " + err);
	    });
}

function installDynamicScript(url) {
	return new Promise(function(resolve, reject){
		var script = document.createElement('script');
		
		// Promise
		script.onload = function(){ resolve(url) };
		script.onerror = function(){ reject(url) };
		
		script.src = url;
		document.body.appendChild(script);
	})
}

function installDynamicCss(url) {
	return new Promise(function(resolve, reject){
		var css = document.createElement('link');
		
		// Promise
		css.onload = function(){ resolve(url) };
		css.onerror = function(){ reject(url) };
		
		css.rel="stylesheet"
		css.type="text/css"
		css.href=url
		
		document.body.appendChild(css);
	})
}

//jQueryScriptInstaller();
function jQueryScriptInstaller() {
	return new Promise(function(resolve, reject){
		// Tratar eventual conflito de instalação
		// O window.$ pode ser um jQuery pre-instalado ou uma lib qualquer.
		// Utilizar $18 quando quiser a versão específica do plugin vm18.
		
		// Hipótese
		// 1. Não tinha $ [antes de instalar o jQuery]
		// window.$18 = $ {install}
		// 2. Tinha $
		//   2.1 jQuery versão igual a minha
		//        window.$18 = jQuery
		//   2.2 else [não tem jQuery ou versão diferente]
		//	      window.$18 = jQuery.noConflict(true); {install}
		
		var newInstalation = false;
		var conflict = false;
		
		if (typeof($) === 'undefined' && typeof(jQuery) === 'undefined') {
			newInstalation = true;
		} else {
			if (typeof(window.jQuery) !== 'undefined' && window.jQuery.fn.jquery == JQUERY_VERSION) {
				window.$18 = jQuery;
				resolve("jQuery " + jQuery.fn.jquery + " pre-installed"); // Promise
				return;
			} else {
				newInstalation = true;
				conflict = true;
			}
		}
		
		if (newInstalation) {
			var startingTime = new Date().getTime();
			
			installDynamicScript(JQUERY_INSTALL_URL)
			.catch(function(err){
				reject(err);
			});
			
			// Poll for jQuery to come into existence
			var checkReady = function(callback) {
				if (typeof(window.jQuery) !== 'undefined' && window.jQuery.fn.jquery == JQUERY_VERSION) {
					callback(jQuery);
				}
				else {
					window.setTimeout(function() { checkReady(callback); }, 100);
				}
			};
			
			// Start polling...
			checkReady(function($) {
				window.$18 = $;
				if (conflict) {
					$.noConflict(true);
				}
				resolve("jQuery " + $.fn.jquery); // Promise
				var endingTime = new Date().getTime();
				var tookTime = endingTime - startingTime;
				console.log("jQuery " + $.fn.jquery + " loaded in " + tookTime + " milliseconds!");
			});
		}
	});
}

//vm18ScriptInstaller();
function vm18ScriptInstaller() {
	return new Promise(function(resolve, reject){
		// Verifica pré-instalação
		if (window.VM18) {
			resolve("vm18Plugin pre-installed") // Promise
			return;
		}
		
		var startingTime = new Date().getTime();
		
		installDynamicScript(VM18_INSTALL_URL)
			.catch(function(err){
				console.error('Verificar se o navegador bloqueou a instalação do script!\n\n\n');
				reject(err);
			});
		
		// Poll for script to come into existence
		var checkReady = function(callback) {
			if (window.VM18) {
				callback(jQuery);
			}
			else {
				window.setTimeout(function() { checkReady(callback); }, 100);
			}
		};
		
		// Start polling...
		checkReady(function($) {
			resolve("vm18Plugin") // Promise
			var endingTime = new Date().getTime();
			var tookTime = endingTime - startingTime;
			console.log("vm18Plugin loaded in " + tookTime + " milliseconds!");
		});
	});
}

//jQueryUiScriptInstaller();
function jQueryUiScriptInstaller() {
	return new Promise(function(resolve, reject){
		// TODO Verificar se instalou no jQuery $18
		// var old$ = window.$; ou var oldjQuery = window.jQuery;
		// Atualizar window.$ ou window.jQuery
		// Instalar jQueryUI
		// Devolver window.$ ou window.jQuery
		
		var $ = $18;
		
		// Verifica pré-instalação
		if ($.fn.draggable) {
			resolve("jQueryUi pre-installed") // Promise
			return;
		}
		
		var startingTime = new Date().getTime();
		
		// Config window.jQuery for installation
		var oldjQuery = window.jQuery;
		window.jQuery = $;
		
		installDynamicScript(JQUERY_UI_INSTALL_URL)
			.catch(function(err){
				reject(err);
			});
		
		// Poll for script to come into existence
		var checkReady = function(callback) {
			if ($.fn.draggable) {
				callback($);
			}
			else {
				window.setTimeout(function() { checkReady(callback); }, 100);
			}
		};
		
		// Start polling...
		checkReady(function($) {
			window.jQuery = oldjQuery;
			resolve("jQueryUi") // Promise
			var endingTime = new Date().getTime();
			var tookTime = endingTime - startingTime;
			console.log("jQueryUi loaded in " + tookTime + " milliseconds!");
		});
	});
}

function jQueryUiCssInstaller() {
	return new Promise(function(resolve, reject){
		installDynamicCss(JQUERY_UI_INSTALL_CSS)
		.then(function(){
			resolve();
		})
		.catch(function(err){
			reject(err);
		});
	});
}

function BootstrapJsInstaller() {
	return new Promise(function(resolve, reject){
		installDynamicScript(BOOTSTRAP_INSTALL_JS)
		.then(function(){
			resolve();
		})
		.catch(function(err){
			reject(err);
	    });
	});
}

function BootstrapCssInstaller() {
	return new Promise(function(resolve, reject){
		installDynamicCss(BOOTSTRAP_INSTALL_CSS)
		.then(function(){
			resolve();
		})
		.catch(function(err){
			reject(err);
		});
	});
}

function PluginDesignCssInstaller() {
	return new Promise(function(resolve, reject){
		installDynamicCss(PLUGIN_DESIGN_INSTALL_CSS)
		.then(function(){
			resolve();
		})
		.catch(function(err){
			reject(err);
		});
	});
}

// Verifica se ambiente de desenvolvimento.
// Opções de verificação
// - Variável STORAGE_KEY_AMBIENTE_DESENVOLVIMENTO=true no localStorage.
// - Variável document.VM18_AMBIENTE_DESENVOLVIMENTO.
// - Existência de script "http://localhost:8080/web/install.js".
function ambienteDesenvolvimento() {
	var desenv = localStorage.getItem(STORAGE_KEY_AMBIENTE_DESENVOLVIMENTO);
	//	if (document.VM18_AMBIENTE_DESENVOLVIMENTO == true) {
	//		ambienteDesenvolvimento = true;
	//	}
	if (desenv) {
		console.log("[Ambiente de Desenvolvimento]");
		return true;
	}
	return false;
}

function StartPluginManager() {
	// Modelo
	//install("pluginModelo");
	
	// Install plugin matching url
	// TODO Desenvolver esta verificação em localStorage
	for (plugin in collectionPlugin) {
		var urlPattern = collectionPlugin[plugin];
		if (urlPattern.test(url)) { // RegExp
			install(plugin);
		}
	}
}



// Overlay com select
// Salvar preferencias para a página
// Reopen manager start
