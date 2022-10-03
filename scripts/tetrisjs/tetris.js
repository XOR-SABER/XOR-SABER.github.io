const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const piecemenu = document.getElementById('next')
const menu_contex = piecemenu.getContext('2d')


let isPlay = false;
let isPaused = false;
menu_contex.scale(20,20)
context.scale(20, 20);
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
const picese_list = [];
const pieces = 'TJLOSZI';

document.addEventListener('keydown', e => {
    if ( e.key === "ArrowLeft") {
        if(isPlay == true) e.preventDefault();
        playerMove(-1);
    } else if (e.key == "ArrowRight") {
        if(isPlay == true) e.preventDefault();
        playerMove(1);
    } else if (e.key == "ArrowDown"){
        if(isPlay == true) e.preventDefault();
        playerDrop();
    } else if (e.key == "ArrowUp"){
        if(isPlay == true) e.preventDefault();
        playerRotate(-1);
    } else if (e.key == "Escape") {
        togglePause();
    }
})

const colors = [
    //Setting colors for my blocks
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];


//Setting my area size in a matrix
const arena = createMatrix(12, 20);

const menu = createMatrix(3,3);

//Next picece object
const next_piece = {
    matrix: null,
};


//Player object
const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

function toggle() {
    if(isPlay == false) {
        isPlay = true;
        game();
        var b = document.getElementById("start");
        b.style.display = "none"
    }
}

function togglePause()
{
    if (!isPaused)
    {
        isPaused = true;
    } else if (isPaused)
    {
        isPaused= false;
        update();
        updateScore();
    }

}



function game() {
    if(isPlay == true) {
        picese_list.unshift(createPiece(pieces[pieces.length * Math.random() | 0]))
        playerReset();
        updateScore();
        update();
    }
}