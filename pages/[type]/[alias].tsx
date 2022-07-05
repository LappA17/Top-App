import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import React from 'react';
import { withLayout } from '../../layout/Layout';
import axios from 'axios';
import { MenuItem } from '../../interfaces/menu.interface';
import { TopLevelCategory, TopPageModel } from '../../interfaces/page.interface';
import { ParsedUrlQuery } from 'node:querystring';
import { ProductModel } from '../../interfaces/product.interface';
import { firstLevelMenu } from '../../helpers/helpers';
import { TopPageComponent } from '../../page-components';
import { API } from '../../helpers/api';
import Head from 'next/head';
import { Error404 } from '../404';

function TopPage({ firstCategory, page, products }: TopPageProps): JSX.Element {
	if (!page || !products) {
		return <Error404 />; //а ту проверку {page && products && ( удалим ниже
	}
	return (
		<>
			<Head>
				<title>{page.metaTitle}</title>
				<meta name="description" content={page.metaDescription} />
				<meta property="og:title" content={page.metaTitle} />
				<meta property="og:description" content={page.metaDescription} />
				<meta property="og:url" content={page.metaDescription} />
				<meta property="og:type" content="article" />
			</Head>
			<TopPageComponent firstCategory={firstCategory} page={page} products={products} />
		</>
	);
}

export default withLayout(TopPage);

export const getStaticPaths: GetStaticPaths = async () => {
	let paths: string[] = [];
	for (const m of firstLevelMenu) {
		const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
			firstCategory: m.id,
		});
		paths = paths.concat(menu.flatMap(s => s.pages.map(p => `/${m.route}/${p.alias}`)));
	}
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<TopPageProps> = async ({
	params,
}: GetStaticPropsContext<ParsedUrlQuery>) => {
	if (!params) {
		return {
			notFound: true,
		};
	}
	const firstCategoryItem = firstLevelMenu.find(m => m.route == params.type);
	if (!firstCategoryItem) {
		return {
			notFound: true,
		};
	}
	try {
		const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
			firstCategory: firstCategoryItem.id,
		});
		if (menu.length == 0) {
			return {
				notFound: true,
			};
		}
		const { data: page } = await axios.get<TopPageModel>(API.topPage.byAlias + params.alias);
		const { data: products } = await axios.post<ProductModel[]>(API.product.find, {
			category: page.category,
			limit: 10,
		});

		return {
			props: {
				menu,
				firstCategory: firstCategoryItem.id,
				page,
				products,
			},
		};
	} catch {
		return {
			notFound: true,
		};
	}
};

interface TopPageProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: TopLevelCategory;
	page: TopPageModel;
	products: ProductModel[];
}

// Квадратные скобки в название файла - обозначают для Некста что здесь будет динамический Роут
// Это будет страничка конкретного курса
// const { data: page } - после того как мы получили меню, мы получаем и страницу
// в интерфейс создадим новый файл page.interface.ts

//'/api/top-page/byAlias/' +  наш путь немного изменился, после плюса мы передаем Алиас нашей странички. Алиас мы можем получить из входящих параметров
//async ({ params}: GetStaticPropsContext<ParsedUrlQuery>) - сюда мы передали нужные параметры. А здесь мы уже обратились к алиасу '/api/top-page/byAlias/' + params.alias. Почему alias - потому что название нашего файла [alias]
// if (!params) - у нас params может быть undefined и мы написали что если его нет то вернуть 404 ошибку

//Получим страницу по Алиауса - переходим к продукту
//По аналогии только уже с пост запросом реализуем продукты, только через запятую в виде объекта передадим дополнительные параметры категорию страницы и лимит

// Передадим в курсы Course({ menu, page, products }. Все было бы хорошо, но у нас Некст не знает какие пути нам нужно резолвить что бы построить эту страницу и тут нам на помощь приходит getStaticPaths
// После того как мы созадли фцию getStaticPaths нам нужно получить сами эти пути. На самом деле эти пути содержаться у нас с вами в меню, когда мы делаем findPage по категории, мы получаем все категории которые нам нужно зарендерить, по-этому так как эта страничка посвящена курсам и категория у нас нулевая, по-этому мы везде имеем одинаковую категорию. Мы создадим переменную cosnt firstCateory = 0; и по ней и по ней уже получить тоже самое меню, потому что это ничем не отличается.
// После того как мы получили меню нам остается только его правильно отобразить menu.flatMap - мы используем flatMap иначе если мы используем map то у нас будет массив-массивов, а flatMap опустит его на один уровень ниже и будет обычная строка массивов без вложенных массивов внутри

// return <>{products.length}</> - в function Courses попробуем вывести длину курсов. У нас путь courses/photoshop и по этому адрессу получили 7ку - это длин курсов.
// теперь сгенерим всю статику при проходе по нашим путям. Во-первых, убедимся что продукты есть перед тем как выводить их на страницу (<>{products && products.length}</>)

// npm run build - эта команда сделает Некст билд - это команда сборки, в рамках которой Некст пройдется по страницами и прирендерит их
// он нашел Generating static pages (95/95) 95 страниц, прошелся по каждой, и сгенерил. Мы можемм зайти next --> server --> pages --> courses и здесь будет каждая страница, пригенеренная с ее json. ТЕ он за нас прошелся и уже положил в кеш все необходимое.
// npm start - теперь запустмим Кеш - это запустит его в продакшн режиме, когда он уже будет отдавать сгенеренную статику

