const container = document.querySelector('.image-container');
const startButton = document.querySelector('.start-button');
const gameText = document.querySelector('.game-text');
const playTime = document.querySelector('.play-time');

const tileCount = 16;
let tiles = [];
const dragged = {
    element: null,
    class: null,
    index: null,
}

let isPlaying = false;
let timeInterval;
let time = 0;

// function

function setGame() {
    isPlaying = true;
    time = 0;
    container.innerHTML = "";
    gameText.style.display = 'none';
    clearInterval(timeInterval);
    changeButton('Restart');

    tiles = createImageTiles();
    tiles.forEach(tile => container.appendChild(tile));
    setTimeout( () => {
        container.innerHTML = "";
        shuffle(tiles).forEach(tile => container.appendChild(tile));
        timeInterval = setInterval ( () => {
            playTime.innerText = time;
            time++;
        }, 1000);
    }, 3000)
}

function createImageTiles() {
    const tileArray = [];
    Array(tileCount).fill().forEach( (_, index) => {
        const li = document.createElement("li");
        li.setAttribute('data-index', index);
        li.setAttribute('draggable', 'true');
        li.classList.add(`list${index}`);
        tileArray.push(li);
    });
    return tileArray;
}

function shuffle(array) {
    let index = array.length -1; // 제일 마지막 인덱스가 선택 되고
    while(index > 0) {
        const randomIndex = Math.floor(Math.random()*(index+1)); // index+1을 해서 유요한 랜덤 인덱스 생성
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]] // 두개의 배열 원소를 선택해서 순서를 바꾸는 로직
        index--; // 인덱스가 1씩 감소하면서 0보다 작을때까지 반복
    }
    return array; // 위에서 순서가 뒤섞인 배열이 리턴
}

function checkStatus() {
    const currentList = [...container.children]; 
    const unMatchList = currentList.filter((child, index) => Number(child.getAttribute("data-index")) !== index)
    if(unMatchList.length === 0) {
        gameText.style.display = "block";
        isPlaying = false;
        clearInterval(timeInterval);
        changeButton('Retry');
    }
}

function changeButton(text) {
    startButton.innerText = text;
}

// events
container.addEventListener('dragstart', (e) => {
    const obj = e.target;
    dragged.element = obj;
    dragged.class = obj.className;
    dragged.index = [...obj.parentNode.children].indexOf(obj);
    if (!isPlaying) {
        return;
    }
});

container.addEventListener('dragover', (e) => {
    e.preventDefault();
});

container.addEventListener('drop', (e) => {
    if (!isPlaying) {
        return;
    }
    const obj = e.target;
    if(obj.className !== dragged.class) {
        let originPlace;
        let isLast = false;
    
        if(dragged.element.nextSibling) {
            originPlace = dragged.element.nextSibling;
        } else {
            originPlace = dragged.element.previousSibling;
            isLast = true;
        }
        const droppedIndex = [...obj.parentNode.children].indexOf(obj);
        dragged.index > droppedIndex ? obj.before(dragged.element) : obj.after(dragged.element);
        isLast ? originPlace.after(obj) : originPlace.before(obj);
    }
    checkStatus();
});

startButton.addEventListener('click', () => {
    setGame();
})
