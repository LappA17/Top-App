import CoursesIcon from './icons/Courses.svg';
import BooksIcon from './icons/books.svg';
import ProductsIcon from './icons/products.svg';
import ServicesIcon from './icons/Services.svg';
import { FirstLevelMenuItem } from '../interfaces/menu.interface';
import { TopLevelCategory } from '../interfaces/page.interface';

export const firstLevelMenu: FirstLevelMenuItem[] = [
	{ route: 'courses', name: 'Курсы', icon: <CoursesIcon />, id: TopLevelCategory.Courses },
	{ route: 'services', name: 'Сервисы', icon: <ServicesIcon />, id: TopLevelCategory.Services },
	{ route: 'books', name: 'Книги', icon: <BooksIcon />, id: TopLevelCategory.Books },
	{ route: 'products', name: 'Продукты', icon: <ProductsIcon />, id: TopLevelCategory.Products },
];

export const priceRu = (price: number): string =>
	price
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
		.concat(' $');

export const declOfNum = (number: number, titles: [string, string, string]): string => {
	const cases = [2, 0, 1, 1, 1, 2];
	return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
};

//Антон написал эту регулярку что бы число с зарплатой автоматически разбивалось вот так 100 000, а не 100000 и конкатинировалось с символов валюты и отступом
// https://regex101.com/ на этом сайте можно тестить сразу что получилось

// \B - обозначает что мы ищем пустые строки не в начале и не в конце. (?=) - это позитивный поиск вперед. (/d{3}) - идут цифлы через Три
// (\d{3})+ знак плюс обазначает что мы должны после него указать сколько раз это должно повторяться
// ?! - это негавтивный лук ап ехед, антоним ?=
// \d нам нужна цифра
// (?!\d))/ - это обозначает что за ними не должно идти не какое другое число

//
// title: [string, string, string] - потому что у нас будет три разных вариант 0 - отзывов, 1 - отзыв, 2 - отзыва, те три теоритечиских Скланение(паддежа). По-этому мы зададим ТАПЛ потому что у нас их три ограниченных числа !
