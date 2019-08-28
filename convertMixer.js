// Used to convert the old Mixer data to work with the 2019 rewrite

const fs = require('fs')
const streamerFolderMixer = './streamers/mixer'
const streamerFolderMixerOLD = './mixer'
const fetch = require('node-fetch')

function convertMixer () {
	console.log('This may take awhile!')

	function checkStatus (res) {
		if (res.ok) { // res.status >= 200 && res.status < 300
			return res
		} else {
			return console.log('no good')
		}
	}

	fs.readdir(streamerFolderMixerOLD, (err, files) => {
		var fileCount = files.length
		for (var i = 0; i < fileCount; i++) {
			var name = files[i].replace('.txt', '')
			if (name !== '.DS_Store') {
				console.log(name)
				const fetch = require('node-fetch')

				fetch(`https://mixer.com/api/v1/channels/${name}`)
					.then(checkStatus)
					.then(res => res.json())
					.then(mixerInfo => {
						const mixerID = mixerInfo.id

						var guildsGood = fs.readFileSync(streamerFolderMixerOLD + `/${name}.txt`, 'utf-8')
						var guildArray = guildsGood.split(', ')

						let defaultMixer = {
							name: mixerInfo.token,
							id: mixerInfo.id,
							userid: mixerInfo.userid,
							liveTime: '0',
							guilds: guildArray
						}
						let mixerJSON = JSON.stringify(defaultMixer)
						fs.writeFileSync(streamerFolderMixer + '/' + mixerID + '.json', mixerJSON)
					})
			}
		}

		if (err) {
			console.log(err)
		}
	})
	console.log('Finished converting Mixer Streamers!')
}

convertMixer()
