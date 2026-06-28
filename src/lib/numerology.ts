import { Arrow, ElementData, Gender } from '../types';

export const pythagoreanTable: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const vowels = ['A', 'E', 'I', 'O', 'U', 'Y'];

export function reduceNumber(num: number | undefined | null, masterAllowed: boolean = true): number {
  if (num === undefined || num === null || isNaN(num)) return 0;
  if (masterAllowed && [11, 22, 33].includes(num)) return num;
  if (num < 10) return num;
  if (num === 10) return 10;
  
  const sum = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return reduceNumber(sum, masterAllowed);
}

export function calculateLifePath(birthDate: string): number {
  if (!birthDate) return 0;
  const parts = birthDate.split('-').map(Number);
  if (parts.length < 3) return 0;
  
  const [year, month, day] = parts;
  
  const d = reduceNumber(day, true);
  const m = reduceNumber(month, true);
  const y = reduceNumber(year, true);
  
  const total = d + m + y;
  if ([11, 22, 33].includes(total)) return total;
  return reduceNumber(total, true);
}

export function calculateNameNumbers(fullName: string) {
  if (!fullName) return { destiny: 0, soulUrge: 0, innerSelf: 0 };
  const normalized = fullName.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, '');
  
  let destinySum = 0;
  let soulUrgeSum = 0;
  let innerSelfSum = 0;
  
  for (let char of normalized) {
    const val = pythagoreanTable[char] || 0;
    destinySum += val;
    if (vowels.includes(char)) {
      soulUrgeSum += val;
    } else {
      innerSelfSum += val;
    }
  }
  
  return {
    destiny: reduceNumber(destinySum, true),
    soulUrge: reduceNumber(soulUrgeSum, true),
    innerSelf: reduceNumber(innerSelfSum, true)
  };
}

export function generateBirthChart(birthDate: string): number[][] {
  if (!birthDate) return Array(3).fill(0).map(() => Array(3).fill(0));
  const digits = birthDate.replace(/-/g, '').split('').map(Number);
  const counts: Record<number, number> = {};
  digits.forEach(d => {
    if (d === 0 || isNaN(d)) return;
    counts[d] = (counts[d] || 0) + 1;
  });
  
  return [
    [counts[3] || 0, counts[6] || 0, counts[9] || 0],
    [counts[2] || 0, counts[5] || 0, counts[8] || 0],
    [counts[1] || 0, counts[4] || 0, counts[7] || 0]
  ];
}

export function analyzeArrows(grid: number[][]): Arrow[] {
  const arrows: Arrow[] = [];
  const check = (coords: [number, number][], name: string, path: string) => {
    const values = coords.map(([r, c]) => grid[r][c]);
    const hasAll = values.every(v => v > 0);
    const hasNone = values.every(v => v === 0);
    if (hasAll) arrows.push({ name: `Mũi tên ${name}`, type: 'strength', path, description: `Bạn sở hữu sức mạnh ${name}.` });
    else if (hasNone) arrows.push({ name: `Mũi tên ${name}`, type: 'weakness', path, description: `Bạn có thể gặp thử thách về ${name}.` });
  };
  check([[2, 0], [2, 1], [2, 2]], 'Thể chất', '1-4-7');
  check([[1, 0], [1, 1], [1, 2]], 'Cảm xúc', '2-5-8');
  check([[0, 0], [0, 1], [0, 2]], 'Trí tuệ', '3-6-9');
  check([[2, 0], [1, 0], [0, 0]], 'Kế hoạch', '1-2-3');
  check([[2, 1], [1, 1], [0, 1]], 'Ý chí', '4-5-6');
  check([[2, 2], [1, 2], [0, 2]], 'Hoạt động', '7-8-9');
  check([[2, 0], [1, 1], [0, 2]], 'Quyết tâm', '1-5-9');
  check([[0, 0], [1, 1], [2, 2]], 'Tâm linh', '3-5-7');
  return arrows;
}

export function calculatePersonalYear(birthDate: string): number {
  if (!birthDate) return 0;
  const today = new Date();
  const currentYear = today.getFullYear();
  const parts = birthDate.split('-').map(Number);
  if (parts.length < 3) return 0;
  const [_, month, day] = parts;
  const sum = reduceNumber(day, false) + reduceNumber(month, false) + reduceNumber(currentYear, false);
  return reduceNumber(sum, false);
}

