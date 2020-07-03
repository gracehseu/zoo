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
    }
};

var scaleConfig = {
    mode: Phaser.Scale.FIT
};

var game = new Phaser.Game(config);
var scale = new Phaser.Scale.ScaleManager();
var animalTimer;
var animal = animalData;
var animalText = animalText;
var animalCount = animalsRehabilitated;
var deadAnimalCount = animalsKilled;
var animalAliveText, animalDeadText;
var timerText;
var button;
var timer = 0;
var animalTimer;
var flag = false;
var studyMinutes = 1;
// var fps = game.loop.actualFps;
var msinseconds = 1000;
var secondsinminute = 60;
var studyTime = studyMinutes * secondsinminute * msinseconds;
// var studyTime = 300;
var animalDrawn = false;
var triedForAnimal = false;

function preload () {
    this.load.image('animal', '/static/assets/' + animal + '.png');
    this.load.image('background', '/static/assets/background.png');

};

function create () {
    var canvas = this.sys.game.canvas;
    var fullscreen = this.sys.game.device.fullscreen;

    this.add.image(400, 300, 'background');
    button = this.add.text(320, 500,
        'rescue a baby ' + animalText + '!', {color: 'white'});
    button.setBackgroundColor('darkgray');
    button.setPadding(10, 10, 10, 10);
    button.setInteractive();
    button.on('pointerup', function () {
        canvas[fullscreen.request]();
        // this.animalDrawn = false;
        // triedForAnimal = true;
        // button.setVisible(false);
        console.log(studyTime);
        animalTimer = this.time.addEvent({ delay: studyTime });
        // console.log(animalTimer)
        timerText = this.add.text(350, 450,  "30:00", {fill: '#000'});
        // timerText.setVisible(true);
        // console.log('timerText: ' + timerText);

    }, this);   
    animalAliveText = this.add.text(0, 500, 'Animals alive: ' + animalCount, {fill: '#000'});
    animalDeadText = this.add.text(0, 550, 'Animals killed: ' + deadAnimalCount, {fill: '#000'});


};

// TODO: find something better than pass in 
// I don't think passing in this is good coding
function draw_animals(the_game) {
    var xOffset = yOffset = 0;
    for (var i = 0; i < animalCount; i++) {
        if (i % 5 == 0) {
            xOffset = 0;
        };
        if (i % 5 == 0) {
            yOffset++;;
        };
        var tempAnimal = the_game.add.image(100 + xOffset * 50, 100 + yOffset * 50, 'animal');
        xOffset++;
        tempAnimal.setScale(0.25);
    };
};

function display_time(seconds) {
    // console.log(seconds);
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
    var temporaryTime = minutes + " : " + seconds.toString().padStart(2,'0');
    // console.log(temporaryTime);
    timerText.setText(temporaryTime);
};

function timer_end(the_game){
    // timer = 0;
    animalCount++;
    xmlhttp.open('POST', '/habitatupdate', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify({
        'animal' : animal,
        'animalRehab' : animalCount
    }));
    animalDrawn = false;
    triedForAnimal = false;
    // scale.toggleFullscreen();
}

function update () {
    if (this.scale.isFullscreen) {
        // console.log('scale full screen');
        triedForAnimal = true;
        // console.log(animalTimer.getElapsed(), studyTime);
        display_time(animalTimer.getElapsedSeconds());

        if (animalTimer.getElapsed() == studyTime) {
            this.scale.toggleFullscreen();
            console.log('why are you happening five times');
            animalTimer.reset({ delay: studyTime });
            console.log('im being called before Im destroyed');
            timer_end();
            timerText.destroy();
        }
        button.setVisible(false);
    }
    else {
        // console.log(animalTimer);
        if (animalTimer == null && !animalDrawn) {
            draw_animals (this);
            animalAliveText.setText('Animals rehabilitated: ' + animalCount);
            animalDrawn = true;
        }
        else if (animalTimer != null && triedForAnimal) {
            deadAnimalCount++;
            xmlhttp.open('POST', '/habitatupdate', true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.send(JSON.stringify({
                'animal' : animal,
                'animalDead' : deadAnimalCount
            }));
            animalDeadText.setText('Animals killed: ' + deadAnimalCount);
            triedForAnimal = false;
            console.log('here');
            timerText.setVisible(false);
            animalTimer.destroy();
        }
        else {
            button.setVisible(true);
            timer = null;
        }
    }

};