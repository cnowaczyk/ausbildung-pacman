# Javascript Cheatsheet

## Datentypen

```javascript
Boolean:
false, true

String:
"Hallo", 'Test', 'aaa'

Number:
10, 40, 3.14, NaN

Array:
[1, 3, 5, 6], ["Test", "Test2"], [true, false, true], []

Spezial:
undefined, null

Beispiel:
let i = 10 + 2 - 4 / 2 * 8;
let j = "Hallo" + " " + "Welt";
```

## Variablen

```javascript
let c = "Veränderbar";

const PI = 3.14;
```

## Ausgabe

```javascript
let i = 10;

console.log(i); // 10 wird auf der Konsole ausgegeben
```

## Funktionen

```javascript
function addNumbers(a, b) {
    return a + b;
}

let x = addNumbers(2, 5); // x = 7
```

## Bedingungen: If - Else

```javascript
let age = 18;

if (age >= 18) {
    console.log("Volljährig")
} else {
    console.log("Nicht volljährig")
}
```

## For-Schleife

```javascript
for (let i = 0; i < 10; i++) {
    console.log(i);
}

const arr = [10, 2, 3, 12];

for (let j = 0; j  < arr.length; j++) {
    console.log(arr[j]);
}
```

## While-Schleife

```javascript
let i = 1;

while (i < 10) {
    console.log(i);
    i *= 2;
}
```

## Objekte

```javascript
let car = {
    manufacturer: 'Tesla',
    model: 'Model 3',
    color: 'white'
}
```

## Klassen

```javascript
class Auto {
    constructor(marke, modell, farbe) {
        this.marke = marke;
        this.modell = modell;
        this.farbe = farbe;
    }

    toString() {
        return "Ich bin ein " + this.marke + " " + this.modell + " mit der Farbe " + this.farbe;
    }
}

let tesla3 = new Auto("Tesla", "Model 3", "Weiß");
console.log(tesla3.toString());
```
