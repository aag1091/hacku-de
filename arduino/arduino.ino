/* RestClient simple GET request
 *
 * by Chris Continanza (csquared)
 */

#include <Ethernet.h>
#include <SPI.h>
#include "RestClient.h"
#include <ArduinoJson.h>

RestClient client = RestClient("hacku.herokuapp.com", 80);

//Setup
void setup() {
  Serial.begin(9600);
  // Connect via DHCP
  Serial.println("connect to network");
  client.dhcp();

/*
  // Can still fall back to manual config:
  byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
  //the IP address for the shield:
  byte ip[] = { 192, 168, 2, 11 };
  Ethernet.begin(mac,ip);
*/
  Serial.println("Setup!");
}

String response;
void loop(){
  StaticJsonBuffer<200> jsonBuffer;
  response = "";
  int statusCode = client.get("/metrics", &response);
  Serial.print("Status code from server: ");
  Serial.println(statusCode);
  Serial.print("Response body from server: ");
  Serial.println(response);
  char json[256];
  strcpy(json, response.c_str());
  JsonObject& root = jsonBuffer.parseObject(json);
  
  if(!root.success()) {
    Serial.println("Failed creating JSON");
    return;  
  }
  
  int appscorescore = root["appscorescore"];
  bool appscorealert = root["appscorealert"];
  Serial.println("App Score Score");
  Serial.println(appscorescore);
  Serial.println("App Score Alert");
  Serial.println(appscorealert);
  
  
  delay(5000);
}
