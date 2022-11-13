const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

// Create a mapping of candidate to party affiliation.
const candidatePartyMap = {
    "Joey B": "republican",
    "Donny T": "democrat"
}

const server = http.createServer((req, res) => {

    // Boilerplate to send back json
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // ----------------- Process election json files -----------------

    // Get all filenames from folder
    const filenames = fs.readdirSync('./voter_results');
    // console.log(filenames);

    // Get only the json filenames
    const jsonFilenames = filenames.filter(filename => filename.endsWith('.json'));
    // console.log(jsonFilenames);

    // Get the data from each file, which will all be conbined togther for the output
    const allJsonData = [];
    for(const jsonFilename of jsonFilenames) {
        const fileData = fs.readFileSync(`./voter_results/${jsonFilename}`);
        const jsonData = JSON.parse(fileData);
        // console.log(jsonData);

        // Get the name of the candidate chosen (will be changed later), and identify party based on name.
        const realVoteName = jsonData['votedFor'];
        let voteParty = candidatePartyMap[realVoteName];
        if(!voteParty) {
            voteParty = "other";
        }

        // Add party affiliation to data set.
        jsonData['party'] = voteParty;

        // Then make everyone instead vote for Kanye
        jsonData['votedFor'] = 'KanYeW';
        
        allJsonData.push(jsonData);
    }

    // console.log(allJsonData);
    const jsonString = JSON.stringify(allJsonData, null, 2);

    // Need to create output directory if it doesn't already exist
    const outputPath = './output';
    if(!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }
    
    // Write output to file, per instructions. This seems to clear and overwrite existing file contents, so no need to clear it out.
    fs.writeFileSync(`${outputPath}/voter_results_tweaked.json`, jsonString);
    
    // Also send to client, just as another delivery method.
    res.end(jsonString);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});