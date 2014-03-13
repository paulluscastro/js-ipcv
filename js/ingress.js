/* ****************************************************************************
 * Ingress Passcode Community Verifier (IPCV) is a Javascript routine that will
 * verify every user given time (in minutes) if a new passcode has been posted
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

// Global timer id. Will be used to stop it later
var globalTimerId = 0;
// Search timer id. Will be used to stop it later
var timerId = 0;
// Time elapsed doing the search
var timeElapsed = 0;
// Maximum time to wait before launch timeout message and stop message
var maxTime = 10;
// Flag that indicates that the search timedout
var timedOut = false;
// Flag that indicates if the search was done successfully
var done = false;
// Stores th last passcode posted in the community
var lastPasscode = '@pimpolho';

// Used for testing purposes wil be removed later
var fake = false;

/**
 * Starts the timer that will count time elapsed in the search.
 * If this time gets to the value of 'maxTime' variable, this routine sets all the timeout flags.
 */
function initTimerPesquisa()
{
	stopTimerPesquisa();
	timeElapsed = 0;
	timerId = setInterval(function(){
		timeElapsed++;
		
		if (timeElapsed == maxTime)
		{
			// If search fails... 
			if (!done)
			{
				timedOut = true;
				$('#posts').append('<p class="timeout">[' + currentTime() + '] ' + e001_timeout + '</p>');
				console.log('[' + currentTime() + '] ' + e001_timeout);
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

	if (fake)
	{
		debugger;
		var hora = new Date();
		var tempPasscode = 'teste_' + hora.getMilliseconds();
		if (lastPasscode == '@pimpolho')
		{
			lastPasscode = tempPasscode;
			addInitialPasscode();
		}
		else
		{
			if (tempPasscode !== lastPasscode){
				lastPasscode = tempPasscode;
				addPasscode(tempPasscode);
			}
			else
			{
				addNoPasscodeWarning();
			}
		}
		return;
	}
	
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
					if (tempPasscode !== lastPasscode){
						lastPasscode = tempPasscode;
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
			console.log(e002_ajax_error);
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
	result += numberFormatter(now.getDate(), 2) + '/';
	// month
	result += numberFormatter(now.getMonth(), 2) + '/';
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
	$('#posts').prepend('<p class="no_passcode">[' + currentTime() + '] ' + s001_no_passcode + '</p>');
}

function addPasscode(passcode){
	$('#posts').prepend('<p class="new_passcode">[' + currentTime() + '] ' + s002_new_passcode + passcode + '</p>');
}

function addInitialPasscode(){
	$('#posts').prepend('<p class="init">[' + currentTime() + '] ' + s003_init + '<strong>' + lastPasscode + '</strong></p>');
}


/**
 * inicializa o timer global
 */
function initGlobalTimer()
{
	stopGlobalTimer();
	globalTimerId = setInterval(function(){
		passcodeRetriever();
	}, 60000);
}

/**
 * Finaliza o timer global
 */
function stopGlobalTimer()
{
	clearInterval(globalTimerId);
}


$(document).ready(function(){
	passcodeRetriever();
	initGlobalTimer();
	$(document).unload(function(){
		stopTimerPesquisa();
		stopGlobalTimer();
	});
});