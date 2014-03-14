var e001_timeout = 'Slow connection or unplugged computer. Timeout occurred while searchin for passcodes...';
var e002_ajax_error = 'Error searching for passcodes...';

var s001_no_passcode = 'No new passcode.';
var s002_new_passcode = 'New passcode: ';
var s003_init = 'Last sent passcode: ';

function pageLocalizer(){
	$('#settings').html('<span class="glyphicon glyphicon-cog"></span> Settings');
	$('#reset').val('reset');
	$('#reset').attr('title', 'resets global timer with the new value given in the above field');
	$('#stop').val('stop');
	$('#settings').attr('title','stops the global timer');
	$('#log').html('<span class="glyphicon glyphicon-list"></span> Log');
}
