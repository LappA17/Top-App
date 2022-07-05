import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import React from 'react';
import axios from 'axios';
import { MenuItem } from '../../interfaces/menu.interface';
import { withLayout } from '../../layout/Layout';
import { firstLevelMenu } from '../../helpers/helpers';
import { ParsedUrlQuery } from 'node:querystring';
import { API } from '../../helpers/api';

function Type({ firstCategory }: TypeProps): JSX.Element {
	return <>Type: {firstCategory}</>;
}

export default withLayout(Type);
//Здесь мы просто перебираем текущие, заданые нам Тайпы
export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: firstLevelMenu.map(m => '/' + m.route),
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<TypeProps> = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
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
	const { data: menu } = await axios.post<MenuItem[]>(API.topPage.find, {
		firstCategory: firstCategoryItem.id,
	});
	return {
		props: {
			menu,
			firstCategory: firstCategoryItem.id,
		},
	};
};

interface TypeProps extends Record<string, unknown> {
	menu: MenuItem[];
	firstCategory: number;
}

// Создадим этот файл что бы мы могли переходить в корневые категории, то-есть например /courses

//Нам здесь нужно обработать пути в getStaticPaths, так как мы сказали что страничка Тайп, но пути никак не обработали

// Добавим {params,}: GetStaticPropsContext<ParsedUrlQuery> в getStaticProps, те у нас будет доступен парамс и 	const firstCategory = 0; у нас уже не 0

// return <>Type: {firstCategory}</> - таким образом нам показывает в какой мы категори, в данном случае 0

//Если мы сейчас напишем  npm run build то до этого у нас было 27 старниц, а теперь будет 33 ! То-есть 4(курсы, сервис и тд) и 1 search
// В /[type] у нас /courses /services /books /products
// В /[type]/[alias] уже /courses/financial-analystics, /courses/photoshop и так далее
