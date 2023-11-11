// ------- NOTES -------
// Always assume level JSON is parsed in functions.


// ------- KEY FUNCTIONS -------
function download(filename, text) { // Download (self explanatory) 
    var element = document.createElement('a');
    element.setAttribute('href','data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download',filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
function combinedLength(jsonObject) { 
	var totalLength = 0;

	for (var key in jsonObject)
    { 
        // console.log(`Adding key ${key}: ${Object.keys(jsonObject[key]).length}`)
        totalLength += Object.keys(jsonObject[key]).length
    }
    return totalLength;
}
/*


// ------- LEVEL LIST ------
// Through the magic of DOM, this'll allow for creating a list of levels that you can remove.
// how it should look:
/* <div class="levelInList" style="padding:5px;background-color:rgba(255, 255, 255, 0.05);">
              <image src="https://cdn.discordapp.com/emojis/1016441132433014935.webp?size=96&quality=lossless" width="25" style="float:right; padding:5px" onClick="console.log('sex!')"/>
              <b>level name 2</b><br>
              <span style="font-size:75%">5678 objects // 1234 events</span>
              
       </div> */

function createLevelBlock(level){ // Creates a HTML object for the level that goes in the list on the page
    // the "parent" div
    const listBlock = document.createElement('div')
    listBlock.classList.add('levelBlock')
    // the image
    const deleteButton = document.createElement('image')
    deleteButton.setAttribute('src', 'https://cdn.discordapp.com/emojis/1016441132433014935.webp?size=96&quality=lossless')
    deleteButton.setAttribute('width', '25')
    deleteButton.classList.add('levelBlockDelete')
    // fix this, needs function
    deleteButton.setAttribute('onClick', 'deleteLevel(level position in the list lmao)')
    //subtitile
    const levelName = document.createElement('b')
    listBlock.classList.add('levelBlockName')
    levelName.innerHTML = window.prompt("Enter this file's name (optional):","An Awesome Beatmap")
    // stats
    const levelStats = document.createElement('span')
    levelStats.classList.add('levelBlockStats')
    levelStats.innerHTML = `${level.beatmap_objects.length} objects / ${combinedLength(level.events)} events`
    // add everything as a child
    listBlock.appendChild(deleteButton)
    listBlock.appendChild(levelName)
    listBlock.appendChild(document.createElement('br'))
    listBlock.appendChild(levelStats)
    return listBlock
}

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

// ------- LEVEL STATISTICS ------
function updateStats() {
    levelsUploaded = "a"
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


function combineLevels(level1, level2) { //Combine ALL levels in an array of level JSON objects
    console.log(`combining levels lol`)
    var finalLevel = level1
    // push push push push push push EVERYTHING 
    //needs if statements in case there is Nothing
    //mergeArrays(finalLevel.ed.markers, level2.ed.makers)
    if (level2.ed.markers){
        if (finalLevel.ed.markers) {
            finalLevel.ed.markers.push(...level2.ed.markers)
        } else {
            finalLevel.ed.markers = level2.ed.markers
        }   
        
    }
    keysArray = ['prefab_objects', 'prefabs', 'checkpoints', 'beatmap_objects', 'bg_objects']
    for (i in keysArray) {
        if (finalLevel[i]) {
            finalLevel[i].push(...level2[i])   
        }
    }
    /*if (level2.prefab_objects){
        finalLevel.prefab_objects.push(...level2.prefab_objects)
    }
    if (level2.prefabs){
        finalLevel.prefabs.push(...level2.prefabs)
    }
    /*if (level2.themes){
        finalLevel.themes.push(...level2.themes)
    }
    if (level2.checkpoints){
        finalLevel.checkpoints.push(...level2.checkpoints)
    }
    if (level2.beatmap_objects){
        finalLevel.beatmap_objects.push(...level2.beatmap_objects)
    }
    if (level2.bg_objects){
        finalLevel.bg_objects.push(...level2.bg_objects)
    }*/
    for (i in finalLevel.events) {
        console.log(`Added event ${i}!`)
        finalLevel.events[i].push(...level2.events[i]) 
    }
    

    console.log("done lol:")
    console.log(finalLevel)
    return finalLevel
}

function combineLevelArray(array){ //combine ALL levels in an array of level JSON objects
    finalLevel = array[0]
    for (let i = 1; i < (array.length); i++) {
        finallevel = combineLevels(finalLevel, array[i])
    }
    return finalLevel
}

// THE LEVEL LIST

let levelsArray = [] 

function addLevelToList(level) { // add a level to the list
    document.getElementById('levelsList').appendChild(createLevelBlock(level))
    levelsArray.push(level)
}

/* statOutput = document.getElementById("infotest")
        statOutput.innerHTML += `<br>INITIAL MARKERS: ${Object.keys(levelJSON.ed.markers).length}`
        console.log("HOLY SHIT THE SECOND MARKER IN THIS LEVEL IS " + JSON.stringify(levelJSON.ed.markers[2]) + "!!!!")    }
 */

function loadLevel() { //Add a level to THE LIST 
    inputLevel = theRealLevel
    if (inputLevel == ""){
        window.alert('You need to choose a level first!')
        return
    } else {
        //Load level from file
        console.log("Loading level...");
        levelJSON = JSON.parse(inputLevel);
        console.log("Level JSON loaded!");
        addLevelToList(levelJSON)
    }
}



function saveLevel(level) {
    // var finalLevel = JSON.stringify(level)
    download("level"+ ".lsb", JSON.stringify(level));
}

// ------- LEVEL STATS -------
//  Form Chart
const xValues = [0];
const yValues = [0];

objsChart = new Chart("chartObjs", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: true,
      lineTension: 0,
      backgroundColor: "rgba(0,0,255,1.0)",
      borderColor: "rgba(0,0,255,0.1)",
      data: yValues
    }]
  },
  options: {
    maintainAspectRatio: false,
    legend: {display: true},
    scales: {
      yAxes: [{ticks: {min: 0, max:5}}],
    },
    elements: {
        point:{
            radius: 0
        }
    },
    title: {
        text : "Object Counts Over Time",
        display: true,
    }
  }
});

