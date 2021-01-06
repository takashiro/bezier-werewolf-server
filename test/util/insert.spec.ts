import insert, { asc, desc } from '../../src/util/insert';

it('inserts at the front', () => {
	const arr = [1, 3, 9];
	insert(arr, 0, asc);
	expect(arr).toStrictEqual([0, 1, 3, 9]);
});

it('inserts at the end', () => {
	const arr = [1, 3, 9];
	insert(arr, 10, asc);
	expect(arr).toStrictEqual([1, 3, 9, 10]);
});

it('inserts an element into an ordered array', () => {
	const arr = [1, 3, 4, 6, 7, 9];
	insert(arr, 5, asc);
	expect(arr).toStrictEqual([1, 3, 4, 5, 6, 7, 9]);
});

it('works as a sort function (asc)', () => {
	const arr1: number[] = [];
	const arr2: number[] = new Array(20);
	for (let i = 0; i < 20; i++) {
		const num = Math.floor(Math.random() * 0xFFFFFFFF);
		insert(arr1, num, asc);
		arr2[i] = num;
	}
	arr2.sort(asc);
	expect(arr1).toStrictEqual(arr2);
});

it('works as a sort function (desc)', () => {
	const arr1: number[] = [];
	const arr2: number[] = new Array(20);
	for (let i = 0; i < 20; i++) {
		const num = Math.floor(Math.random() * 0xFFFFFFFF);
		insert(arr1, num, desc);
		arr2[i] = num;
	}
	arr2.sort(desc);
	expect(arr1).toStrictEqual(arr2);
});
