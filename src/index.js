import './style.css'
//import sound from './fanfare.mp3'

const elements = []
const empty = "empty"
const WIDTH = 4
const HEIGHT = 4

//const fanfare = new Audio(sound)
//fanfare.volume = 0.4

const to1DIndex = (row, col, width = WIDTH) => {
    return row * width + col
}

const to2DCoordinate = (index, width = WIDTH) => {
    const row = Math.floor(index / width)
    const col = index % width
    return [row, col]
}

const getElementPosition = index => {
    const gutter = 2
    let left, top, leftShift

    if (index > 12) {
        top = '306px'
        leftShift = 12
    } else if (index > 8) {
        top = '204px'
        leftShift = 8
    } else if (index > 4) {
        top = '102px'
        leftShift = 4
    } else {
        top = '0px'
        leftShift = 0
    }

    left = 100 * (index - leftShift)
    if (left > 100) {
        left += gutter * (index - 1 - leftShift)
    }
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

const component = index => {
    const element = document.createElement('div')
    const number = document.createElement('div')
    number.classList.add('number')
    number.textContent = index
    element.append(number)

    element.classList.add('brick')
    element.classList.add(`brick${index}`)
    positionElement(element, getElementPosition(index))

    element.addEventListener('click', e => {
        const index = elements.indexOf(element)
        const freeIndex = elements.indexOf(empty)
        if (possibleTargets(index).includes(freeIndex)) {
            moveElementBetween(index, freeIndex)
            positionElement(element, getElementPosition(freeIndex + 1))
            if (boardIsCompleted()) {
                const el = component(elements.length)
                const {top, left} = el.style
                positionElement(el, getElementPosition(11))
                gameBoard.append(el)
                document.querySelectorAll('.number').forEach(e => e.classList.add("hidden"))
                window.setTimeout(() => {el.style.top = top; el.style.left = left}, 0)
                console.log("TADA!")
//                fanfare.play()
            }
        }
    })

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

