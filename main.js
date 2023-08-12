// ------- KEY FUNCTIONS -------
function download(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download',filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// ------- INPUTS ------
// Through the magic of DOM, this'll allow for creating new level upload slots.

function addInput(){ // Does what you'd expect. Adds a new input.
    var inpNumber = document.getElementsByClassName("levelUpload").length
    // should look like this: 
    // <input type="file" accept=".lsb" id="levelupload" onChange="storeLevel()">
    var input = document.createElement("input");
    input.classList.add("levelUpload"); 
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".lsb");
    input.id="levelUpload"+inpNumber
    input.setAttribute("onChange",`storeNewLevel(${inpNumber}, levelsArray)`); // a surprise tool that will help us later

    document.getElementById('infotest').appendChild(input) // slap it into the page
} 

//actually this might need to be reworked tbh

var levelsArray = [] 

function storeNewLevel(number, array){ 
    input = document.getElementById(`levelUpload${number}`); // We set the ID appropriately in
    let file = input.files[0]; 
    let fileReader = new FileReader(); 
    fileReader.readAsText(file); 
    fileReader.onload = function() {
        array.push(JSON.parse(fileReader.result)) // We now have an array of level JSON files. 
        }; 
    fileReader.onerror = function() {
          alert(fileReader.error);
    }
}

// ------- THEMES -------
// ALL themes are stored in a PA level file. We only need the ones included in a level
function extractThemes(level){ // Downloads all of the theme files present in a level. All of them. 
    console.log('Getting your themes ready...')
    var themeKFs = level.events.theme
    var levelThemes = level.themes
    var themeIDs = [] // keep track of themes we want to keep
    var outputThemes = [] // the themes that will be downloaded
    for (let i = 0; i < (themeKFs.length); i++){ // Find IDs themes we want
        if (themeIDs.includes(themeKFs[i].x) == false){
            themeIDs.push(themeKFs[i].x)
        }
    }

    for (let i = 0; i < (levelThemes.length); i++){ // Now we get the actual themes based on that array
        if (themeIDs.includes(levelThemes[i].id) == true){
            outputThemes.push(levelThemes[i])
            console.log(`Added theme: ${levelThemes[i].name}`)
        }
    }
    console.log(outputThemes)
    for (let i = 0; i < (outputThemes.length); i++) { // One last FOR loop, let's download all that
        download(outputThemes[i].name + ".lsb", JSON.stringify(outputThemes[i]))
    }
}


// ------- HANDLING LEVELS -------
//make the level! woohoo!    
//document.getElementById("EditorStuff").style.display = "block";
//const inputThings = document.getElementsByClassName("hideOnLoad");
//for (let i = 0; i < inputThings.length; i++) {
//  inputThings[i].style.display = "none";
//}
let theRealLevel = null
let levelJSON = null

function storeLevel(){ // old function, REMOVE
    input = document.getElementById('levelupload');
    let file = input.files[0]; 
    let fileReader = new FileReader(); 
    fileReader.readAsText(file); 
    fileReader.onload = function() {
        theRealLevel = fileReader.result
        }; 
    fileReader.onerror = function() {
          alert(fileReader.error);
    }
}
function loadLevel() {
    inputLevel = theRealLevel
    if (inputLevel == ""){
        console.log("oops don't do that")
        return
    } else {
        console.log("doing it...");
        levelJSON = JSON.parse(inputLevel);
        console.log("LOADED LEVEL JSON");
        statOutput = document.getElementById("infotest")
        statOutput.innerHTML += `<br>INITIAL MARKERS: ${Object.keys(levelJSON.ed.markers).length}`
        console.log("HOLY SHIT THE SECOND MARKER IN THIS LEVEL IS " + JSON.stringify(levelJSON.ed.markers[2]) + "!!!!")
        //Magical marker doubling machine. Temporary code just as a proof of concept
        let itemLength
        itemLength = levelJSON.ed.markers.length
        //This is pretty much what we'll have to do except pushing to a new level file
        //And pushing from several of these
        for (let i = 0; i < (itemLength-1); i++) { // 
            console.log("Adding item" + i)
            levelJSON.ed.markers.push(levelJSON.ed.markers[i]) 
        }
        console.log('lmao done')
        console.log(levelJSON.ed.markers) 
        console.log("LOADING THE LEVEL STATS YIPPIE!!!!!!!!!")
        statOutput.innerHTML += `<br>OHHHH SHIT I DOUBLED THEM NOW ITS: ${Object.keys(levelJSON.ed.markers).length}`
    }
}

function saveLevel(level) {
    // var finalLevel = JSON.stringify(level)
    download("level"+ ".lsb", level);
}

// EXTRACT THEMES FROM A LEVEL THAT ARE USED IN THE LEVEL