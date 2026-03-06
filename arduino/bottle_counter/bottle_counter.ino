// Arduino Ultrasonic Sensor Tutorial
// ©2019 The Geek Pub. Freely distributable with attribution
 
// Defines the sensor pins
const int echoPin = 9;
const int triggerPin = 10;
 
// defines variables
long timetofly;
int distance;
 
void setup() {
  pinMode(triggerPin, OUTPUT); // Sets trigger to Output
  pinMode(echoPin, INPUT); // Set echo to Input
  Serial.begin(9600); // Starts the serial communication
}
 
void loop() {
 
  // Clears the triggerPin
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
 
  // Sets the triggerPin on HIGH state for 10 micro seconds
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);
 
  // Reads the echoPin, returns the travel time in microseconds
  timetofly= pulseIn(echoPin, HIGH);
 
  // Calculating the distance (Time to Fly Calculation)
  distance= timetofly*0.034/2;
 
  // Prints the distance on the Serial Monitor in CM
  Serial.print("Distance:");
  Serial.println(distance);
}