import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ReviewFormProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	productId: string;
	isOpened: boolean;
}
//productId - по этому продукт Айди мы будем понимать касаео какго продукта была отправлена форма
