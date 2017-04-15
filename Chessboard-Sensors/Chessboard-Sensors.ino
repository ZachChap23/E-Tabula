#define sensors 64
#define cols 8
#define rows 8
unsigned int result[sensors], total[sensors], changed[sensors], pattern[sensors];

int maximum = 0;
int minimum = 1023;
byte ana[cols] = {14, 15, 16, 17, 18, 19, 20, 21};
byte dig[rows] = {2, 3, 4, 5, 6, 7, 8, 9};
int sens = 0;
byte wait = 0;
int trash;

unsigned int curve[sensors] = 
{0, 1, 2, 3, 4, 5, 6, 7, 
15, 14, 13, 12, 11, 10, 9, 8,
16, 17, 18, 19, 20, 21, 22, 23,
31, 30, 29, 28, 27, 26, 25, 24,
32, 33, 34, 35, 36, 37, 38, 39,
47, 46, 45, 44, 43, 42, 41, 40,
48, 49, 50, 51, 52, 53, 54, 55,
63, 62, 61, 60, 59, 58, 57, 56};




void setup() {
  Serial.begin(115200);
  for (int i = 0; i < rows; i++) {
    pinMode(dig[i], OUTPUT);
  }

  for (int i = 0; i < cols; i++) {
    trash = int(analogRead(ana[i]) / 4);
    total[sens] = int(analogRead(ana[i]) / 4);
    maximum = max(total[sens], maximum);
    minimum = min(total[sens], minimum);
    //delay(1);
  }
  for (int wait = 0; wait < 100; wait++) {
    sens = 0;
    //Vertical Sync
    for (int x = 0; x < rows; x++) {
      for (int i = 0; i < rows; i++) {
        if (i == x) {
          digitalWrite(dig[i], HIGH);
        }
        else {
          digitalWrite(dig[i], LOW);
        }
        delayMicroseconds(100);
      }
      //recording
      for (int i = 0; i < cols; i++) {
        result[sens] = int(analogRead(ana[i]) / 4);
        maximum = max(result[sens], maximum);
        minimum = min(result[sens], minimum);
        total[sens] = (total[sens] * 0.9 + result[sens] * 0.1);
        changed[sens] = map(total[sens], 150, 210, 0, 255);
        sens++;
      }
    }
  }
}

void loop() {
  sens = 0;
  //Vertical Sync
  for (int x = 0; x < rows; x++) {
    for (int i = 0; i < rows; i++) {
      if (i == x) {
        digitalWrite(dig[i], HIGH);
      }
      else {
        digitalWrite(dig[i], LOW);
      }
      delayMicroseconds(100);
    }
    //recording
    for (int i = 0; i < cols; i++) {
      result[sens] = int(analogRead(ana[i]) / 4);
      maximum = max(result[sens], maximum);
      minimum = min(result[sens], minimum);
      total[sens] = (total[sens] * 0.9 + result[sens] * 0.1);
      changed[sens] = constrain((map(total[sens], 120, 220, 0, 255)), 0, 255);
      sens++;
    }


  }
  //Rewrite Pattern
  for(int i = 0; i < sensors; i++) {
    pattern[i] = changed[curve[i]];
    
  }
  //Serial Print
  for (int i = 0; i < sensors; i++) {
    //Smoothed
    //Serial.print(total[i]);
    //Serial.print(" ");

    //Amplified
    //Serial.print(changed[i]);
    //Serial.print(" ");

    //s-pattern
    Serial.print(pattern[i]);
    Serial.print(" ");
    /*
      //Raw
      Serial.print(result[i]);
      Serial.print("   ");
    */
  }
  Serial.println();
  delay(10);
}