//
// Мы создали папку helpers и теперь мы будем здесь ее использовать. Кроме того что мы знаем по какому айдишнику нам загружать страницу, благодаря alias - process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/byAlias/' + params.alias, мы должны знать по какой категории
// const firstCategoryItem = firstLevelMenu.find(m => m.route === params.type), парамс.type - это то что что мы передадим в наши [type] папку с страницами
// if (!firstCategoryItem) { - это будет код если мы его не найдем
//const firstCategory = 0; - мы удалили это потому что она теперь больше не 0, а может быть динамическая
// firstCategory: firstCategoryItem.id - здесь подставляем

// С пропсами закончили. Теперь другая проблема, с точки зрения путей - мы не знаем где мы находимся, по-этому мы должны перебрать все доступные нам пути, и пройтись по ним. Создадим переменую path
// Пройдемся циклом и для каждой меню мы должны сделать запрос по категории
// Если мы получили ответ и все хорошо, то мы удаляем paths: menu.flatMap(m => m.pages.map(p => '/courses/' + p.alias)), и должны сложить пути paths: paths.concat(menu.flatMap(m => m.pages.map(p => '/courses/' + p.alias))); те сконкатинировать пути с этим значением, и вернуть мы должны в целом пути
//p => '/courses/' + p.alias здесь нужно поменять courses на m.route/p.alias и так как у нас идет дубликация m, мы поменяем flatMap айтем на s
//Теперь когда мы будем получать пути, мы сделаем 4 запроса, получим категории всех

//Обернем все запросы в try,catch что бы суметь обработать ошибку

//
// У нас сейчас вся страничка находится здесь <>{products && products.length}</> и это не всегда правильно потому что часто какие-то Компоненты со страницы будут повторяться, либо целиковоый Компонент страницы может повторятся. К примеру если бы мы сделали не динамическую переменую [type], а у нас бы была папочка courses, папочка books, то нам бы пришлось повторять один и тот же Компонент на несколько файлов. Вторая проблема написания компонента <>{products && products.length}</> прям здесь - это стилизация, нам понадобавится добавлять новый модуль с css в стайлс и подключать его сюда. Создадим папку page-components - это компоненты самих страниц, в нем создадим TopPageComponent - это Компонент который будет находится на страничке TopPage, мы переменовали здесь с Course на TopPage наш компонент

// return <TopPageComponent firstCategory={firstCategory} page={page} products={products} />;  и теперь мы перенсом сюда уже Компонент с TopPage

//Что мы сделали ? Мы вынесли вид страницы, которая будет TopPageComponent во внутрь отдельного компонента

//
//Лучше подключать наши метотеги к самой странице а не к комоненту из которого эта страница формируется, по-этому преминим их сюда
//Внутри Хеда мы можем перезаписывать тайтел например, метаинформацию или добавлять новую
//<meta property="og:url" content={page.} />  что бы сформировать url на данную страничку. Из-за того что og:url у нас может определяться в одном месте, мы вынесим его отсюда в наш Компонент App, потому что у нас есть оставшиеся og-теги, они будут расспростроняться на все странички. Во-первых это будет url

//
//обернули все в условие что у нас должны быть страница и продукты {page && products && (
//добавили скрипт в package.json export: next export, это команда берет странички которые у нас биндились в папке next и делает директорию out, которая уже отправляет весь статический контент. Но если мы сейчас это сделаем npm run export то мы увидим ошибку, потому что у нас сейчас есть image optimization и мы не можем пользоваться встроенным имедж оптимизейшен в Некст если мы хотим экспортировать.
//Там где мы использовали Image - меняем на обычный img, таким образом мы теряем преимущетва Некста с оптимизацией
//так же у нас есть парочку fallback, из-за чего при экспорте мы опять получим ошибку, потому что некст ожидает прибавлений image, по-этому меняем fallback на false
//Важно пнимать что экспорт появляется после Билда, потому что она берёт с билженую папку точка нексти оттуда перетаскивает весь статический контент

//После экспорта - появится папка out, которая будет содержать все странички в html и теперь мы можем этот out залить на cdn или на эджинск

//
// .env.production - это будет продакшен Домен
// Пишем npm run build -> и потом что бы сделать продакшен запуск пишем NODE_ENV=production npm start
//Теперь на продакшен билде сайт работает мгновенно, потому что он больше не каждый раз не собирает данные со странички и не перендеривает ее

// Что такое Докер - это система, которая позволяет нам диструбутировать наше приложение путём упаковки их в Контейнеры и за тем запуск контейнеры на класстере или на одной выделенной машине
// Создадим докерфайл в котором опишем что нам нужно сделать с нашим приложением что бы запустить его в докер
// FROM node:14-alpine - мы берем специальный образ из 14 ноды на алпайн Линуксе который очень лекгий
// ADD package.json package.json - так мы устанавливаем зависимости, мы берм пакетч жсон и копируем его в пакетч жсон
// ADD . . - точка - всю папку
// ENV NODE_ENV production - указываем ноде что это продакшен
// RUN npm build - запускаем сборку(билд)
// RUN npn prune --production  уберем(выкеним) дев зависимости которые нам не нужны, то-есть наши Тайпсы. То-есть удаляем зависимости
// CMD ["npm", "start"] команда запуска
// EXPOSE 3000 - какой порт

//
// version: '3' - минимальная версия докера
//
