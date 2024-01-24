
//    player = 0;
//    let evenno = player % 2;
//         document.querySelectorAll('img').forEach((ele) =>{
          
//             if (xturn ){
//                 ele.addEventListener('click', ()=>{
//                     ele.setAttribute('src', 'ximage.png')   
//                 })
//                 player +=1;
//             }else if (evenno == 1){
//                 ele.addEventListener('click', ()=>{
//                     ele.setAttribute('src', 'oimage.png')
//                 }) 
//                 player +=1;
//             }
//         })


// (document).ready(function(){
// var player = 1;
// var winner = 0;
// var colors = {};
// colors[-1] = "yellow";
// colors[1] = "red";
// var count = 0;


// $(".cell").each(function(){
//     $(this).attr("id", count);
//     $(this).attr("data-player", 0);
//     count++;

//     $(".this").click(function(){
//         if(isValid($(this).attr("id"))){
//             $(this).attr("background-color", colors[player])
//             $(this).attr("data-player", player);

//             player *= -1;
//         }
//     });
// });

// function isValid(n){
//     var id = parseInt(n);

//     if ($("#" + id).attr("data-player") === "0"){
//         if(id >= 35){
//             return true;
//         }
//         if ($("#" + (id + 7)).attr("data-player") !== 0){
//             return true;
//         }
//     }
//     return false;
// }
// });
var playerO = "O";
var playerX = "X";


const grid = document.querySelector("#grid");

const modalContainer = document.querySelector("#modal-container");
const modalMessage = document.querySelector("#modal-message");
const resetButton = document.querySelector("#reset");

resetButton.onclick = () =>{
    location.reload();
}

const xTurn = 1;
const oTurn = 2;

let playerTurn = xTurn; // 1 = x, 2 = o

// 0 = empty; 1 = x; 2 = o;
const pieces = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
];

function playerHasWon(playerTurn, pieces){
for(let index = 0; index < 18; index++){
//     //check horizontal win starting at index
//     //if(){
         if( index % 3 < 1 &&
            pieces[index] === playerTurn &&
             pieces[index + 1] === playerTurn &&
             pieces[index + 2] === playerTurn 
         ){
           
             return true;
        }
   
    // check vertical win starting at index
    if( index < 12 &&
        pieces[index] === playerTurn &&
         pieces[index + 3] === playerTurn &&
         pieces[index + 6] === playerTurn 
     ){
       
         return true;
    }

    // check diagonal win starting at index
    if(  index % 3 <= 0 &&
        index < 10 &&
        pieces[index] === playerTurn &&
         pieces[index + 4] === playerTurn &&
         pieces[index + 8] === playerTurn 
     ){
       
         return true;
    }

    // check diagonal win (other direction) starting at index
    if(  index % 3 >= 2 &&
        index < 12 &&
        pieces[index] === playerTurn &&
         pieces[index + 2] === playerTurn &&
         pieces[index + 2] === playerTurn 
     ){
       
         return true;
    }
    
    
}
    return false;
}
 



let hoverColumn = -1;

let animating = false;


for(let i = 0; i < 18 ; i++){
    let cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);

    cell.onmouseenter = () => {
        onMouseEnteredColumn(i % 3);
    }
    cell.onclick = () => {
 if(!animating){
    onColumnClicked(i % 3);  
        
  }
          
    } 
}

function onColumnClicked(column){
    let availableRow = pieces.filter( (_, index)=> index % 3 === column).lastIndexOf(0);
    if (availableRow === -1){
        // no space in the column
        return;
    }

    pieces[(availableRow * 3) + column] = playerTurn;
    let cell = grid.children[(availableRow * 3) + column];

    let piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.placed = true;
    piece.dataset.player = playerTurn;
    piece.innerHTML = playerX;
    piece.style.fontSize = "60px";
    piece.style.textAlign = "center";
    cell.appendChild(piece);

    let unplacedPiece = document.querySelector("[data-placed='false']");
    let unplacedY = unplacedPiece.getBoundingClientRect().y;
    let placedY = piece.getBoundingClientRect().y;
    let yDistance = unplacedY - placedY;

   animating = true;
  removeUnplacedPiece();
      let animation = piece.animate(
        [
            { transform: `translateY(${yDistance}px)`, offset: 0},
            { transform: `translateY(0px)`, offset: 0.6},
             { transform: `translateY(${yDistance / 20}px)`, offset: 0.8},
             { transform: `translateY(0px)`, offset: 0.95}
        ],
        {
           duration: 10,
             easing: "linear",
            iterations: 1
        }
   
    )
    animation.addEventListener('finish', () => {
        animating = false;

        // check if game is  draw
        if(!pieces.includes(0)){
            //game is a draw
          modalContainer.style.display = "block";
          modalMessage.textContent = "Draw";
        }

        // check if game is won
        if(playerHasWon(playerTurn, pieces)){
            // game is won
            modalContainer.style.display = "block";
            modalMessage.textContent = `${playerTurn === xTurn ? "PlayerX" : "PlayerO"}  WON!`;
           
        }

        if(playerTurn === xTurn){
            playerTurn = oTurn;
            piece.innerHTML = playerX;
        } else {
            playerTurn = xTurn;
            piece.innerHTML = playerO;
        }
        // update hovering piece
        updateHover();

    })
   
   
   
   
       
    }
    
    // function checkGameWinOrDraw(){
    //     animating = false;

    //     // check if game is  draw
    //     if(!pieces.includes(0)){
    //         //game is a draw
    //         confirm("Game is drawn");
    //         location.reload();
    //     }

    //     // check if game is won
    //     if(playerHasWon(playerTurn, pieces)){
    //         // game is won
    //         confirm(`${playerTurn === xTurn ? "playerX" : "playerO"}  WON!`);
    //         location.reload();
    //     }

        
    
      
    // }

    


function updateHover() {
// remove existing piece
removeUnplacedPiece();

// add piece
if (pieces[hoverColumn] === 0){
    let cell = grid.children[hoverColumn];
    let piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.placed = false;
    piece.dataset.player = playerTurn;
    if(playerTurn === xTurn){
     
     piece.innerHTML = playerX;
     
 } else {
 
     piece.innerHTML = playerO;
 }
 
    piece.style.fontSize = "60px";
    piece.style.textAlign = "center";
    cell.appendChild(piece);
}
  
}

function removeUnplacedPiece(){
    let unplacedPiece = document.querySelector("[data-placed='false']");
    if (unplacedPiece) {
       unplacedPiece.parentElement.removeChild(unplacedPiece);
    }
}





function onMouseEnteredColumn(column) {
hoverColumn = column;
if(!animating){

updateHover();
}
}
