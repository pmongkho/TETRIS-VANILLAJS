document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const miniGrid = document.querySelector('.mini-grid')
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')
  const WIDTH = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = ['orange', 'red', 'purple', 'green', 'blue']

  // create 200 divs inside of class grid
  for (let i = 0; i < 200; i++) {
    const div = document.createElement('div')
    grid.appendChild(div)
  }

  //create divs at bottom of grid
  for (let i = 0; i < 10; i++) {
    const div = document.createElement('div')

    div.classList.add('taken')
    grid.appendChild(div)
  }

  //create divs for minigrid
  for (let i = 0; i < 16; i++) {
    const div = document.createElement('div')
    miniGrid.appendChild(div)
  }

  //create and array for the divs inside grid
  let squares = Array.from(document.querySelectorAll('.grid div'))

  //shapes of tetrominoes
  const lTetromino = [
    [1, WIDTH + 1, WIDTH * 2 + 1, 2],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
    [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2],
  ]

  const zTetromino = [
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
  ]

  const tTetromino = [
    [1, WIDTH, WIDTH + 1, WIDTH + 2],
    [1, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [1, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
  ]

  const oTetromino = [
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
  ]

  const iTetromino = [
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
  ]

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ]

  let currentPosition = 4
  let currentRotation = 0

  //random number to choose tetromino
  let random = Math.floor(Math.random() * theTetrominoes.length)

  //current state of tetromino
  let current = theTetrominoes[random][currentRotation]

  //draw the Tetromino
  const draw = () => {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  //undraw the Tetromino
  const undraw = () => {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  const control = (e) => {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keydown', control)

  //move down function
  const moveDown = () => {
    undraw()
    currentPosition += WIDTH
    draw()
    freeze()
  }

  //freeze function
  const freeze = () => {
    if (
      current.some((index) =>
        squares[currentPosition + index + WIDTH].classList.contains('taken')
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add('taken')
      )
      //start a new tetromino
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //move left and find edge
  const moveLeft = () => {
    undraw()
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % WIDTH === 0
    )

    if (!isAtLeftEdge) currentPosition -= 1

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 1
    }

    draw()
  }

  //move right and find edge
  const moveRight = () => {
    undraw()
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % WIDTH === WIDTH - 1
    )

    if (!isAtRightEdge) currentPosition += 1

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition -= 1
    }

    draw()
  }

  //rotate function
  const rotate = () => {
    undraw()
    currentRotation++
    //go back to first rotation
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  //show next-up tetrominoe
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWIDTH = 4
  let displayIndex = 0

  //the tetromino without rotation
  const upNextTetrominoes = [
    [1, displayWIDTH + 1, displayWIDTH * 2 + 1, 2],
    [0, displayWIDTH, displayWIDTH + 1, displayWIDTH * 2 + 1],
    [1, displayWIDTH, displayWIDTH + 1, displayWIDTH + 2],
    [0, 1, displayWIDTH, displayWIDTH + 1],
    [1, displayWIDTH + 1, displayWIDTH * 2 + 1, displayWIDTH * 3 + 1],
  ]

  //display shape in mini-gridElement
  const displayShape = () => {
    displaySquares.forEach((square) => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom]
    })
  }

  //startButton onclick
  startButton.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  //add score function
  const addScore = () => {
    for (let i = 0; i < 199; i += WIDTH) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ]

      if (row.every((index) => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach((index) => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, WIDTH)
        squares = squaresRemoved.concat(squares)
        squares.forEach((cell) => grid.appendChild(cell))
      }
    }
  }

  //game over
  const gameOver = () => {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }
})
