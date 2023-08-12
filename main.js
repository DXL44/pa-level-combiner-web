	/* all of the code here is probably really bad i'm sorry lmao */
// ALRIGHT NERDS. its time to put together the level file

//Its time to update the colors but be WAY COOLER
//COLOR IDS will be in this format: [group][number]. 
//COLOR GROUPS: gui, bg, players, objs, bgs (aka the groups in the uh... uh the )


//make the level! woohoo!    
//document.getElementById("EditorStuff").style.display = "block";
//const inputThings = document.getElementsByClassName("hideOnLoad");
//for (let i = 0; i < inputThings.length; i++) {
//  inputThings[i].style.display = "none";
//}
let theRealLevel = null
let levelJSON = null

function storeLevel(){
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



// download the level
function download(filename, text){
    var element = document.createElement('a');
    element.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download',filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function saveLevel(level) {
    // var finalLevel = JSON.stringify(level)
    download("level"+ ".lsb", level);
}
