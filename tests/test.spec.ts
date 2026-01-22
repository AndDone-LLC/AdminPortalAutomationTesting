import { test, expect } from '@playwright/test';
import { TableUtils } from '../src/utils/tableUtils';
import { AssertionUtils } from '../src/utils/assertionUtils'
import {commonUtils} from '../src/utils/commonUtils'

test('test assertions', async ({ page }) => {

    let actual: string[] = ["Nikhil", "Sandesh"];
    let expcted: string[] = ["Nikhil", "Sandesh"];
    let test: Record<string, string> = { name: "Shubham", lastName: "Gupta" }
    let testExp: Record<string, string> = { name: "Shubham", lastName: "Gupta" }

    let expctedNumber: number[] = [10, 10];
    let actNumber: number[] = [10, 10];
    let actNumber2: number[] = [10, 11];

    let name:string[]=["nik"];
    let namea: string="Nikhil";


    AssertionUtils.softVerifyEquals("Nikhil", "Nikhil");
    AssertionUtils.softVerifyEquals("Shubham", "ShubhamS", "Verify Names");
    AssertionUtils.softVerifyEquals(actual, expcted, "Verify String Array");
    AssertionUtils.softVerifyEquals(actNumber, actNumber2, "Verify Number Array");

    // AssertionUtils.softVerifyEquals(testExp, testExp, "Verify Record/map data type");
    // AssertionUtils.softVerifyEquals(1111, 11112, "Verify Numbers");
    // AssertionUtils.softVerifyEquals("29/10/1993", "29/10/1994", "Verify two date");

    // AssertionUtils.softVerifyTrue(true);
    // AssertionUtils.softVerifyTrue(false, "Verify boolean value as TRUE");

    // AssertionUtils.softVerifyAmount(1012.26, 1012.27, 0.001)
    // AssertionUtils.softVerifyAmount(12.36, 12.27, 0.001, "Verify amount")

    // AssertionUtils.softVerifyNullOrUndefined(name)
    // AssertionUtils.softVerifyNullOrUndefined(name, "Verify Not Null")

    // AssertionUtils.softVerifyNull(name);
    // AssertionUtils.softVerifyNull(null, "Verify Null");

    // AssertionUtils.softVerifyNotEmpty(name);
    // AssertionUtils.softVerifyNotEmpty(name,"Verify empty array");
    // let namea: string="Nikhil";
    // AssertionUtils.verifyFalse(namea==="Nikhils");
    // AssertionUtils.verifyFalse(namea==="Nikhils","Verify name");

    // AssertionUtils.verifyNotEmpty(namea);
    // AssertionUtils.verifyNullOrUndefined(namea);
});


// test.describe('isAscending()', () => {

// //   test('should return true for sorted number array', () => {
// //     const list = [1, 2, 3, 4, 5];
// //     AssertionUtils.softVerifyTrue(commonUtils.isAscending(list));
// //   });

// //   test('should return false for unsorted number array', () => {
// //     const list = [10,1, 3, 2, 4];
// //         AssertionUtils.softVerifyTrue(commonUtils.isAscending(list),"Verify list should be Ascending");
// //   });

// //   test('should return true for empty array', () => {
// //     expect(commonUtils.isAscending([])).toBe(true);
// //   });

// //   test('should return true for single element array', () => {
// //     expect(commonUtils.isAscending([10])).toBe(true);
// //   });

//   test('should return true for sorted string array', () => {
//     const list = ['Apple', 'Banana', 'Mango'];
//     AssertionUtils.softVerifyTrue(commonUtils.isDescending(list));
//   });

//   test('should return false for unsorted string array', () => {
//     const list = ['Banana', 'Apple'];
//     AssertionUtils.softVerifyTrue(commonUtils.isDescending(list));
//   });
// test.describe('sortValues()', () => {

//   test('should sort numbers in ascending order', () => {
//     const input = [5, 2, 9, 1];
//     const result = commonUtils.sortValues(input, 'asc');

//     expect(result).toEqual([1, 2, 5, 9]);
//     console.log('Sorted values:', result);
//   });
//   });

//   test('should sort numbers in descending order', () => {
//     const input = [5, 2, 9, 1];
//     const result = commonUtils.sortValues(input, 'desc');

//     expect(result).toEqual([9, 5, 2, 1]);
//     console.log('Sorted values:', result);
//   });
//   });

//   test('should sort strings in ascending order', () => {
//     const input = ['Banana', 'Apple', 'Mango'];
//     const result = commonUtils.sortValues(input, 'asc');

