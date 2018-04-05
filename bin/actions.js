const path = require('path')
const sud = require('su-downloader2')
const sudownloader = sud.suDownloader
const bytes = require('bytes')
const { convertSec } = require('./util')
require('draftlog').into(console).addLineListener(process.stdin)

const cwd = process.cwd()

const downloadDrafts = []

function addDownload(args, cb) {
	let { key, url, filename, downloadPath, concurrent } = args
	downloadPath = downloadPath || cwd
	concurrent = concurrent || 4
	var downloadOptions = {
		key,
		url,
		path: path.resolve(downloadPath, filename),
		concurrent
	}
	var draft 
	if(args.options.start) {
		draft = console.draft(`KEY: ${key} : STARTING`)
		downloadDrafts.push({ key, draft })
		sudownloader.QueueDownload(downloadOptions)
		sudownloader.startDownload(key)
	} else {
		draft = console.draft(`KEY: ${key} : QUEUED`)
		downloadDrafts.push({ key, draft })
		sudownloader.QueueDownload(downloadOptions)
	}
	cb()
}

sudownloader.on('new_download_started', key => {
	let { draft } = downloadDrafts.find(el => el.key == key)
	var downloadInstance = sudownloader.getActiveDownload(key)
	addDownloadListeners(key, downloadInstance, draft)
})

function addDownloadListeners(key, downloadInstance, draft) {
	downloadInstance.
		on('progress', x => {
			var status = 'DOWNLOADING'
			var speed = bytes(x.present.speed) + '/s'
			var progressSize = bytes(x.total.downloaded)
			var totalSize = bytes(x.total.size)
			var percentage = (x.total.completed).toFixed(2)
			var elapsed = convertSec(Math.round(x.present.time))
			var eta = convertSec(Math.round(x.future.eta))
			draft(`KEY: ${key} : DOWNLOADING | ${downloadInstance.options.path}  |  ${speed}  |  ${progressSize}/${totalSize}  |  ${percentage}%  |  elapsed: ${elapsed}  |  ETA: ${eta}s`)
		})
		.on('error', () => {
			draft(`KEY: ${key} : ERROR`)
		})
		.on('finish', () => {
			draft(`KEY: ${key} : COMPLETE  |  ${downloadInstance.options.path}`)
		})
}

module.exports = {
	addDownload
}