const createMatrix = (w, h) =>{
    const matrix = [];
    while (h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}
//Sweeps and checks for lines in the matrix
const arenaSweep = () => {
    let rowCount = 1;
    //Using nested loops
    outer: for ( let y = arena.length - 1; y > 0; --y){
        for (let x = 0; x < arena[y].length; ++x){
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}
//Checks collisions
const collide = (arena, player) =>{
    const m = player.matrix;
    const o = player.pos;

    for ( let y = 0; y < m.length; ++y){
        for (let x = 0; x < m[y].length; ++x){
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0){
                return true;
            }
        }
    }
    return false;
}


//Creates our pieces
const createPiece = (type) => {
    if( type === 'I'){
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if ( type === 'L'){
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if ( type === 'J'){
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if ( type === 'O'){
        return [
            [4, 4],
            [4, 4],
        ];
    } else if(type === 'Z'){
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S'){
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if ( type === 'T'){
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

const drawMatrix = (matrix, offset) =>{
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0){
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}
const drawMatrixInMenu = (matrix, offset) =>{
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0){
                menu_contex.fillStyle = colors[value];
                menu_contex.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

const draw = () => {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x:0, y:0});
    drawMatrix(player.matrix, player.pos);
}
const drawMenu = () => {
    menu_contex.fillStyle = '#000';
    menu_contex.fillRect(0, 0, piecemenu.width, piecemenu.height);

    drawMatrixInMenu(menu, {x:0, y:0});
    drawMatrixInMenu(next_piece.matrix, {x:1, y:1.5});
}

const merge = (arena, player) =>{
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) =>{
            if (value !== 0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

const rotate = (matrix, dir) =>{
    for ( let y = 0; y< matrix.length; ++y){
        for (let x = 0; x < y; ++x){
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ]
        }
    }

    if (dir > 0){
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}



const playerDrop = () => {
        player.pos.y++;
        if(collide(arena, player)){
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
            updateScore();
        }
        dropCounter = 0;
}

const playerMove = (offset) => {
    player.pos.x += offset;
    if (collide(arena, player)){
        player.pos.x -= offset;
    }
}
const update = (time = 0)  =>{
    const deltaTime = time - lastTime;
    //All games use deltatime to find out how fast the game should run so people with faster computers will not get advantage

    dropCounter += deltaTime;
    if (dropCounter > dropInterval){
        playerDrop();
    }

    lastTime = time;
    if(isPlay == false) {
        return;
    }
    if(isPaused) {
        document.getElementById('score').innerText = `PAUSED`;
        return;
    }

    draw();
    drawMenu();
    requestAnimationFrame(update);
}

const updateScore = () =>{
    document.getElementById('score').innerText = `Current Score: ${player.score}`;
}

function unhide() {
    isPlay = false;
    var b = document.getElementById("start");
    b.style.display = "block"
}

const playerReset = () =>{
    picese_list.unshift(createPiece(pieces[pieces.length * Math.random() | 0]))
    console.log(picese_list);
    player.matrix = picese_list.pop()
    next_piece.matrix = picese_list[0];
    console.log(next_piece.matrix);
    menu_contex.clearRect(0, 0, piecemenu.width, piecemenu.height);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if ( collide(arena, player)){
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
        unhide();
        // location.assign('index.html')
    }
}

const playerRotate = (dir) =>{
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);

    while(collide(arena, player)){
        player.pos.x += offset;
        offset = -(offset +(offset > 0 ? 1 : -1));
        if ( offset > player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}