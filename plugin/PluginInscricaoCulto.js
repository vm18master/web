//////////////////////////////
// PluginInscricaoCulto
//////////////////////////////

//////////////////////////////
// Inscrição para o culto
//   - Tecla padrão
//   - Storage vm18Info "info"
//////////////////////////////

function init() {
	var $ = $18;
	configPlugin();
}

function configPlugin() {
	var $ = $18;
	console.log("Script PluginInscricaoCulto");
	
	// Style
	configDesign();
	
	autoCheck();
	
	// Tecla padrão
	$(document).bind('keydown', function(e){
		if ((e.ctrlKey && e.shiftKey)       || // ctrl + shift
			(e.ctrlKey && e.keyCode == 222) || // ctrl + '
			(e.keyCode == 145)) {              // Scroll Lock
			manage();
		}
	});
    
	// Focus
	//$("form").focus();
	
    log('Plugin InscricaoCulto ready!');
}

function manage() {
	if (confirm("Start?")) {
		configPluginIgreja();
		configPluginEmpresa();
	}
}

function autoCheck() {
	configPluginIgreja();
	configPluginEmpresa();
}

function configDesign() {
	var $ = $18;
}

function isUrlIgreja() {
	return url.match(/brasilia\/campus-plano-piloto-celebracao-familia/)
		|| url.match(/brasilia\/campus-plano-piloto-quinta-milagres/)
}

function isUrlEmpresa() {
	return url.match(/doity.com.br/);
}

function configPluginIgreja() {
	if (isUrlIgreja()) {
		if (confirm("Navegar para inscrição?")) {
			openEvent();
		}
	}
}

function configPluginEmpresa() {
	if (!isUrlEmpresa()) { return; }
	
	var vm18Info = localStorage.getItem("info");
	vm18Info = JSON.parse(vm18Info);
	
	if (vm18Info == null) {
		vm18Info =  {
			"name"    :"Nome",
			"email"   :"@yahoo.com",
			"telefone":"61000000000",
		};
		if (confirm("Create storage info?")) {
			localStorage.setItem("info", JSON.stringify(vm18Info));
		}
	}
	
	var texto = "Inscrição\n\n";
	for (var att in vm18Info) {
		texto += capitalize(att).padStart(10) + "\t" + vm18Info[att] + "\n";
	}
	
	var $iframe = $("iframe#iframe-inscricao").contents();
	
	var $dialog = dialogInscricao(texto);
	$dialog.find("button").html("Realizar a inscrição")
		.click(function() {
			// Form1
			var $form1 = $("#UserInscricaoPasso1Form", $iframe);
			//var $form1 = $iframe.find("#UserInscricaoPasso1Form");
			if (!$form1.length) {
				alert("Confirme o endereço de inscrição!");
				return;
			}
			
		    var $name = $form1.find("#UserName");
		    var $email = $form1.find("#UserEmail");

		    $name.val(vm18Info.name);
		    $email.val(vm18Info.email);

		    closeDialog($dialog);
		    $form1.submit();
		    
		    $dialog = dialogInscricao(texto);
		    $dialog.find("button").html("Finalizar")
			    .click(function() {
			    	// Form2
			    	$iframe = $("iframe#iframe-inscricao").contents();
			    	var $form2 = $("#fomulario-inscricao", $iframe);
			    	if (!$form2.length) {
			    		alert("Confirme o formulário!");
			    		return;
			    	}
		    		var $telefone = $form2.find('input[class*=maskPhone]');
		    		
		    		$telefone.val(vm18Info.telefone);
		    		$iframe.find("#aceitarRegulamento").prop("checked", true);
		    		
		    		closeDialog($dialog);
		    		$form2.submit();
			    });
		});
}

function dialogInscricao(texto) {
	var $dialog = createDialog({
	    title : "Inscrição",
		modal : false,
		autoOpen : true,
		width : 400,
		height : 300,
	});
	$("<pre>").html(texto).appendTo($dialog);
	$("<button class=btn18>").html("Ok").appendTo($dialog);
	return $dialog;
}

function openEvent() {
	var $ = $18;
	console.log("Opening event link...");
	//var $iframe = $("iframe#iframe-inscricao");
	//var href = $iframe.attr("src");
	var $link = $("a[href*='doity.com.br']");
	var href = $link.attr("href");
	window.location = href;
}

jQuery(document).ready(function() {
    try {
    	init();
	} catch (e) {
		console.log("Script exception!");
		console.log(e);
	}
});