//     expect(result).toEqual(['Apple', 'Banana', 'Mango']);
//     console.log('Sorted values:', result);
//   });
  
//   test('should sort strings in descending order', () => {
//     const input = ['Banana', 'Apple', 'Mango'];
//     const result = commonUtils.sortValues(input, 'desc');

//     expect(result).toEqual(['Mango', 'Banana', 'Apple']);
//     console.log('Sorted values:', result);
//   });


//   test('should not mutate original array', () => {
//     const input = [3, 1, 2];
//     const copy = [...input];

//     let result=commonUtils.sortValues(input, 'asc');

//     expect(input).toEqual(copy);
//      console.log('Sorted values:', result);
//   });

//   test('should work with duplicate values', () => {
//     const input = [3, 1, 2, 2];
//     const result = commonUtils.sortValues(input, 'asc');

//     expect(result).toEqual([1, 2, 2, 3]);
//     console.log('Sorted values:', result);
//   });

// test.describe('Date Sorting Utilities', () => {

//   const format = 'MMM dd, yyyy HH:mm:ss';

//   test('sortDateNewestToOldest should sort dates correctly', () => {
//     const input = [
//       'Jan 10, 2024 10:30:00',
//       'Jan 08, 2024 09:00:00',
//       'Jan 12, 2024 18:15:00'
//     ];

//     const result = AssertionUtils.sortDateNewestToOldest(input, format);

//     expect(result).toEqual([
//       'Jan 12, 2024 18:15:00',
//       'Jan 10, 2024 10:30:00',
//       'Jan 08, 2024 09:00:00'
//     ]);
//     console.log('Sorted Dates:',result);
//   });

//   test('sortDateOldestToNewest should sort dates correctly', () => {
//     const input = [
//       'Jan 10, 2024 10:30:00',
//       'Jan 08, 2024 09:00:00',
//       'Jan 12, 2024 18:15:00'
//     ];

//     const result = AssertionUtils.sortDateOldestToNewest(input, format);

//     expect(result).toEqual([
//       'Jan 08, 2024 09:00:00',
//       'Jan 10, 2024 10:30:00',
//       'Jan 12, 2024 18:15:00'
//     ]);
//      console.log('Sorted Dates:',result);
//   });

//   test('should return empty array for empty input', () => {
//     expect(
//       AssertionUtils.sortDateNewestToOldest([], format)
//     ).toEqual([]);

//     expect(
//       AssertionUtils.sortDateOldestToNewest([], format)
//     ).toEqual([]);
//   });

//   test('should not mutate original array', () => {
//     const input = [
//       'Jan 10, 2024 10:30:00',
//       'Jan 08, 2024 09:00:00'
//     ];

//     const copy = [...input];

//     AssertionUtils.sortDateNewestToOldest(input, format);

//     expect(input).toEqual(copy);
//   });

// });

const DATE_FORMATS = [
  {
    format: 'MMM dd, yyyy HH:mm:ss',
    dates: [
      'Jan 10, 2024 10:30:00',
      'Jan 08, 2024 09:00:00',
      'Jan 12, 2024 18:15:00'
    ]
  },
  {
    format: 'yyyy-MM-dd',
    dates: [
      '2024-01-10',
      '2024-01-08',
      '2024-01-12'
    ]
  },
  {
    format: 'dd/MM/yyyy',
    dates: [
      '10/01/2024',
      '08/01/2024',
      '12/01/2024'
    ]
  },
  {
    format: 'MM-dd-yyyy',
    dates: [
      '01-10-2024',
      '01-08-2024',
      '01-12-2024'
    ]
  },
  {
    format: 'dd MMM yyyy',
    dates: [
      '10 Jan 2024',
      '08 Jan 2024',
      '12 Jan 2024'
    ]
  },
  {
    format: 'MMM dd, yyyy',
    dates: [
      'Jan 10, 2024',
      'Jan 08, 2024',
      'Jan 12, 2024'
    ]
  }
];

// test.describe('Date Sorting – All Formats', () => {

//   DATE_FORMATS.forEach(({ format, dates }) => {

//     test(`Newest → Oldest | format: ${format}`, () => {
//       const result = AssertionUtils.sortDateNewestToOldest(dates, format);

//       const timestamps = result.map(d =>
//         AssertionUtils.parseDateGeneric(d, format).getTime()
//       );

//       expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a));
//     });

//     test(`Oldest → Newest | format: ${format}`, () => {
//       const result = AssertionUtils.sortDateOldestToNewest(dates, format);

//       const timestamps = result.map(d =>
//         AssertionUtils.parseDateGeneric(d, format).getTime()
//       );

//       expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b));
//     });





