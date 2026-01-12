// This section of code has been adapted from an multi-input-easy-p5js example in CCI class <3
//Midinotes code has been adpated from 16 play midi by arnonurim
//Original source: https://editor.p5js.org/arnonurim/sketches/ejfoXRlBV

//version 3 added start saving button
let bridge;
let sensor1Value = 0;
let sensor2Value = 0;
let sensor3Value = 0;
let isConnected = false;
let connectionStatus = 'disconnected';
let midiNotes = [60, 62, 64, 65,67,69,71,77];
let noteIndex = 0;
let midiVal, freqs;
let osc
let osc2
let osc3
 let i;
 let j;
 let n;
 let allData = []; // Array to store all readings
let currentReading = {}; // Store the latest JSON object

function setup() {
    let canvas = createCanvas(650, 400);
    canvas.parent('canvas-container');

    // Connect to Serial Bridge
    bridge = new SerialBridge(); // Auto-detects URL from socket.io script

    // Listen for data from arduino_1
    //This is an event listener that runs every time new data arrives.
    bridge.onData('arduino_2', (data) => {
        // Console log the raw data as it arrives
        console.log("Raw data received:", data);

        // Split the data by comma to separate the two values
        let values = data.split(",");

        // Console log the split values
        console.log("Split values:", values);

        // Convert the string values to numbers
        sensor1Value = parseInt(values[0]);
        sensor2Value = parseInt(values[1]);

        // Console log the parsed numbers
        console.log("Sensor 1:", sensor1Value, "Sensor 2:", sensor2Value);
    });

        bridge.onData('arduino_1', (data) => {
        // Console log the raw data as it arrives
        console.log("Raw data received:", data);

        // Split the data by comma to separate the two values
        let values = data.split(",");

        // Console log the split values
        console.log("Split values:", values);

        // Convert the string values to numbers
        sensor3Value = parseInt(values[0]);

        // Console log the parsed numbers
        console.log("Sensor 3:", sensor3Value);
    });

    // Listen for connection status changes
    bridge.onStatus('arduino_1', (status, port) => {
        connectionStatus = status;
        isConnected = (status === 'connected');
        console.log(`Arduino status: ${status} on ${port}`);
    });

    console.log('P5.js sketch initialized');
    console.log('Waiting for Arduino data...');

    osc = new p5.TriOsc();
     osc.amp(1);
     osc.start();
    osc2 = new p5.TriOsc();
     osc2.amp(1);
     osc2.start();
    osc3 = new p5.TriOsc();
     osc3.amp(1);
     osc3.start();

    let startBtn = createButton("Start Saving"); // Create start button
    startBtn.position(300, 170); // Position the button
    startBtn.mousePressed(startSaving); // When clicked, run startSaving function

    let downloadBtn = createButton("Download JSON"); // Create download button
    downloadBtn.position(300, 200); // Position next to start button
    downloadBtn.mousePressed(downloadData); // When clicked, run downloadData funct
    
    }





function draw() {
    background(220);
    connectionDisplay();


    if (isConnected) {
        //midi 1
        i = Math.floor(map(sensor1Value, 1023, 0, 0, midiNotes.length));
        freqs = midiToFreq(midiNotes[i]);
        osc.freq(freqs);
        console.log('midiI' + midiNotes[i]);
        //midi 2
      j = Math.floor(map(sensor2Value, 1023, 0, 0, midiNotes.length));
        freqs = midiToFreq(midiNotes[j]);
        osc2.freq(freqs);
        console.log('midiJ' + midiNotes[j]);
        //midi 3
       n = Math.floor(map(sensor3Value, 1023, 0, 0, midiNotes.length));
        freqs = midiToFreq(midiNotes[n]);
        osc3.freq(freqs);
        console.log('midiN' + midiNotes[n]);

        // Use sensor1 to control the ellipse size pink
        let ellipseSize1 = map(sensor1Value, 0, 1023, 10, 200);
        fill(250, 125, 165);
        ellipse(110, height / 2, ellipseSize1, ellipseSize1);

        // Use sensor3 to to control the ellipse size red
        let ellipseSize3 = map(sensor3Value, 0, 1023, 10, 200);
        fill(252, 45, 45);
        noStroke();
        ellipse(525, height / 2, ellipseSize3, ellipseSize3);

        // Use sensor2 to control the ellipse size green
        let ellipseSize2 = map(sensor2Value, 0, 1023, 10, 200);
        fill(25, 150, 100);
        noStroke();
         ellipse(325, height / 2, ellipseSize2, ellipseSize2);

        
        // Display the values on screen
        fill(0);
        textAlign(LEFT, TOP);
        textSize(14);
        text(`Pink midi1: ${sensor1Value}`, 10, 10);
        text(`Green midi2: ${sensor2Value}`, 10, 30);
        text(`Red midi3: ${sensor3Value}`, 10, 50);
        //text(`Ellipse size: ${ellipseSize1}`, 10, 60);
        //text(`Square size: ${ellipseSize2}`, 10, 80);
    }
    else {
        textSize(12);
        text('Make sure Serial Bridge is running and arduino_1 is connected', width / 2, height / 2 + 10);
    }

       
}
function startSaving() {
    setInterval(saveCurrentReading, 1); // Run saveCurrentData every X milliseconds
    console.log("Started saving every " + saveMinutes + " minutes"); // Tell us it started
}

function saveCurrentReading(){
// Create a JSON object with nested sensor data
        currentReading = {
            timestamp: new Date().toISOString(),
            midi: {
                midi1: midiNotes[i],
                midi2: midiNotes[j],
                midi3: midiNotes[n]
            }
        };
        allData.push(currentReading);

        // Console log the JSON object
        console.log("JSON reading:", currentReading);
        console.log("Total readings collected:", allData.length);

    }

function connectionDisplay() {
    // Connection status indicator
    let statusColor = isConnected ? color(16, 185, 129) : color(239, 68, 68);
    fill(statusColor);
    circle(width / 2, height - 55, 12);

    textAlign(CENTER, CENTER);
    textSize(12);
    fill(150);
    text(connectionStatus.toUpperCase(), width / 2, height - 30);
}

function downloadData() {
        saveJSON(allData, 'midi-data.json'); // Save as JSON file
        console.log("Downloaded " + allData.length + " readings!"); // Tell us it worked
    }


