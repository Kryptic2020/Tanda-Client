import { sumBreak,convertTime,convertDate } from '../src/utils/shiftFunctions';

describe('calculations', () => {
  describe('sum breaks', () => {
    it('sum', () => {
      expect(sumBreak([5, 5])).toBe(10);
    });
  });

  describe('convertTime', () => {
    it('sum', () => {
      expect(convertTime(new Date(2021, 11, 24, 10, 10, 30, 0))).toBe('10:10');
    });
  });
  
  describe('convertDate', () => {
    it('sum', () => {
      expect(convertDate(new Date(2021, 11, 24, 10, 10, 30, 0))).toBe('24/12/2021');
    });
  });
});
