function convertSec(sec) {
	var d, h, m, s
	m = Math.floor(Math.round(sec) / 60)
	s = sec % 60
	h = Math.floor(m / 60)
	m = m % 60
	d = Math.floor(h / 24)
	h = h % 24
	return  (d == 0 ? '' : `${d} days `) +
			(h == 0 ? '' : `${h} hrs `) +
			(m == 0 ? '' : `${m} min `) +
			(s == 0 ? '' : `${s} sec `)
}

function genProgressBar(progress) {
	var progressBar = ''
	var percentageDec = progress / 100
	var normalisedProgress = Math.floor(20 * percentageDec)
	for(var i = 0; i < normalisedProgress; i++) {
		progressBar += '█'
	}
	for(var j = 0; j < 20 - normalisedProgress; j++) {
		progressBar += '='
	}
	return `[${progressBar}]`
}

module.exports = {
	convertSec,
	genProgressBar
}