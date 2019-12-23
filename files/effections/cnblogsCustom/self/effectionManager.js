document.body.onclick = function() {
	$('#effSelect').hide()
}
$('.toggleEff').click(function(event) {
	$('#effSelect').css('top', event.clientY)
	$('#effSelect').css('left', event.clientX)
	$('#effSelect').show()
	event.preventDefault()
	event.stopPropagation()
})
$('#effSelect li').click(function(event) {
	initEff($(this).data('efi'))
	$(this).addClass('selected')
	$('#effSelect').hide()
	event.stopPropagation()
})
var defEff = localStorage.getItem('effIndex') || 1
var initEff = function(index) {
	$('#effSelect li').removeClass('selected')
	window.magnetEnd()
	window.snow1End()
	window.snow2End()
	switch (index + '') {
		case '0':
			window.magnetStart()
			break;
		case '1':
			window.snow1Start()
			break;
		case '2':
			window.snow2Start()
			break;
		default:
			break;
	}
	$('#effSelect li')[index].className = 'selected'
	localStorage.setItem('effIndex', index)
}
initEff(defEff)