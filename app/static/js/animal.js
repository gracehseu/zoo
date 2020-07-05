var xmlhttp;
xmlhttp = new XMLHttpRequest();

var configWidth = window.screen.availWidth;
var configHeight = window.screen.availHeight * 0.75;

console.log(configWidth, configHeight);

var fullscreenWidth = window.screen.width;
var fullscreenHeight = window.screen.height;
console.log(fullscreenWidth, fullscreenHeight);

var config = {
    type: Phaser.AUTO,
    width: configWidth,
    height: configHeight,
    transparent: true,
    fullscreenTarget: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: 'game'
};

var scaleConfig = {
    mode: Phaser.Scale.RESIZE
};

var fontStyle = {
    fill: '#000', 
    fontFamily: 'pixelheart',
    fontSize: '20px'
};

var game = new Phaser.Game(config);
var scale = new Phaser.Scale.ScaleManager(scaleConfig);
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
var fps = 60;
// var msinseconds = 60;
var secondsinminute = 60;
var studyTime = studyMinutes * secondsinminute * fps;
var studyTime = 100;
var animalDrawn = false;
var triedForAnimal = true;
var animalGroup = new Phaser.GameObjects.Group(update);
var animalSprite;
var onLoad = true;
var animalOnDisplay = animalCount % 20;
var minWidth = 50;
var maxWidth = configWidth - 50;
var minHeight = 100;
var maxHeight = configHeight - 50;

function preload () {
    this.load.spritesheet('animal', '/static/assets/' + animal + ' sprite.png', { frameWidth: 50, frameHeight: 50, endFrame: 6 });
    this.load.image('background', '/static/assets/background.png');
};

function create () {

    // create background
    this.add.tileSprite(config.width / 2, config.height / 2, config.width, config.height, 'background');
    
    // set up full screen 
    var canvas = this.sys.game.canvas;
    var fullscreen = this.sys.game.device.fullscreen;

    // create rescue button
    button = this.add.text(config.width / 2 - 110, 10,
        'rescue a baby ' + animalText + '!', fontStyle);
    button.setBackgroundColor('lightgray');
    button.setPadding(10, 10, 10, 10);
    button.setInteractive();
    button.on('pointerup', function () {
        canvas[fullscreen.request]();
        triedForAnimal = true;
        timerText.setVisible(true);

    }, this);   

    // create text for timer, animals alive, animals killed
    timerText = this.add.text(config.width / 2, 10, "30:00", fontStyle);
    timerText.setVisible(false);
    animalAliveText = this.add.text(10, 10, animalText + 's rehabilitated: ' + animalCount, fontStyle);
    animalDeadText = this.add.text(10, 40, animalText + 's killed: ' + deadAnimalCount, fontStyle);
    animalGroup = this.add.group({maxSize: 20});

    // animal movement creation
    var animalMoveConfig = {
        key: 'movement',
        frames: this.anims.generateFrameNumbers('animal', {start: 0, end: 6, first: 0}),
        frameRate: 10,
        repeat: -1
    };
    this.anims.create(animalMoveConfig);

};

// TODO: find something better than pass in 
// I don't think passing in this is good coding
function draw_animals(the_game) {
    if (animalGroup.isFull()) {
        animalGroup.clear(true)
    } 
    var tempAnimal = the_game.add.sprite(getRandomIntInclusive(minWidth, maxWidth), getRandomIntInclusive(minHeight, maxHeight), 'animal')
    tempAnimal.play('movement');
    
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

function animal_movement (the_game) {

    var listAnimals = animalGroup.getChildren();
    listAnimals.forEach(changePosition);
    function changePosition (animal){

        // animal.play('movement');
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
    animal_movement(this);
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
            animalAliveText.setText(animalText + 's rehabilitated: ' + animalCount);
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
            animalDeadText.setText(animalText + 's killed: ' + deadAnimalCount);
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