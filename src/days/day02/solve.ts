import { arraysEqual } from "../../util/list";

const readAndPreProcessFile = async (): Promise<number[][]> => {
  const puzzleInput = await Bun.file(`${__dirname}/input.txt`).text();

  const reports = puzzleInput
    .split("\n")
    .map((list) => list.split(" ").map(Number));

  return reports;
};

const isReportSafe = (report: number[]): boolean => {
  const asc = report.toSorted((a: number, b: number) => a - b);
  const desc = report.toSorted((a: number, b: number) => b - a);
  if (arraysEqual(report, asc) || arraysEqual(report, desc)) {
    for (let i = 0; i < report.length; i++) {
      const dist = Math.abs(report[i + 1] - report[i]);
      if (dist < 1 || dist > 3) {
        return false;
      }
    }
    return true;
  }
  return false;
};

const solve_ex1 = async () => {
  const reports = await readAndPreProcessFile();

  let safe = 0;
  for (const report of reports) {
    if (isReportSafe(report)) {
      safe++;
    }
  }

  console.log("Ex 1: " + safe); // 516
};

const solve_ex2 = async () => {
  const reports = await readAndPreProcessFile();

  let safe = 0;
  for (const report of reports) {
    for (let i = 0; i < report.length; i++) {
      const removed_one = report.toSpliced(i, 1);
      if (isReportSafe(removed_one)) {
        safe++;
        break;
      }
    }
  }

  console.log("Ex 2: " + safe); // 561
};

solve_ex1();
solve_ex2();
