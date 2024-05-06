import {calculateWave, changeMapRoutes, testEnemyType} from "../model/WaveCalculator.js";
import {gameIsRunning, setGameInfo, updateHoverTiles} from "./placementTiles.js";
import {ArcherTower, WizardTower, StoneTower, IceTower, FastTower} from "../model/towerTypes.js";

/**
 *  -TODO-
 *  - Add a way to upgrade towers
 *  - Add a way to change the map
 *  - add functionality to the sell button
 *  - add more towers
 *  - balance the game
 *  - add more bosses
 *  - add enemy death animations
 *  - add sprites for the towers
 *  - add sprites for projectiles
 *  - add animations for the towers
 *  - flush out the tower targeting system
 */

/*
--- variables ---
 */

const  /** HTMLCanvasElement */ gameCanvas = document.querySelector('#GameScreen');
const gameBackground = document.querySelector('#GameBackground');
const /** HTMLCanvasElement */ interactiveCanvas = document.querySelector('#GameUI');
const /** HTMLCanvasElement */ gameHover = document.querySelector('#GameHover');
const /** number */ activeMapNbr = 1;  
let /** number */ round = 0;
let playerHealth = 20;
let coins = 350;
let activeTowers = [];
let img = new Image();
let inSettings = false;
let animationID;
let enemies = [];
let showFPS = false;
let showTowerRadius = false;
let gameIsActive = false;

let lastTime = 0;
let currentTime;
let elapsed;
let frameCount = 0;
let fpsAccumulator = 0;

let activeTiles;
let activeTileID;
let allPlacedTowers = [];

const /** CanvasRenderingContext2D */ gameCtx = gameCanvas.getContext('2d');
document.getElementById("GameWaveButton").addEventListener("click", nexWave);
document.getElementById("settingsButton").addEventListener("click", openSettings);
const  fpsCounterElement = document.querySelector('#fpsCounter');
const settingsElement = document.querySelector('.settings');
const checkboxFPS = document.querySelector(".checkbox1");
const checkboxTowerRadius = document.querySelector(".checkbox2");
document.getElementById("closeSettings").addEventListener("click", closeSettings);
document.getElementById("tower1").addEventListener("click", () => selectTower(1));
document.getElementById("tower2").addEventListener("click", () => selectTower(2));
document.getElementById("sellButton").addEventListener("click", sellTower);
let sellButton = document.querySelector('#sellButton');
let tower1Button = document.querySelector('#tower1');
let tower2Button = document.querySelector('#tower2');

const gameBackgroundCtx = gameBackground.getContext('2d');

/*
--- stop of variables ---
 */
/*
--- program initialization ---
 */

/**
 * Sets up canvas dimensions and styling if both gameCanvas and interactiveCanvas exist.
 * Otherwise, alerts the user.
 *
 * @author Philip
 */
if (gameCanvas && interactiveCanvas){
    gameCanvas.width = 1120;
    gameCanvas.height = 960;
    gameBackground.width = gameCanvas.width;
    gameBackground.height = gameCanvas.height;
    gameHover.width = gameCanvas.width;
    gameHover.height = gameCanvas.height;

    interactiveCanvas.width = 200;
    interactiveCanvas.height = 966;

    const interactiveCtx = interactiveCanvas.getContext('2d');
    interactiveCtx.fillStyle = '#574629';
    interactiveCtx.fillRect(0, 0, interactiveCanvas.width, interactiveCanvas.height);
    setGameInfo(gameCanvas, gameCtx)
}else {
    alert('Canvas not found!, Pleas try again later');
}

/**
 * Changes the map based on the activeMap variable.
 *
 * @author Philip
 */
function changeMap(){
    switch (activeMapNbr) { // Load the map based on the activeMap variable
        case 1:
            img.src = '../js/model/assets/gameMap/Map1.png';
            break;

        case 2:
            img.src = '../js/model/assets/gameMap/Map2.png';
            break;

        case 3:
            img.src = '../js/model/assets/gameMap/Map3.png';
            break;

        default:
            console.log('Map not found!');
            break;
    }
    changeMapRoutes(activeMapNbr)
    img.onload = () => {
        gameBackgroundCtx.drawImage(img, 0, 0, gameCanvas.width, gameCanvas.height);
    }
}

/*
-- start upp methods --
 */
updateCoins()
changeMap()

/*
--- end of program initialization ---
 */

/**
 * Selects the tile that the player clicked on.
 * If the tile is already occupied by a tower, the player can sell the tower.
 * Disables towers based on the kind of tile that was clicked.
 * @param tile
 * @author Philip
 */
