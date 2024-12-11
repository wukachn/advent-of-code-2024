const readAndPreProcessFile = async (): Promise<Record<number, number>> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  const initialStones = puzzleInput.split(' ').map(Number)

  const stoneRecord: Record<number, number> = {}
  for (let stone of initialStones) {
    stoneRecord[stone] = (stoneRecord[stone] || 0) + 1
  }
  return stoneRecord
}

const blink = (stones: Record<number, number>): Record<number, number> => {
  const newStones: Record<number, number> = {}
  for (let [stone, count] of Object.entries(stones)) {
    const stoneValue = Number(stone)
    if (stoneValue === 0) {
      newStones[1] = (newStones[1] || 0) + count
    } else if (stone.toString().length % 2 === 0) {
      const half1 = Number(stone.slice(0, stone.length / 2))
      const half2 = Number(stone.slice(stone.length / 2))
      newStones[half1] = (newStones[half1] || 0) + count
      newStones[half2] = (newStones[half2] || 0) + count
    } else {
      const newStoneValue = stoneValue * 2024
      newStones[newStoneValue] = (newStones[newStoneValue] || 0) + count
    }
  }
  return newStones
}

const solve_ex1 = async () => {
  let stones = await readAndPreProcessFile()

  for (let i = 0; i < 25; i++) {
    stones = blink(stones)
  }

  const numberOfStones = Object.values(stones).reduce(
    (acc, val) => acc + val,
    0
  )

  console.log('Ex 1: ' + numberOfStones) // 218956
}

const solve_ex2 = async () => {
  let stones = await readAndPreProcessFile()

  for (let i = 0; i < 75; i++) {
    stones = blink(stones)
  }

  const numberOfStones = Object.values(stones).reduce(
    (acc, val) => acc + val,
    0
  )

  console.log('Ex 2: ' + numberOfStones) // 259593838049805
}

solve_ex1()
solve_ex2()
