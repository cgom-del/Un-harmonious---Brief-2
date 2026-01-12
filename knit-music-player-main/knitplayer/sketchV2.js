// This section of code has been adapted from an multi-input-easy-p5js example in CCI class <3
//Midinotes code has been adpated from 16 play midi by arnonurim
//Original source: https://editor.p5js.org/arnonurim/sketches/ejfoXRlBV

//version 1 added download Json button 
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
    let canvas = createCanvas(400, 400);
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

    let downloadBtn = createButton("Download JSON"); // Create download button
    downloadBtn.position(100, 180); // Position next to start button
    downloadBtn.mousePressed(downloadData); // When clicked, run downloadData funct
    
    }





function draw() {
    background(220);
    connectionDisplay();

    if (isConnected) {
        
        i = Math.floor(map(sensor1Value, 1023, 20, 0, midiNotes.length));
        freqs = midiToFreq(midiNotes[i]);
        osc.freq(freqs);
        console.log('midiI' + midiNotes[i]);

      j = Math.floor(map(sensor2Value, 1023, 20, 0, midiNotes.length));
        freqs = midiToFreq(midiNotes[j]);
        osc2.freq(freqs);
        console.log('midiJ' + midiNotes[j]);

       n = Math.floor(map(sensor3Value, 1023, 20, 0, midiNotes.length));
        freqs = midiToFreq(midiNotes[n]);
        osc3.freq(freqs);
        console.log('midiN' + midiNotes[n]);

        // Use sensor1 to control the ellipse size
        let ellipseSize = map(sensor1Value, 0, 1023, 20, 200);
        fill(100, 150, 255);
        ellipse(130, height / 2, ellipseSize, ellipseSize);

        // Use sensor2 to control the square size
        let squareSize = map(sensor2Value, 0, 1023, 20, 200);
        fill(255, 150, 100);
        rectMode(CENTER);
        square(280, height / 2, squareSize);

        // Use sensor3 to control the square size
        let squareSize2 = map(sensor3Value, 0, 1023, 20, 200);
        fill(25, 150, 100);
        rectMode(CENTER);
        square(180, height / 2 +100, squareSize2);

        // Display the values on screen
        fill(0);
        textAlign(LEFT, TOP);
        textSize(14);
        text(`Sensor 1: ${sensor1Value}`, 10, 10);
        text(`Sensor 2: ${sensor2Value}`, 10, 30);
        text(`Ellipse size: ${ellipseSize}`, 10, 60);
        text(`Square size: ${squareSize}`, 10, 80);
    }
    else {
        textSize(12);
        text('Make sure Serial Bridge is running and arduino_1 is connected', width / 2, height / 2 + 10);
    }

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


