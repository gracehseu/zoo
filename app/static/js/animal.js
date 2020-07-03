var xmlhttp;
xmlhttp = new XMLHttpRequest();

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    transparent: true,
    fullscreenTarget: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    canvas: document.querySelector('game')
};

var scaleConfig = {
    mode: Phaser.Scale.FIT
};

var game = new Phaser.Game(config);
var scale = new Phaser.Scale.ScaleManager();
var animalTimer = new Phaser.Time.TimerEvent()
var animal = animalData;
var animalText = animalText;
var animalCount = animalsRehabilitated;
var deadAnimalCount = animalsKilled;
var animalAliveText, animalDeadText;
var timerText;
var button;
var timer = 0;
var animal_timer;
var flag = false;
var studyMinutes = 1;
// var fps = game.loop.actualFps;
var msinseconds = 60;
var secondsinminute = 60;
// var studyTime = studyMinutes * secondsinminute * msinseconds;
var studyTime = 100;
var animalDrawn = false;
var triedForAnimal = true;
var animalGroup = new Phaser.GameObjects.Group(update);
var animalSprite;
var onLoad = true;
var animalOnDisplay = animalCount % 20;
var minWidth = 50;
var maxWidth = 750;
var minHeight = 100;
var maxHeight = 550;

function preload () {
    this.load.image('animal', '/static/assets/' + animal + '.png');
    this.load.image('background', '/static/assets/background.png');
};

function create () {
    var canvas = this.sys.game.canvas;
    var fullscreen = this.sys.game.device.fullscreen;

    this.add.tileSprite(config.width / 2, config.height / 2, config.width, config.height, 'background');

    // var graphics = this.add.graphics();
    // graphics.fillStyle(0xffff00, 1);
    // graphics.fillRect(0, config.height / 5 * 4, config.width, config.height / 5);
    
    button = this.add.text(config.width / 2, 10,
        'rescue a baby ' + animalText + '!', {color: 'white'});
    button.setBackgroundColor('darkgray');
    button.setPadding(10, 10, 10, 10);
    button.setInteractive();
    button.on('pointerup', function () {
        canvas[fullscreen.request]();
        // this.animalDrawn = false;
        triedForAnimal = true;
        // button.setVisible(false);
        // animal_timer = this.time.addEvent({ delay: 30000, callback: this.scale.toggleFullscreen(), callbackscope: this});
        timerText.setVisible(true);

    }, this);   
    timerText = this.add.text(config.width / 2, 10, "30:00", {fill: '#000'});
    timerText.setVisible(false);
    animalAliveText = this.add.text(10, 10, 'Animals alive: ' + animalCount, {fill: '#000'});
    animalDeadText = this.add.text(10, 30, 'Animals killed: ' + deadAnimalCount, {fill: '#000'});
    animalGroup = this.add.group({maxSize: 20});
    // this.add.sprite(100 + xOffset * 50, 100 + yOffset * 50, 'animal');
    // animalSprite.setScale(0.25);
};

// TODO: find something better than pass in 
// I don't think passing in this is good coding
function draw_animals(the_game) {
    // var xOffset = yOffset = 0;
    // reduced_animals = animalCount % 20;
    // for (var i = 0; i < reduced_animals; i++) {
    //     if (i % 5 == 0) {
    //         xOffset = 0;
    //     };
    //     if (i % 5 == 0) {
    //         yOffset++;;
    //     };
    //     var tempAnimal = the_game.add.sprite(100 + xOffset * 50, 100 + yOffset * 50, 'animal');
    //     xOffset++;
    //     tempAnimal.setScale(0.25);
    // };
    // console.log(Math.random(800));
    if (animalGroup.isFull()) {
        animalGroup.clear(true)
    } 
    var tempAnimal = the_game.add.sprite(getRandomIntInclusive(minWidth, maxWidth), getRandomIntInclusive(minHeight, maxHeight), 'animal')
    tempAnimal.setScale(0.35);
    if (getRandomIntInclusive(0, 1) == 1){
            tempAnimal.flipX = true;
        }
    animalGroup.add(tempAnimal);

    
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animal_movement () {
    var listAnimals = animalGroup.getChildren();
    listAnimals.forEach(changePosition);
    function changePosition (animal){
        // console.log(animal);
    
        if (getRandomIntInclusive(0, 200) == 1){        
            if (animal.flipX == false) {
                // animal.x;
                animal.y++;
                animal.x-=10;

            } else {
                // animal.x -= 2;
                animal.y--;
                animal.x+=10;
            }
            if (animal.x >= maxWidth || animal.y >= maxHeight || animal.x <= minWidth || animal.y <= minHeight){
                animal.flipX ? (animal.flipX = false) : (animal.flipX = true);
            };
        }

    }
};

function display_time(seconds, the_game) {
    var fullSeconds = Math.floor(seconds);
    var minutes = (studyMinutes - 1) - Math.floor(seconds / 60);
    var seconds = 60 - (fullSeconds % 60);
    if (seconds == 60) {
        seconds = '00';
        minutes++;
    };
    if (fullSeconds == 0) {
        minutes = studyMinutes;
    };
    if (minutes == 0) {
        minutes = '';
    }
    var temporaryTime = minutes.toString().padStart(2,'0') + " : " + seconds.toString().padStart(2,'0');
    // console.log(temporaryTime);
    timerText.setText(temporaryTime);
};


function update () {
    if (onLoad) {
        
        for (var i = 0; i < animalOnDisplay; i++) {
            draw_animals(this)
        };
        onLoad = false;
    }
    animal_movement();
    if (this.scale.isFullscreen) {
        // console.log('time elapsed' + animal_timer.getElapsedSeconds());
        // display_time(animal_timer.getElapsedSeconds(), this)
        display_time(Math.floor(timer / 60));
        button.setVisible(false);
        timer++;
        if (timer == studyTime){
            timer = 0;
            animalCount++;
            xmlhttp.open('POST', '/habitatupdate', true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.send(JSON.stringify({
                'animal' : animal,
                'animalRehab' : animalCount
            }));
            animalDrawn = false;
            triedForAnimal = false;
            this.scale.toggleFullscreen();
            draw_animals(this);
        }
    }
    else {
        if (timer == 0 && !animalDrawn) {
            // draw_animals (this);
            // console.log(animalSprite);
            // animalGroup.create(Math.random(), Math.random(), 'animal').scale(0.25);
            animalAliveText.setText('Animals rehabilitated: ' + animalCount);
            animalDrawn = true;
            timerText.setVisible(false);
        }
        else if (timer != 0 && triedForAnimal) {
            deadAnimalCount++;
            xmlhttp.open('POST', '/habitatupdate', true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.send(JSON.stringify({
                'animal' : animal,
                'animalDead' : deadAnimalCount
            }));
            animalDeadText.setText('Animals killed: ' + deadAnimalCount);
            triedForAnimal = false;
            timerText.setVisible(false);
            timer = 0;
        }
        else {
            button.setVisible(true);
            // timerText.setVisible(false);
            timer = 0;
        }
    }

};