const elements = []
const empty = "empty"
const WIDTH = 4
const HEIGHT = 4

const fanfare = new Audio('fanfare.mp3')
fanfare.volume = 0.4

const to1DIndex = (row, col, width = WIDTH) => {
    return row * width + col
}

const to2DCoordinate = (index, width = WIDTH) => {
    const row = Math.floor(index / width)
    const col = index % width
    return [row, col]
}

const getElementPosition = index => {
    let left, top, leftShift

    if (index > 12) {
        top = '300px'
        leftShift = 12
    } else if (index > 8) {
        top = '200px'
        leftShift = 8
    } else if (index > 4) {
        top = '100px'
        leftShift = 4
    } else {
        top = '0px'
        leftShift = 0
    }

    left = 100 * (index - leftShift)
    left = `${left}px`

    return { left, top }
}

const possibleTargets = index => {
    const board = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
    ]

    const [row, col] = to2DCoordinate(index)
    const n = row > 0 ? to1DIndex(row - 1, col) : -1
    const s = row < HEIGHT-1 ? to1DIndex(row + 1, col) : -1
    const e = col < WIDTH-1 ? to1DIndex(row, col + 1) : -1
    const w = col > 0 ? to1DIndex(row, col - 1) : -1
    return [n, s, e, w].filter(i => i>=0)
}

const moveElementBetween = (index, freeIndex) => {
    elements[index] = elements.splice(freeIndex, 1, elements[index])[0]
}

const boardIsCompleted = () => {
    for (let i = 0; i < elements.length - 1; i++) {
        const element = elements[i]
        if (i !== parseInt(element.textContent, 10) - 1) {
            return false
        }
    }
    return true
}

const positionElement = (element, { left, top }) => {
    element.style.left = left
    element.style.top = top
}

const tada = () => {
    const element = component(elements.length)
    const { top, left } = element.style
    positionElement(element, getElementPosition(11))
    gameBoard.append(element)
    document.querySelectorAll('.number').forEach(e => e.classList.add("hidden"))
    window.setTimeout(() => { positionElement(element, { top, left }) }, 0)
    document.querySelectorAll('.brick').forEach(e => e.removeEventListener('click', clicker))
    fanfare.play()
}

const clicker = ({ target }) => {
    const index = elements.indexOf(target)
    const freeIndex = elements.indexOf(empty)
    if (possibleTargets(index).includes(freeIndex)) {
        moveElementBetween(index, freeIndex)
        positionElement(target, getElementPosition(freeIndex + 1))
        if (boardIsCompleted()) {
            tada()
        }
    }
}

const component = index => {
    const element = document.createElement('div')
    const number = document.createElement('div')

    number.classList.add('number')
    number.textContent = index
    element.append(number)

    element.classList.add('brick')
    element.classList.add(`brick${index}`)
    positionElement(element, getElementPosition(index))

    element.addEventListener('click', clicker)

    return element
}

const gameBoard = document.createElement('div')
gameBoard.id = 'gameboard'
gameBoard.classList.add('gameboard')

for (let i = 1; i < 16; i++) {
    elements.push(component(i))
}
gameBoard.append(...elements)

elements.sort(() => Math.random() - 0.5)
elements.forEach((element, index) => positionElement(element, getElementPosition(index+1)))
elements.push(empty)

document.body.appendChild(gameBoard)

const button = document.getElementById('showNumbers')
button.addEventListener('click', () => {
    if (button.checked) {
        document.querySelectorAll('.number').forEach(e => e.classList.remove("hidden"))
    } else {
        document.querySelectorAll('.number').forEach(e => e.classList.add("hidden"))
    }
})


