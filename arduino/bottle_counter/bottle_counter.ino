// Arduino Ultrasonic Sensor Tutorial
// ©2019 The Geek Pub. Freely distributable with attribution

// Defines the sensor pins
const int echoPin = 9;
const int triggerPin = 10;

// defines variables
long timetofly;
int distance;


// WiFi code
#include <SoftwareSerial.h>
#include "secrets.h"

SoftwareSerial wifiSerial(2, 3);

void sendCommand(const char* command, unsigned long timeout) {
  wifiSerial.println(command);
  unsigned long start = millis();
  while (millis() - start < timeout) {
    while (wifiSerial.available()) {
      char c = wifiSerial.read();
      Serial.write(c);
    }
  }
}

void sendPostRequest() {
  String postData = "device_id=" + String(DEVICE_ID);
  postData += "&event=bottle_detected";
  postData += "&sent_at=" + String(millis());

  String httpRequest = "POST " + String(PROXY_PATH) + " HTTP/1.1\r\n";
  httpRequest += "Host: " + String(PROXY_HOST) + "\r\n";
  httpRequest += "X-Proxy-Secret: " + String(TOKEN) + "\r\n";
  httpRequest += "Content-Type: application/x-www-form-urlencoded\r\n";
  httpRequest += "Connection: close\r\n";
  httpRequest += "Content-Length: " + String(postData.length()) + "\r\n\r\n";
  httpRequest += postData;

  String cipStartCmd = "AT+CIPSTART=\"TCP\",\"" + String(PROXY_HOST) + "\"," + String(PROXY_PORT);
  sendCommand(cipStartCmd.c_str(), 5000);
  String cipSendCmd = "AT+CIPSEND=" + String(httpRequest.length());
  sendCommand(cipSendCmd.c_str(), 2000);
  sendCommand(httpRequest.c_str(), 5000);

}

void connectToWiFi() {
  Serial.println("Setting Wi-Fi mode...");
  sendCommand("AT+CWMODE=1", 2000);

  Serial.println("Connecting to Wi-Fi...");
  String connectCommand = String("AT+CWJAP=\"") + WIFI_SSID + "\",\"" + WIFI_PASSWORD + "\"";
  sendCommand(connectCommand.c_str(), 5000);

  Serial.println("Getting IP address...");
  sendCommand("AT+CIFSR", 2000);
}

void setup() {
  pinMode(triggerPin, OUTPUT);  // Sets trigger to Output
  pinMode(echoPin, INPUT);      // Set echo to Input
  Serial.begin(115200);           // Starts the serial communication

  // Initialize Wi-Fi serial communication
  wifiSerial.begin(9600);

  delay(1000);

  if (strlen(WIFI_SSID) == 0 || strlen(WIFI_PASSWORD) == 0) {
    Serial.println("Set WIFI_SSID and WIFI_PASSWORD before uploading.");
    return;
  }

  connectToWiFi();
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
  timetofly = pulseIn(echoPin, HIGH);

  // Calculating the distance (Time to Fly Calculation)
  distance = timetofly * 0.034 / 2;

  // Prints the distance on the Serial Monitor in CM


  if (distance < 10) {
    Serial.println("Bottle detected!");
    sendPostRequest();
  }
  // else {
  // 	Serial.println("No bottle detected.");
  // }
  delay(100);
}