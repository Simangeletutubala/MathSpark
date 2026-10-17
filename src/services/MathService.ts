import { Difficulty, Operation, Question, Term } from '../types';

export class MathService {
  static getTopicsForTerm(term: Term): Operation[] {
    switch (term) {
      case Term.TERM_1:
        return [
          Operation.PLACE_VALUE,
          Operation.ROUNDING,
          Operation.NUMBER_SENTENCES,
          Operation.ADDITION,
          Operation.SUBTRACTION,
          Operation.MULTIPLICATION,
        ];
      case Term.TERM_2:
        return [
          Operation.DIVISION,
          Operation.PATTERNS,
          Operation.SHAPES_2D,
          Operation.OBJECTS_3D,
        ];
      case Term.TERM_3:
        return [
          Operation.FRACTIONS,
          Operation.DATA_HANDLING,
          Operation.MEASUREMENT,
          Operation.PROBABILITY,
        ];
      case Term.TERM_4:
        return [
          Operation.TIME,
          Operation.MEASUREMENT,
          Operation.PERIMETER_AREA,
          Operation.DIVISION,
        ];
      default:
        return [Operation.ADDITION, Operation.SUBTRACTION];
    }
  }

  static getQuestionKey(q: Question): string {
    return `${q.operation}-${q.num1}-${q.num2}-${q.text.length}-${q.answer}`;
  }