export function selectTile(tile){

    if(allPlacedTowers.length >= 0){

        if (tile === undefined){

            tower1Button.style.backgroundColor = 'gray';
            tower1Button.style.filter = 'blur(1px)';
            tower1Button.disabled = true;

            tower2Button.style.backgroundColor = 'gray';
            tower2Button.style.filter = 'blur(1px)';
            tower2Button.disabled = true;

            sellButton.style.backgroundColor = 'gray';
            sellButton.style.filter = 'blur(1px)';
            sellButton.disabled = true;

        } else {

            if (allPlacedTowers.includes(tile.positionID)){
                sellButton.disabled = false;
                sellButton.style.backgroundColor = '';
                sellButton.style.filter = 'blur(0px)';

            } else {

                activeTiles = tile;
                activeTileID = activeTiles.positionID;
                tower1Button.style.backgroundColor = 'white';
                tower1Button.style.filter = 'blur(0px)';
                tower1Button.disabled = false;

                tower2Button.style.backgroundColor = 'white';
                tower2Button.style.filter = 'blur(0px)';
                tower2Button.disabled = false;

                sellButton.style.backgroundColor = 'gray';
                sellButton.style.filter = 'blur(1px)';
                sellButton.disabled = true;
            }
        }
    }
}

/**
 * Gives the player the option to sell the tower that is placed on the selected tile.
 * @author Philip
 */
function sellTower(){
    allPlacedTowers.forEach((tower) => {
        if (tower === activeTileID) {
            allPlacedTowers.splice(allPlacedTowers.indexOf(tower), 1);
            activeTowers.splice(activeTowers.includes(activeTileID), 1);
            coins += 50;
            updateCoins()
            selectTile(undefined);
        }

    });
}

/**
 * Based on the buttonID, the player can select a tower to place on the selected tile.
 * if the player has enough coins, the tower will be placed on the selected tile.
 * else the player will not be able to place the tower.
 * @param buttonID
 * @author Philip
 */
function selectTower(buttonID) {

    switch (buttonID) {
        case 1:
            if(coins >= 100){
                activeTowers.push(new ArcherTower(gameCtx, activeTiles));
                allPlacedTowers.push(activeTileID);
                coins -= 100;
                selectTile(undefined);
            }
            break;

        case 2:
            if(coins >= 200){
                activeTowers.push(new WizardTower(gameCtx, activeTiles));
                allPlacedTowers.push(activeTileID);
                coins -= 200;
                selectTile(undefined);
            }
        case 3:
            if(coins >= 200){
                activeTowers.push(new StoneTower(gameCtx, activeTiles));
                allPlacedTowers.push(activeTileID);
                coins -= 200;
                selectTile(undefined);
            }
        case 4:
            if(coins >= 200){
                activeTowers.push(new IceTower(gameCtx, activeTiles));
                allPlacedTowers.push(activeTileID);
                coins -= 200;
                selectTile(undefined);
            }

        case 5:
            if(coins >= 200){
                activeTowers.push(new FastTower(gameCtx, activeTiles));
                allPlacedTowers.push(activeTileID);
                coins -= 200;
                selectTile(undefined);
            }

            break;

        default:
            console.log('Tower not found!')
            break;
    }

    activeTowers.forEach(tower => { // tower
        tower.drawTower();
    });
    updateCoins()
}


/**
 * Loads the next wave of enemies.
 * Disables the "GameWaveButton" button while the wave is running.
 * @author Philip
 */
function nexWave(){
    disableButton()
    gameIsActive = true;

    enemies = calculateWave(round);
    //const enemies = testEnemyType(); // Temporary test function
    gameIsRunning(true);
    gameLoop(enemies);
}


/**
 * Disables the "GameWaveButton" button by changing its style and setting its disabled property to true.
 *
 * @author Philip
 */
function disableButton(){
    let button = document.getElementById("GameWaveButton");
    button.style.backgroundColor = 'gray';
    button.style.filter = 'blur(1px)';
    document.getElementById("GameWaveButton").disabled = true;
}


/**
 * Enables the "GameWaveButton" button by changing its style and setting its disabled property to false.
 *
 * @author Philip
 */
function enableButton(){
    let button = document.getElementById("GameWaveButton");
    button.style.backgroundColor = '';
    button.style.filter = 'none';
    document.getElementById("GameWaveButton").disabled = false;

}

/**
 * Reduces the player health by 1.
 * Updates the health counter on the game screen.
 * @author Philip
 */
function reduceHealth(){
    playerHealth--;
    updateHealthCounter(playerHealth);
}

/**
 * Updates the health with the new health in the game
 * @param newHealth -New number for the health
 * @author Mahyar
 * @author Philip
 */
function updateHealthCounter (newHealth) {
    const healthCounter = document.querySelector('#healthCounter');
    const heartAnimation = document.querySelector('#heartAnimation');
    healthCounter.textContent = newHealth;
    
    switch (newHealth) {
        case 15:
            heartAnimation.src = '../js/model/assets/Life/75.png';
            break;
            
        case 10:
            heartAnimation.src = '../js/model/assets/Life/50.png';
            break;
            
        case 5:
            heartAnimation.src = '../js/model/assets/Life/25.png';
            break;
            
        case 0:
            heartAnimation.src = '../js/model/assets/Life/0.png';
            break;
            
        default:
            break;
    }
}

function addCoins(amount){
    coins += amount;
    updateCoins();
}

/**
 * Updates the coin counter on the game screen. based on the amount of coins the player has.
 * @author Philip
 */
function updateCoins(){
    const CoinsCounter = document.querySelector('#CoinsCounter');
    CoinsCounter.textContent = coins;
}

