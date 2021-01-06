type CompareFn<Element> = (a: Element, b: Element) => number;

export function asc(a: number, b: number): number {
	return a - b;
}

export function desc(a: number, b: number): number {
	return b - a;
}

function insert<T>(arr: T[], target: T, cmp: CompareFn<T>): void {
	if (arr.length <= 0) {
		arr.push(target);
		return;
	}

	let from = 0;
	if (cmp(target, arr[from]) < 0) {
		arr.splice(from, 0, target);
		return;
	}

	let to = arr.length - 1;
	if (cmp(target, arr[to]) > 0) {
		arr.push(target);
		return;
	}

	while (from < to - 1) {
		const mid = (from + to) >> 1;
		const r = cmp(arr[mid], target);
		if (r === 0) {
			arr.splice(r, 0, target);
			return;
		}
		if (r < 0) {
			from = mid;
		} else {
			to = mid;
		}
	}

	arr.splice(to, 0, target);
}

export default insert;
