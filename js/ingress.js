/* ****************************************************************************
 * Ingress Passcode Community Verifier (IPCV) is a Javascript routine that will
 * verify every user given time (in minutes) is a new passcode has been posted
 * to the Google Plus community "Ingress Passcodes".
 * If a new passcode has been posted to the community, IPCV will send an e-mail
 * to a list of addresses so agents get notified in time by their smartphones.
 *
 * Author: Paullus Martins de Sousa Nava Castro
 * Agent name: @pimpolho
 * Version: 0.1 (alpha)
 * 
 * Additional software used
 * - jQuery (http://www.jquery.com)
 * - jQuery XDomain Ajax (http://github.com/padolsey/)
 */

// Id do timer global, será usado para pará-lo posteriormente
var globalTimerId = 0;
// Id do timer de recuperação, será usado para pará-lo posteriormente
var timerId = 0;
// Tempo decorrido desde o início da pesquisa 
var timeElapsed = 0;
// Tempo máximo a ser esperado
var maxTime = 5;
// Indica que houve timeout na pesquisa
var timedOut = false;
// Indica que a pesquisa foi realizada com sucesso
var done = false;
// Armazena o último passcode postado na comunidade
var lastPasscode = '@pimpolho';

/**
 * Inicia o timer que contará o tempo decorrido na pesquisa. Se esse tempo atingir o valor máximo a ser esperado configura as variáveis de timeout 
 */
function initTimerPesquisa()
{
	stopTimerPesquisa();
	timeElapsed = 0;
	timerId = setInterval(function(){
		timeElapsed++;
		
		if (timeElapsed == maxTime)
		{
			// Se a pesquisa não foi realizada com sucesso... 
			if (!done)
			{
				// Se ocorrer o timeout, 
				timedOut = true;
				// Grava log do timeout...
				$('#posts').append('<p style="color: red;">Conexão lenta ou computador desconectado. Timeout ao pesquisar por passcodes...</p>');
				console.log('Conexão lenta ou computador desconectado. Timeout ao pesquisar por passcodes...');
			}
			stopTimerPesquisa();
		}
	}, 1000);
}

/**
 * Ends research timer
 */
function stopTimerPesquisa()
{
	clearInterval(timerId);
}

/**
 * Retrieves last posted passcode on Ingress Passcodes Community
 */
function passcodeRetriever(){
	done = false;
	timedOut = false;
	
	// Inicia o timer...
	initTimerPesquisa();
	
	$.ajax({
		url: 'https://plus.google.com/communities/108599095839806789745',
		type: 'GET',
		async: false,
		success: function(res) {
			// Se tiver ocorrido timeout saia da função
			if (timedOut)
				return;
			
			var posts = $(res.responseText).find('div.Ct');
			if (posts.length > 0)
			{
				var tempPasscode = posts[0].innerText.trim();

				// Se for a primeira iteração, adicionar a mensagem inicial
				if (lastPasscode == '@pimpolho')
				{
					lastPasscode = tempPasscode;
					addInitialPasscode();
				}
				else
				{
					lastPasscode = tempPasscode;
					if (tempPasscode !== lastPasscode){
						addPasscode(tempPasscode);
					}
					else
					{
						addNoPasscodeWarning();
					}
				}
			}

			done = true;
			// Para o timer
			if (!timedOut)
				stopTimerPesquisa();
		},
		error: function(res) {
			if (timedOut)
				return;
			console.log('Erro ao pesquisar por passcodes...');
			console.log(res);
			done = true;
			// Para o timer
			if (!timedOut)
				stopTimerPesquisa();
		}
	});
}

function numberFormatter(number, size){
	var result = String(number);
	while(result.length < size){
		result = '0' + result;
	}
	return result;
}

function currentTime(){
	var now = new Date();
	var result = '';
	// day
	result += numberFormatter(now.getDate(), 2);
	// month
	result += numberFormatter(now.getMonth(), 2)
	// year
	result += numberFormatter(now.getFullYear(), 2) + ' ';
	// Hour
	result += numberFormatter(now.getHours(), 2) + ':' ;
	// Minutes
	result += numberFormatter(now.getMinutes(), 2) + ':' ;
	// Seconds
	result += numberFormatter(now.getSeconds(), 2) + '.' ;
	// Milliseconds
	result += numberFormatter(now.getMilliseconds(), 3);

	return  result;
}

function addNoPasscodeWarning(){
	$('#posts').append('<p class="no_passcode">[' + currentTime() + '] Nenhum passcode novo.</p>');
}

function addPasscode(passcode){
	$('#posts').append('<p class="new_passcode">[' + currentTime() + '] ' + passcode + '</p>');
}

function addInitialPasscode(){
	$('#posts').append('<p class="init">[' + currentTime() + '] Último passcode enviado: <strong>' + lastPasscode + '</strong></p>');
}


/**
 * inicializa o timer global
 */
function initGlobalTimer()
{
	stopGlobalTimer();
	globalTimerId = setInterval(function(){
		passcodeRetriever();
	}, 10000);
}

/**
 * Finaliza o timer global
 */
function stopGlobalTimer()
{
	clearInterval(globalTimerId);
}


$(document).ready(function(){
	debugger;
	passcodeRetriever();
	initGlobalTimer();
});