  static generateQuestion(
    difficulty: Difficulty, 
    enabledOperations: Operation[] = [Operation.ADDITION, Operation.SUBTRACTION, Operation.MULTIPLICATION]
  ): Question {
    const operations = enabledOperations.length > 0 ? enabledOperations : [Operation.ADDITION];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    // Familiar South African names and items for visual real-life scenarios
    const names = ['Sipho', 'Lerato', 'Luan', 'Zanele', 'Mandla', 'Amara', 'Bongani', 'Chloe', 'Thandi'];
    const name = names[Math.floor(Math.random() * names.length)];

    const familiarIcons = ['apple', 'orange', 'star', 'ball', 'pencil', 'counter'];
    const iconType = familiarIcons[Math.floor(Math.random() * familiarIcons.length)];

    let num1 = 5;
    let num2 = 3;
    let answer: string | number = 0;
    let text = '';
    let headline = '';
    let mathExpression = '';
    let hint = '';
    let explanation: string[] = [];
    let options: (string | number)[] | undefined = undefined;

    switch (operation) {
      case Operation.ADDITION: {
        headline = '➕ Add Together';
        if (difficulty === Difficulty.EASY) {
          // 1-digit to 2-digit within 20 for concrete visual counting
          num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
          num2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
        } else if (difficulty === Difficulty.MEDIUM) {
          num1 = Math.floor(Math.random() * 50) + 12; // 12 to 61
          num2 = Math.floor(Math.random() * 35) + 10; // 10 to 44
        } else {
          // Hard: Grade 4 Whole numbers up to 10,000
          num1 = (Math.floor(Math.random() * 40) + 10) * 10; // e.g. 240
          num2 = (Math.floor(Math.random() * 30) + 10) * 10; // e.g. 150
        }

        answer = num1 + num2;
        mathExpression = `${num1} + ${num2} = ?`;

        const scenarios = [
          `Find the total when you add ${num1} and ${num2}.`,
          `${name} has ${num1} ${iconType}s. A friend gives ${num2} more. How many now?`,
          `Count both groups together: ${num1} plus ${num2}.`
        ];
        text = scenarios[Math.floor(Math.random() * scenarios.length)];
        hint = `Count the first group (${num1}), then count on ${num2} more!`;
        explanation = [
          `Start with ${num1}.`,
          `Add ${num2} more.`,
          `${num1} + ${num2} = ${answer}.`,
          `Total is ${answer}! 🌟`
        ];
        options = this.generateOptions(answer);
        break;
      }

      case Operation.SUBTRACTION: {
        headline = '➖ Take Away';
        if (difficulty === Difficulty.EASY) {
          num1 = Math.floor(Math.random() * 10) + 6; // 6 to 15
          num2 = Math.floor(Math.random() * (num1 - 2)) + 2; // at least 2 remaining
        } else if (difficulty === Difficulty.MEDIUM) {
          num1 = Math.floor(Math.random() * 60) + 25; // 25 to 84
          num2 = Math.floor(Math.random() * (num1 - 10)) + 5;
        } else {
          num1 = (Math.floor(Math.random() * 50) + 30) * 10; // e.g. 450
          num2 = (Math.floor(Math.random() * 25) + 5) * 10;
        }

        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        mathExpression = `${num1} - ${num2} = ?`;

        const scenarios = [
          `Start with ${num1} and take away ${num2}. How many are left?`,
          `${name} had ${num1} ${iconType}s and gave ${num2} away. How many remain?`,
          `What is ${num1} minus ${num2}?`
        ];
        text = scenarios[Math.floor(Math.random() * scenarios.length)];
        hint = `Look at the ${num1} items. Cross out ${num2} of them and count what is left!`;
        explanation = [
          `Start with ${num1}.`,
          `Cross out / take away ${num2}.`,
          `${num1} - ${num2} = ${answer}.`,
          `${answer} are left! 🌟`
        ];
        options = this.generateOptions(answer);
        break;
      }

      case Operation.MULTIPLICATION: {
        headline = '✖️ Equal Groups';
        if (difficulty === Difficulty.EASY) {
          // 2 to 5 groups of 2 to 5 items
          num1 = Math.floor(Math.random() * 4) + 2; // groups
          num2 = Math.floor(Math.random() * 4) + 2; // in each group
        } else if (difficulty === Difficulty.MEDIUM) {
          num1 = Math.floor(Math.random() * 6) + 3; // 3 to 8
          num2 = Math.floor(Math.random() * 7) + 3; // 3 to 9
        } else {
          num1 = Math.floor(Math.random() * 8) + 12; // 12 to 19
          num2 = Math.floor(Math.random() * 8) + 2;  // 2 to 9
        }

        answer = num1 * num2;
        mathExpression = `${num1} × ${num2} = ?`;
        text = `There are ${num1} groups with ${num2} in each group. How many in total?`;
        hint = `Multiplication is repeated addition: add ${num2}, ${num1} times!`;
        explanation = [
          `We have ${num1} groups.`,
          `Each group has ${num2} objects.`,
          `${Array(num1).fill(num2).join(' + ')} = ${answer}.`,
          `${num1} × ${num2} = ${answer}! ⭐`
        ];
        options = this.generateOptions(answer);
        break;
      }

      case Operation.DIVISION: {
        headline = '➗ Share Fairly';
        if (difficulty === Difficulty.EASY) {
          num2 = Math.floor(Math.random() * 3) + 2; // 2, 3, 4 groups
          const perGroup = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5 each
          num1 = num2 * perGroup;
          answer = perGroup;
        } else if (difficulty === Difficulty.MEDIUM) {
          num2 = Math.floor(Math.random() * 4) + 3; // 3 to 6
          const perGroup = Math.floor(Math.random() * 6) + 4; // 4 to 9
          num1 = num2 * perGroup;
          answer = perGroup;
        } else {
          num2 = Math.floor(Math.random() * 5) + 3;
          const perGroup = Math.floor(Math.random() * 15) + 10;
          num1 = num2 * perGroup;
          answer = perGroup;
        }

        mathExpression = `${num1} ÷ ${num2} = ?`;
        text = `Share ${num1} equally among ${num2} friends. How many does each friend get?`;
        hint = `Think: what number multiplied by ${num2} gives ${num1}?`;
        explanation = [
          `We have ${num1} items in total.`,
          `Split them equally into ${num2} groups.`,
          `Each group gets exactly ${answer}.`,
          `Check: ${num2} × ${answer} = ${num1}! 🎈`
        ];
        options = this.generateOptions(answer);
        break;
      }

      case Operation.ROUNDING: {
        headline = '🎯 Round Off';
        const roundTo = difficulty === Difficulty.EASY ? 10 : difficulty === Difficulty.MEDIUM ? 100 : 1000;
        if (roundTo === 10) {
          num1 = Math.floor(Math.random() * 85) + 12; // e.g. 47
          answer = Math.round(num1 / 10) * 10;
          num2 = 10;
        } else if (roundTo === 100) {
          num1 = Math.floor(Math.random() * 800) + 120;
          answer = Math.round(num1 / 100) * 100;
          num2 = 100;
        } else {
          num1 = Math.floor(Math.random() * 7000) + 1500;
          answer = Math.round(num1 / 1000) * 1000;
          num2 = 1000;
        }

        mathExpression = `Round ${num1} to nearest ${roundTo}`;
        text = `Round off ${num1} to the nearest ${roundTo}.`;
        
        const lastDigit = Math.floor((num1 % roundTo) / (roundTo / 10));
        hint = `Look at the digit: ${lastDigit}. If it is 5 or more, round UP!`;
        explanation = [
          `Find the nearest ${roundTo} below and above ${num1}.`,
          `The test digit is ${lastDigit}.`,
          lastDigit >= 5 
            ? `${lastDigit} is 5 or more, so we round UP to ${answer}!`
            : `${lastDigit} is less than 5, so we round DOWN to ${answer}!`,
          `Answer: ${answer}`
        ];
        options = this.generateOptions(answer);
        break;
      }

      case Operation.PLACE_VALUE: {
        headline = '🧩 Place Value';
        const places = ['Units', 'Tens', 'Hundreds', 'Thousands'];
        const pIdx = difficulty === Difficulty.EASY ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 4);
        const place = places[pIdx];

        num1 = Math.floor(Math.random() * 8900) + 1050; // e.g. 4382
        const str = num1.toString().padStart(4, '0');
        const digitVal = parseInt(str[3 - pIdx]);
        num2 = pIdx;

        // Either ask for digit or total value (e.g. 300)
        const askValue = Math.random() > 0.4;
        if (askValue) {
          const multiplier = Math.pow(10, pIdx);
          answer = digitVal * multiplier;
          text = `What is the value of the ${place} digit in ${num1}?`;
          mathExpression = `${place} in ${num1}`;
          explanation = [
            `In ${num1}, the ${place} column has the digit ${digitVal}.`,
            `${digitVal} ${place} = ${digitVal} × ${multiplier} = ${answer}.`
          ];
        } else {
          answer = digitVal;
          text = `Which digit is in the ${place} place in ${num1}?`;
          mathExpression = `${place} digit of ${num1}`;
          explanation = [
            `Read from right to left: Units, Tens, Hundreds, Thousands.`,
            `The ${place} digit is ${digitVal}.`
          ];
        }
        hint = `Remember: from right to left is Units, Tens, Hundreds, Thousands (U, T, H, Th)!`;
        options = this.generateOptions(answer);
        break;
      }

      case Operation.FRACTIONS: {
        headline = '🍰 Fractions';
        const denoms = [2, 3, 4, 6, 8];
        const denom = denoms[Math.floor(Math.random() * denoms.length)];
        const numer = Math.floor(Math.random() * (denom - 1)) + 1;
        num1 = numer;
        num2 = denom;

        const qType = Math.floor(Math.random() * 2);
        if (qType === 0) {
          // Compare to 1/2
          const fracStr = `${numer}/${denom}`;
          const val = numer / denom;
          mathExpression = `Compare ${fracStr} with 1/2`;
          text = `Is ${fracStr} greater than, less than, or equal to 1/2?`;
          answer = val > 0.5 ? 'Greater than 1/2' : val < 0.5 ? 'Less than 1/2' : 'Equal to 1/2';
          options = ['Greater than 1/2', 'Less than 1/2', 'Equal to 1/2'];
          hint = `Half of ${denom} is ${denom / 2}. Compare ${numer} to that!`;
          explanation = [
            `The denominator is ${denom}, so half is ${denom / 2}/${denom}.`,
            `Our fraction is ${numer}/${denom}.`,
            `${numer} is ${val > 0.5 ? 'more' : val < 0.5 ? 'less' : 'equal'} than ${denom / 2}.`,
            `So ${fracStr} is ${answer}!`
          ];
        } else {
          // Identify shaded parts
          mathExpression = `Shaded parts: ${numer} of ${denom}`;
          text = `A shape is divided into ${denom} equal parts. ${numer} parts are shaded. What fraction is shaded?`;
          answer = `${numer}/${denom}`;
          options = [`${numer}/${denom}`, `${denom - numer}/${denom}`, `1/${denom}`, `${numer}/${denom + 1}`];
          hint = `Top number (numerator) is shaded parts. Bottom number (denominator) is total equal parts.`;
          explanation = [
            `Top number = ${numer} shaded parts.`,
            `Bottom number = ${denom} total equal parts.`,
            `The fraction is ${numer}/${denom}.`
          ];
        }
        break;
      }

      case Operation.NUMBER_SENTENCES: {
        headline = '❓ Missing Number';
        const hidden = Math.floor(Math.random() * 12) + 3;
        const other = Math.floor(Math.random() * 15) + 2;
        const isAdd = Math.random() > 0.5;

        if (isAdd) {
          const total = hidden + other;
          num1 = hidden;
          num2 = other;
          mathExpression = `□ + ${other} = ${total}`;
          text = `What number goes in the box? □ + ${other} = ${total}`;
          answer = hidden;
          hint = `Use the opposite operation: subtract ${total} - ${other}!`;
          explanation = [
            `□ + ${other} = ${total}`,
            `To find the missing number, subtract: ${total} - ${other} = ${hidden}.`,
            `□ is ${hidden}!`
          ];
        } else {
          num1 = hidden + other;
          num2 = other;
          mathExpression = `${num1} - □ = ${hidden}`;
          text = `What number goes in the box? ${num1} - □ = ${hidden}`;
          answer = other;
          hint = `Subtract: ${num1} - ${hidden} gives the mystery number!`;
          explanation = [
            `${num1} - □ = ${hidden}`,
            `Subtract: ${num1} - ${hidden} = ${other}.`,
            `□ is ${other}!`
          ];
        }
        options = this.generateOptions(answer);
        break;
      }

      case Operation.PATTERNS: {
        headline = '🔢 Number Pattern';
        const step = Math.floor(Math.random() * 5) + 2;
        const start = Math.floor(Math.random() * 10) + 1;
        const seq = [start, start + step, start + step * 2, start + step * 3];
        num1 = seq[3];
        num2 = step;
        answer = seq[3] + step;
        mathExpression = `${seq.join(', ')}, ?`;
        text = `What is the next number in this pattern: ${seq.join(', ')}, ...?`;
        hint = `Look at how much is added each time: +${step}!`;
        explanation = [
          `Find the rule: each number grows by +${step}.`,
          `Last number is ${seq[3]}.`,
          `${seq[3]} + ${step} = ${answer}.`
        ];
        options = this.generateOptions(answer);
        break;
      }

      case Operation.SHAPES_2D: {
        headline = '🔷 2D Shapes';
        const shapesList = [
          { name: 'Triangle', sides: 3, icon: 'triangle' },
          { name: 'Square', sides: 4, icon: 'square' },
          { name: 'Rectangle', sides: 4, icon: 'rectangle' },
          { name: 'Pentagon', sides: 5, icon: 'pentagon' },
          { name: 'Hexagon', sides: 6, icon: 'hexagon' },
          { name: 'Circle', sides: 0, icon: 'circle' }
        ];
        const selected = shapesList[Math.floor(Math.random() * shapesList.length)];
        num1 = selected.sides;
        num2 = 0;

        const askSides = Math.random() > 0.5;
        if (askSides) {
          text = `How many straight sides does a ${selected.name} have?`;
          mathExpression = `${selected.name} sides`;
          answer = selected.sides;
          options = [selected.sides, selected.sides + 1, Math.max(0, selected.sides - 1), selected.sides + 2];
          hint = `Count each straight edge around the shape!`;
          explanation = [
            `A ${selected.name} has ${selected.sides} straight sides.`
          ];
        } else {
          text = `Which shape has exactly ${selected.sides} straight sides?`;
          mathExpression = `Shape with ${selected.sides} sides`;
          answer = selected.name;
          const otherNames = shapesList.filter(s => s.name !== selected.name).map(s => s.name).slice(0, 3);
          options = [selected.name, ...otherNames].sort(() => Math.random() - 0.5);
          hint = `Count: a ${selected.name} has ${selected.sides} sides.`;
          explanation = [
            `A ${selected.name} is the shape with ${selected.sides} sides!`
          ];
        }
        break;
      }

      case Operation.OBJECTS_3D: {
        headline = '📦 3D Objects';
        const objectsList = [
          { name: 'Cube', faces: 6, icon: 'box' },
          { name: 'Cylinder', faces: 3, icon: 'cylinder' },
          { name: 'Sphere', faces: 1, icon: 'circle' }
        ];
        const obj = objectsList[Math.floor(Math.random() * objectsList.length)];
        num1 = obj.faces;
        num2 = 0;
        text = `How many faces does a 3D ${obj.name} have?`;
        mathExpression = `${obj.name} faces`;
        answer = obj.faces;
        options = [obj.faces, obj.faces + 2, Math.max(1, obj.faces - 1), obj.faces + 3];
        hint = `Faces are the surfaces you can touch!`;
        explanation = [
          `A ${obj.name} has ${obj.faces} face${obj.faces > 1 ? 's' : ''}.`
        ];
        break;
      }

      case Operation.TIME: {
        headline = '⏰ Telling Time';
        const hr = Math.floor(Math.random() * 9) + 1;
        const add = Math.floor(Math.random() * 3) + 1;
        num1 = hr;
        num2 = add;
        answer = hr + add;
        mathExpression = `${hr}:00 + ${add} hours`;
        text = `If the clock shows ${hr}:00, what time will it be in ${add} hours?`;
        hint = `Count forward on the clock face!`;
        explanation = [
          `Start at ${hr}:00.`,
          `Move forward ${add} hours: ${hr} + ${add} = ${answer}:00.`
        ];
        options = [answer, answer + 1, Math.max(1, answer - 1), answer + 2].map(h => `${h}:00`);
        answer = `${answer}:00`;
        break;
      }

      case Operation.MEASUREMENT: {
        headline = '📏 Measuring Units';
        const m = Math.floor(Math.random() * 5) + 2;
        num1 = m;
        num2 = 100;
        answer = m * 100;
        mathExpression = `${m} m = ? cm`;
        text = `How many centimetres (cm) are in ${m} metres (m)?`;
        hint = `Remember: 1 metre = 100 centimetres!`;
        explanation = [
          `1 m = 100 cm.`,
          `${m} m = ${m} × 100 = ${answer} cm.`
        ];
        options = [answer, answer + 50, answer - 50, m * 10];
        break;
      }

      default: {
        headline = '➕ Add Together';
        num1 = 4;
        num2 = 5;
        answer = 9;
        mathExpression = `4 + 5 = ?`;
        text = `What is 4 + 5?`;
        hint = `Count on your fingers or use the counters!`;
        explanation = [`4 + 5 = 9`];
        options = [8, 9, 10, 7];
        break;
      }
    }