// Create level chart

function makeChartObjs(inputLevel)
{
    // --- PART 1: Analyze the objects
    
    console.log("Preparing graph - PHASE 1: Object Analysis")
    timedObjects = []    
    for (i = 0; i < inputLevel.beatmap_objects.length; i++) 
    {
        
        // lifespan
        switch (inputLevel.beatmap_objects[i].akt) 
        { 
            case 0: // No autokill
            {
                console.log("wtf thats a no autokill object!!! things might get funky!")
                newLifespan = Infinity;
                break;
            }
            case 1: // Last keyframe - find the time of the last keyframe of the object
            {   // use the maximum time out of all four keyframe types
                newLifespan = Math.max(levelJSON.beatmap_objects[i].events.pos[Object.keys(levelJSON.beatmap_objects[i].events.pos).length-1].t, levelJSON.beatmap_objects[i].events.rot[Object.keys(levelJSON.beatmap_objects[i].events.rot).length-1].t, levelJSON.beatmap_objects[i].events.sca[Object.keys(levelJSON.beatmap_objects[i].events.sca).length-1].t, levelJSON.beatmap_objects[i].events.col[Object.keys(levelJSON.beatmap_objects[i].events.col).length-1].t)
                break;
            }
            case 2: // Last KF offset (same as above, but add some time)
            {
                //newLifespan = (inputLevel.beatmap_objects[i].ako + Math.max(levelJSON.beatmap_objects[i].events.pos[Object.keys(levelJSON.beatmap_objects[i].events.pos).length-1].t, levelJSON.beatmap_objects[i].events.rot[Object.keys(levelJSON.beatmap_objects[i].events.rot).length-1].t, levelJSON.beatmap_objects[i].events.sca[Object.keys(levelJSON.beatmap_objects[i].events.sca).length-1].t, levelJSON.beatmap_objects[i].events.col[Object.keys(levelJSON.beatmap_objects[i].events.col).length-1].t))                
                newLifespan = 3;
                break;
            }
            case 3: // Fixed time - pretty straightforward, just use AKO
            {
                newLifespan = inputLevel.beatmap_objects.ako;
                break;
            }
            case 4: // Song time - subtract the start time from this to get object lifespan  
            {
                newLifespan = inputLevel.beatmap_objects[i].ako - inputLevel.beatmap_objects[i].st;
                break;
            }
        }
        newObject = {
            "time": Math.round(inputLevel.beatmap_objects[i].st * 10) / 10, 
            "lifespan": newLifespan   
        }
        console.log(`Pushing object ${i} | Adjusted start time: ${newObject.time} | Dies after: ${newLifespan}`)
        timedObjects.push(newObject)
    }


    // --- PART 2: Create the graph 
    trackedObjects = [];
    for(j = 0; j < (timedObjects[timedObjects.length-1].time + timedObjects[timedObjects.length-1].lifespan); j +=0.1)
    {   
        // EXCEPTION: No objects at this time
        if ((timedObjects[0].time != j) && (trackedObjects.length == 0))
        {
            console.log(`No objects at time ${j}!`)
            xValues.push(xValues[xValues.length-1]+0.1);
            yValues.push(0);
            continue;
        }
        // Check for new objects at this start time
        while (timedObjects[0].time == j)
            {
                // keeps infinite looping here.
                console.log(`Pushed an object at time ${j}!`);
                trackedObjects.push(timedObjects[0].lifespan);
                // invalid array length at 32 above
                timedObjects.shift();
            }

        console.log(`TRACKED OBJECTS RN: ${trackedObjects}`)
    
    for (i =0; i < trackedObjects.length; i++)
    {
        trackedObjects[i] = trackedObjects[i] - 0.1;  
       if (trackedObjects[i] < 0)
        {
           trackedObjects.splice(i, 1)
        }
        console.log(`Pushing value ${trackedObjects.length} at ${xValues[xValues.length-1]+0.1}`)
        xValues.push(xValues[xValues.length-1]+0.1);
        yValues.push(trackedObjects.length);
        /*if (trackedObjects.length > objsChart.scales.yAxes[0].max)
        {
            objsChart.scales.yAxes[0].max = trackedObjects.length;
        }*/
    }
    }

    
        
        console.log("mmm, refreshing!")
        
        objsChart.update() // refresh!
}