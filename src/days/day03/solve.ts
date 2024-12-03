const readAndPreProcessFile = async (): Promise<string> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text();

  return puzzleInput;
};

const interpret_memory = (memory: string, useConditionals: boolean) => {
  const REGEX = /(mul\((\d{0,3}),(\d{0,3})\))|do\(\)|don\'t\(\)/g;
  const matches = Array.from(memory.matchAll(REGEX));

  let do_op = true;
  let total = 0;
  for (const match of matches) {
    if (match[0] === "do()") {
      do_op = true;
      continue;
    }
    if (match[0] === "don't()") {
      do_op = false;
      continue;
    }

    if (do_op || !useConditionals) {
      total += parseInt(match[2]) * parseInt(match[3]);
    }
  }

  return total;
};

const solve_ex1 = async () => {
  const memory = await readAndPreProcessFile();

  const total = interpret_memory(memory, false);

  console.log("Ex 1: " + total); // 188741603
};

const solve_ex2 = async () => {
  const memory = await readAndPreProcessFile();

  const total = interpret_memory(memory, true);

  console.log("Ex 2: " + total); // 67269798
};

solve_ex1();
solve_ex2();
