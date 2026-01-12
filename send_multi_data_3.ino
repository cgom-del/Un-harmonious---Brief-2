//Adapted form example in class

const int SENSOR_1_PIN = A0;
const int SENSOR_2_PIN = A1;
const int SENSOR_3_PIN = A2;
const int BAUD_RATE = 9600;
const int DELAY_MS = 50; // Send data every 50ms (20 times per second)

void setup()
{
    // Initialize serial communication
    Serial.begin(BAUD_RATE);

    // Wait for serial port to connect (needed for some boards)
    while (!Serial)
    {
        ;
    }

    Serial.println("Serial Bridge - Two Sensors");
    Serial.println("Ready to send data!");
}

void loop()
{
    // Read both analog sensors
    int sensor1Value = analogRead(A0);
    int sensor2Value = analogRead(A1);
    int sensor3Value = analogRead(A2);

    // Send both values separated by a comma
    // Format: "value1,value2"
    Serial.print(sensor1Value);
    Serial.print(",");
    Serial.print(sensor2Value);
    Serial.print(",");
    Serial.println(sensor3Value);

    // Wait before next reading
    delay(DELAY_MS);
}