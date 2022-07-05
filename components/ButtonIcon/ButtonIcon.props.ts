import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import up from './up.svg';
import close from './close.svg';
import menu from './menu.svg';

export const icons = {
	up,
	close,
	menu,
};

export type IconName = keyof typeof icons;

export interface ButtonIconProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	icon: IconName;
	appearance: 'primary' | 'white';
}
//мы наши иконки называем с маленькой буквы по приччине того что мы будем использовать их как строковый параметр

//Нам нужно сказать что icon может быть одна из тех 3ох, для этого создадим переменную