export function calculatePyramids(birthDate: string): number[] {
  if (!birthDate) return [0, 0, 0, 0];
  const parts = birthDate.split('-').map(Number);
  if (parts.length < 3) return [0, 0, 0, 0];
  const [year, month, day] = parts;
  const d = reduceNumber(day, false);
  const m = reduceNumber(month, false);
  const y = reduceNumber(year, false);
  const peak1 = reduceNumber(m + d, false);
  const peak2 = reduceNumber(d + y, false);
  const peak3 = reduceNumber(peak1 + peak2, false);
  const peak4 = reduceNumber(m + y, false);
  return [peak1, peak2, peak3, peak4];
}

export function calculateCungPhi(birthDate: string, gender: Gender): string {
  if (!birthDate) return 'N/A';
  const year = parseInt(birthDate.split('-')[0]);
  
  // Basic Cung Phi calculation for 20th and 21st century
  // Logic: Sum of digits of year reduced to single digit.
  const yearSum = year.toString().split('').reduce((acc, d) => acc + parseInt(d), 0);
  const reduced = (yearSum - 1) % 9 + 1;
  
  const maleCung = ["Khảm", "Ly", "Cấn", "Đoài", "Càn", "Khôn", "Tốn", "Chấn", "Khôn"];
  const femaleCung = ["Cấn", "Càn", "Đoài", "Cấn", "Ly", "Khảm", "Khôn", "Chấn", "Tốn"];
  
  // This is a simplified table, specific formulas exist but mapping is easier for this context
  const index = (reduced - 1) % 9;
  return gender === 'Nam' ? maleCung[index] : femaleCung[index];
}

export function calculateElement(birthDate: string): ElementData {
  if (!birthDate) return { element: 'Thổ', napAm: 'N/A', description: '', luckyColors: [], luckyNumbers: [], luckyDirections: [] };
  const year = parseInt(birthDate.split('-')[0]);
  
  // Can index: Giáp=4, Ất=5, Bính=6, Đinh=7, Mậu=8, Kỷ=9, Canh=0, Tân=1, Nhâm=2, Quý=3
  const canMap: Record<number, string> = { 4: 'Giáp', 5: 'Ất', 6: 'Bính', 7: 'Đinh', 8: 'Mậu', 9: 'Kỷ', 0: 'Canh', 1: 'Tân', 2: 'Nhâm', 3: 'Quý' };
  const chiMap: Record<number, string> = { 0: 'Thân', 1: 'Dậu', 2: 'Tuất', 3: 'Hợi', 4: 'Tý', 5: 'Sửu', 6: 'Dần', 7: 'Mão', 8: 'Thìn', 9: 'Tỵ', 10: 'Ngọ', 11: 'Mùi' };
  
  const canVal = year % 10;
  const chiVal = year % 12;
  const canName = canMap[canVal];
  const chiName = chiMap[chiVal];
  const fullChiCan = `${canName} ${chiName}`;

  // Simplified Nạp Âm Logic
  const canWeight: Record<string, number> = { 'Giáp': 1, 'Ất': 1, 'Bính': 2, 'Đinh': 2, 'Mậu': 3, 'Kỷ': 3, 'Canh': 4, 'Tân': 4, 'Nhâm': 5, 'Quý': 5 };
  const chiWeight: Record<string, number> = { 'Tý': 0, 'Sửu': 0, 'Ngọ': 0, 'Mùi': 0, 'Dần': 1, 'Mão': 1, 'Thân': 1, 'Dậu': 1, 'Thìn': 2, 'Tỵ': 2, 'Tuất': 2, 'Hợi': 2 };
  
  let weightSum = canWeight[canName] + chiWeight[chiName];
  if (weightSum > 5) weightSum -= 5;
  
  const elements: Record<number, { name: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ', colors: string[], dir: string[] }> = {
    1: { name: 'Kim', colors: ['Trắng', 'Xám', 'Vàng kim'], dir: ['Tây', 'Tây Bắc'] },
    2: { name: 'Thủy', colors: ['Đen', 'Xanh dương'], dir: ['Bắc'] },
    3: { name: 'Hỏa', colors: ['Đỏ', 'Hồng', 'Tím'], dir: ['Nam'] },
    4: { name: 'Thổ', colors: ['Vàng', 'Nâu'], dir: ['Trung tâm', 'Đông Bắc', 'Tây Nam'] },
    5: { name: 'Mộc', colors: ['Xanh lá'], dir: ['Đông', 'Đông Nam'] }
  };
  
  const res = elements[weightSum] || elements[4];
  
  return {
    element: res.name,
    napAm: `${res.name} (${fullChiCan})`,
    description: `Bản mệnh ${res.name} mang năng lượng đặc trưng của tuổi ${fullChiCan}.`,
    luckyColors: res.colors,
    luckyNumbers: [canWeight[canName], chiWeight[chiName] + 1].filter(n => n > 0),
    luckyDirections: res.dir
  };
}
