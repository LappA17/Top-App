import { TopLevelCategory } from './page.interface';

export interface PageItem {
	alias: string;
	title: string;
	_id: string;
	category: string;
}

export interface MenuItem {
	_id: {
		secondCategory: string;
	};
	isOpened?: boolean;
	pages: PageItem[];
}

export interface FirstLevelMenuItem {
	route: string;
	name: string;
	icon: JSX.Element;
	id: TopLevelCategory;
}

//FirstLevelMenuItem - будет составлять из Роута, по которому нам нужно и перйти и из которого будет составлять второе меню
