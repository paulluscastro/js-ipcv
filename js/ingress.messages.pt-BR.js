var e001_timeout = 'Conexão lenta ou computador desconectado. Timeout ao pesquisar por passcodes...';
var e002_ajax_error = 'Erro ao pesquisar por passcodes...';

var s001_no_passcode = 'Nenhum passcode novo.';
var s002_new_passcode = 'Novo passcode: ';
var s003_init = 'Último passcode enviado: ';

function pageLocalizer(){
	$('#settings').html('<span class="glyphicon glyphicon-cog"></span> Configura&ccedil;&otilde;es');
	$('#reset').val('reiniciar');
	$('#reset').attr('title', 'reinicia o timer com o novo valor informado no campo acima');
	$('#stop').val('parar');
	$('#settings').attr('title','para o timer');
	$('#log').html('<span class="glyphicon glyphicon-list"></span> Hist&oacute;rico');
}
