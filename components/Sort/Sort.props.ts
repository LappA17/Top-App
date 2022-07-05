import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface SortProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	sort: SortEnum;
	setSort: (sort: SortEnum) => void;
}

export enum SortEnum {
	Rating,
	Price,
}

// У нашего интерфейса будет 1)сортировка на текущий момент, нам ее необходимо передать для того что бы правильно отобразить что сейчас выделенно по рейтингу 2)событие изменение, когда мы нажимаем событие - мы должны нашему элементу передать событие что мы нажали по цене