/**
 * Updates the wave counter on the game screen.
 * @param round
 * @author Philip
 */
function updateWaveCounter(round){
    const waveCounter = document.querySelector('#WaveCounter');
    waveCounter.textContent = 'Wave ' + round;
}



/**
 * The main game loop. Updates the game state and draws the game.
 * is limited to about 60 FPS and is called recursively.
 * Activated by the nextWave button.
 * @param enemies
 * @author Philip,
 */
function gameLoop(enemies) {
    currentTime = performance.now();
    elapsed = currentTime - lastTime;

    if (elapsed > 1000 / 60) { //Limit the frame rate to about 60 FPS
        lastTime = currentTime - (elapsed % (1000 / 60));
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Check if all enemies are dead
        if (enemies.length === 0) {
            console.log('%cWave ' + round + ' Completed!', 'color: green; font-size: 20px;');
            enableButton();
            round++;
            updateWaveCounter(round);
            gameIsRunning(false)

            activeTowers.forEach(tower => { // tower
                tower.drawTower();
            });

            gameIsActive = false;
            return;
        }

        enemies = enemies.filter(enemy => !enemy.update(gameCtx, reduceHealth, addCoins)); // Remove dead enemies, !!Optimization needed, maybe a web worker per enemy?!!
        updateHoverTiles()

        activeTowers.forEach(tower => { // tower
            tower.update(enemies);
        });
        updateCoins()

        // Check if player health is 0
        if (playerHealth <= 0) {
            document.querySelector('#GameOver').style.display = 'flex';
            console.log('%cGAME OVER!', 'color: red; font-size: 20px;');
            cancelAnimationFrame(animationID); // fix animationID not defined
        }
        // Update FPS counter
        if (showFPS){
            fpsCounterUpdate(1000 / elapsed);
        }
    }
    
    // Request next frame
    animationID = requestAnimationFrame(() => gameLoop(enemies));
}


/**
 * Updates the FPS counter on the game screen.
 *
 * @param {number} fps - The current FPS of the game.
 * @returns {void}
 * @author Philip
 */
function fpsCounterUpdate(fps){
    frameCount++;
    fpsAccumulator += fps;

    if (frameCount % 60 === 0) { // Update every 60 frames
        const averageFPS = fpsAccumulator / 60;
        fpsCounterElement.innerHTML = 'Average<br>FPS: ' + averageFPS.toFixed(2);
        fpsAccumulator = 0;
    }
}

/**
 * Opens the settings menu.
 * Cancels the game loop if the game is active.
 * @author Philip
 */
function openSettings(){
    if (!inSettings){ //Check if already in settings
        inSettings = true;
        cancelAnimationFrame(animationID);
        settingsElement.style.display = 'flex';
    }else {
        console.log("ERROR WHILE OPENING SETTINGS!")
    }
}

/**
 * Closes the settings menu.
 * Restarts the game loop if the game is active.
 * @author Philip
 */
function closeSettings(){
        inSettings = false;
        settingsElement.classList.add('flyOut');

        if (gameIsActive){
            console.log(gameIsActive)
            animationID = requestAnimationFrame(() => gameLoop(enemies));
        }
}



/*
--- event listeners ---
 */

/**
 * Event listener for the fullscreen button. Makes the game fullscreen when clicked.
 * @author Philip
 */
addEventListener("click", function() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }
});

/**
 * An event listener for the animation of settings window closing. Checks if the animation that ended is 'flyOut'. If it is, the settings window is hidden.
 * @param e - the event that triggered the animationend event listener.
 * @author Philip
 */
settingsElement.addEventListener('animationend', (e) => {
    // Check if the animation that ended is 'flyOut'
    if (e.animationName === 'flyOut') {
        settingsElement.style.display = 'none';
        settingsElement.classList.remove('flyOut');
    }
});

/**
 * Event listener for checkboxFPS in the settings menu. Checks if the checkbox is checked or unchecked and updates the game accordingly.
 * @param e - the event that triggered the change event listener.
 * @author Philip
 */
checkboxFPS.addEventListener('change', function() {
    // This function will be called whenever the checkbox is checked or unchecked
    // 'this' refers to the checkbox
    if (this.checked) {
        console.log('Checkbox is checked');
        showFPS = true;
        fpsCounterElement.style.display = 'block';
    } else {
        console.log('Checkbox is unchecked');
        showFPS = false;
        fpsCounterElement.style.display = 'none';
    }
});

/**
 * Event listener for checkboxTowerRadius in the settings menu. Checks if the checkbox is checked or unchecked and updates the game accordingly.
 * @author Philip
 */
checkboxTowerRadius.addEventListener('change', function() {
    // This function will be called whenever the checkbox is checked or unchecked
    // 'this' refers to the checkbox
    if (this.checked) {
        console.log('Checkbox is checked');
        showTowerRadius = true;
    } else {
        console.log('Checkbox is unchecked');
        showTowerRadius = false;
    }

    activeTowers.forEach(tower => {
        tower.setStatusOfTowerRange(showTowerRadius);
    });
});
