const readAndPreProcessFile = async (): Promise<string[][][]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text()

  const [part1, part2] = puzzleInput.split('\n\n')

  var rules = part1.split('\n').map((line) => line.split('|'))
  var updates = part2.split('\n').map((line) => line.split(','))

  return [rules, updates]
}

const doesUpdateFollowRule = (update: string[], rule: string[]) => {
  if (!update.includes(rule[0]) || !update.includes(rule[1])) {
    return true
  }

  return update.indexOf(rule[0]) < update.indexOf(rule[1])
}

const doesUpdateFollowRules = (update: string[], rules: string[][]) => {
  return rules.every((rule) => doesUpdateFollowRule(update, rule))
}

const toCorrectOrder = (update: string[], rules: string[][]) => {
  const relevantRules = rules.filter((rule) =>
    rule.every((r) => update.includes(r))
  )

  while (!doesUpdateFollowRules(update, relevantRules)) {
    relevantRules.forEach((rule) => {
      if (!doesUpdateFollowRule(update, rule)) {
        const idx1 = update.indexOf(rule[0])
        const idx2 = update.indexOf(rule[1])
        ;[update[idx1], update[idx2]] = [update[idx2], update[idx1]]
      }
    })
  }
  return update
}

const sumMiddleNumbers = (updates: string[][]) => {
  return updates.reduce(
    (acc, update) => acc + Number(update[Math.floor(update.length / 2)]),
    0
  )
}

const solve_ex1 = async () => {
  const [rules, updates] = await readAndPreProcessFile()

  const result = sumMiddleNumbers(
    updates.filter((update) =>
      rules.every((rule) => doesUpdateFollowRule(update, rule))
    )
  )

  console.log('Ex 1: ' + result) // 5955
}

const solve_ex2 = async () => {
  const [rules, updates] = await readAndPreProcessFile()

  const result = sumMiddleNumbers(
    updates
      .filter(
        (update) => !rules.every((rule) => doesUpdateFollowRule(update, rule))
      )
      .map((update) => toCorrectOrder(update, rules))
  )

  console.log('Ex 2: ' + result) // 4030
}

solve_ex1()
solve_ex2()
