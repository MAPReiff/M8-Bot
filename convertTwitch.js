//Used to convert the old Twitch data to work with the 2019 rewrite


const fs = require('fs')
const streamerFolderTwitch = "./streamers/twitch";
const streamerFolderTwitchOLD = "./twitch";
const fetch = require('node-fetch')
const config = require("./config.js");
const delay = require('delay')


function convertTwitch() {

    console.log('This may take awhile!')

    function checkStatus(res) {
        if (res.ok) { // res.status >= 200 && res.status < 300
            return res;
        } else {
            return console.log('no good')
        }
    }

    fs.readdir(streamerFolderTwitchOLD, (err, files) => {

        files.forEach(file => {
            var files = file;
        })

        var fileCount = files.length
        for (i = 0; i < fileCount; i++) {
            var name = files[i].replace(".txt", "");
            if (name != ".DS_Store") {
                console.log(name)
                const fetch = require('node-fetch')

                fetch(`https://api.twitch.tv/kraken/channels/${name}/?client_id=${config.twitch_id2}`)
                    .then(checkStatus)
                    .then(res => res.json())
                    .then(twitchInfo => {


                        const token = twitchInfo.display_name;

                        var guildsGood = fs.readFileSync(streamerFolderTwitchOLD + `/${name}.txt`, "utf-8")
                        var guildArray = guildsGood.split(", ")

                        let defaultTwitch = {
                            name: twitchInfo.display_name,
                            liveTime: '0',
                            guilds: guildArray
                        };
                        let twitchJSON = JSON.stringify(defaultTwitch);
                        fs.writeFileSync(streamerFolderTwitch + '/' + token + '.json', twitchJSON);


                    })
            }

        }

    })

    console.log('Finished converting Twitch Streamers!')

}

convertTwitch()
