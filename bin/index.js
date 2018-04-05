#!/usr/bin/env node

const vorpal = require('vorpal')()

const actions = require('./actions')

vorpal
	.command('add <key> <url> <filename> [downloadPath] [concurrent]')
	.option('-s, --start', 'Start downloading immediately')
	.description('Adds the specified download to queue.')
	.alias('queue')
	.action(actions.addDownload)

vorpal
	.delimiter('su-downloader2$~')
	.show()