    // Ensure options always exist and contain the correct answer
    if (!options || options.length < 4) {
      options = this.generateOptions(answer);
    }

    return {
      id: Math.random().toString(36).substring(2, 9),
      headline,
      mathExpression,
      text,
      num1,
      num2,
      operation,
      answer,
      hint,
      explanation,
      options,
      iconType,
      isRealLife: true,
      category: 'general'
    };
  }

  static generateOptions(answer: number | string): (number | string)[] {
    if (typeof answer === 'string') {
      if (answer === 'Yes' || answer === 'No') return ['Yes', 'No'];
      if (answer.includes(':00')) {
        const h = parseInt(answer.replace(':00', ''));
        return [`${h}:00`, `${(h % 12) + 1}:00`, `${Math.max(1, h - 1)}:00`, `${(h + 2) % 12 || 12}:00`];
      }
      return [answer, 'Other', 'None', 'Maybe'];
    }

    const set = new Set<number>();
    set.add(answer);

    const deltas = answer < 20 
      ? [-2, -1, 1, 2, 3, -3] 
      : answer < 100 
      ? [-10, 10, -5, 5, -2, 2] 
      : [-100, 100, -50, 50, -10, 10];

    for (const d of deltas) {
      const candidate = answer + d;
      if (candidate >= 0 && candidate !== answer) {
        set.add(candidate);
      }
      if (set.size >= 4) break;
    }

    // Fallback if needed
    let counter = 1;
    while (set.size < 4) {
      set.add(Math.max(0, answer + counter));
      counter++;
    }

    return Array.from(set).sort(() => Math.random() - 0.5);
  }
}
