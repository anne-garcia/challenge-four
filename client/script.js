// Just using a basic button to request the node app run, if localhost:3000 isn't being visited directly

const runAppBtn = document.getElementById('RunAppBtn');

runAppBtn.addEventListener('click', async () => {
    await fetch("http://localhost:3000")
    .then(res => res.json())
    .then(json => {
        console.log(`Election results adjusted, new results:`, json);
    });
});