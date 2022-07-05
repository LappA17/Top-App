import { Advantages, Htag, Product, Sort, Tag } from '../../components';
import { TopPageComponentProps } from './TopPageComponent.props';
import styles from './TopPageComponent.module.scss';
import { HhData } from '../../components';
import { TopLevelCategory } from '../../interfaces/page.interface';
import { SortEnum } from '../../components/Sort/Sort.props';
import { useEffect, useReducer } from 'react';
import { sortReducer } from './sort.reducer';
import { useScrollY } from '../../hooks/useScrollY';
import { useReducedMotion } from 'framer-motion';

export const TopPageComponent = ({ page, products, firstCategory }: TopPageComponentProps): JSX.Element => {
	const [{ products: sortedProducts, sort }, dispatchSort] = useReducer(sortReducer, {
		products,
		sort: SortEnum.Rating,
	});

	const shouldReduceMotion = useReducedMotion(); //есть люди которые тяжело реагируют на анимацию

	const setSort = (sort: SortEnum) => {
		dispatchSort({ type: sort });
	};

	useEffect(() => {
		dispatchSort({ type: 'reset', initialState: products });
	}, [products]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.title}>
				<Htag tag="h1">{page.title}</Htag>
				{products && (
					<Tag color="grey" size="m" aria-label={products.length + 'Элементов'}>
						{products.length}
					</Tag>
				)}
				<Sort sort={sort} setSort={setSort} />
			</div>
			<div role="list">
				{sortedProducts &&
					sortedProducts.map(p => (
						<Product role="listitem" layout={shouldReduceMotion ? false : true} key={p._id} product={p} />
					))}
			</div>
			<div className={styles.hhTitle}>
				<Htag tag="h2">Вакансии - {page.category}</Htag>
				<Tag color="red" size="m">
					hh.ru
				</Tag>
			</div>
			{firstCategory == TopLevelCategory.Courses && page.hh && <HhData {...page.hh} />}
			{page.advantages && page.advantages.length > 0 && (
				<>
					<Htag tag="h2">Преимущства</Htag>
					<Advantages advantages={page.advantages} />
				</>
			)}
			{page.seoText && <div className={styles.seo} dangerouslySetInnerHTML={{ __html: page.seoText }} />}
			<Htag tag="h2">Получаемые навыки</Htag>
			{page.tags.map(t => (
				<Tag key={t} color="primary">
					{t}
				</Tag>
			))}
		</div>
	);
};

//.title{margin-top: 40px;} - мы задали отступ от Тайтла а не от всего Компонента, по-этому создадим еще один див wrapper в который обернем всю страничку и уже ему а не title зададим отступы сверху, что бы title не был тем кто раздвигает

//
// [{products: sortedProducts}, dispatchSort] - 1) что изименяем(мы диструктуризировали продукты) 2) название функции изменения
// useReducer(sortReducer, {products, sort: SortEnum.Rating}) - sortReducer -первое принимает наш Редьюсер, {products - это начальное значение,начальное значение мы берем из Пропсов, по-этому можем написать {products} и нашу сортировку sort - она по умолчанию будет по рейтингу

// теперь мы можем использовать. поменяем здесь с <div>{products && products.map(p => <div key={p._id}>{p.title}</div>)}</div> на <div>{sortedProducts && sortedProducts.map(p => <div key={p._id}>{p.title}</div>)}</div>, те у нас меняются продукты не только прилитев с пропсов, а и те что у нас сейчас находятся в стейте нашего reducer

// создадим функцию сортировки setSort = () =>
//И так что мы сделали, мы продукты запихнули теперь в стейт и у нас отображение происходит по стейту <div>{sortedProducts && sortedProducts.map(p => <div key={p._id}>{p.title}</div>)}</div> и в случае когда у нас из сортировки происходит сортировка setSort события, мы меняем наш стейт путём диспатча этой сортировки
// и теперь нам сюда нужно передать не просто СортРейтинг <Sort sort={SortEnum.Rating} setSort={setSort} />, а сорт который у нас есть в стейте
// по этому вытаскиевам от сюда sort const [{ products: sortedProducts, sort }, dispatchSort] и передаем вместо SortEnum.Rating

//
// Когда мы переходим по странички допустим Аналитики, то у нас загружается страница аналитика но визуальная часть не меняется и остается та же(то-есть продукты не меняются), но когда обновляем страницу то все нормально и продукты меняются на корректные. Когда мы обновляем страницу - мы воспользовались статическим кешом который у нас сгенерил Некст, именно по-этому здесь все корректно, а когда мы двигаемся от страницы к странице - мы используем клиентский роутинг, в рамках этого клиентского роутинга наш Некст работает как обычное Реакт приложение, по-этому если мы посмотрим здесь на useReducer, то мы всегда используем начальное значение продуктов которое было переданно  useReducer(sortReducer, {  .По-этому у нас поменялась страничку, но начальны продукты у нас никак не переделались, потому что useReducer уже работает, по-этому нам нужно сделать подписку на изменения этих продуктов, то-есть если поменялись продукты, то мы должны поменять и стейт, сейчас этого не происходит потому что один раз был инишиалСтейт в рамках продукта, то-есть мы после того как получили один раз продукты, у нас initialState уже никак не будет рабоать
// В нашем sort.reducer создаём { type: 'reset', initialState: ProductModel[] } тем самым мы говорим что мы создаем новый Екшен + меняет стейт на новый
// В этом reset мы создаём начальную сортировку(пусть будет по рейтингу), а после этого продукты и продукты мы возьмём из нового стейта
// У нас products: action.initialState, этот инишиалСтейт доступен только если type: reset, благодаря этому когда мы делаем свитч то ТайпСкрипт знает что так как у нас кейс - ресет, то у нас будет доступен этот initialState

// функцию мы поменяли, теперь поменяем компонент. Создадим useEffect и добавим массив зависимостей продукты что бы он реагировал на изменения продуктов. Теперь когда наш TopPageComponent получает новые продукты, наш useEffect это понимает и диспатчит обновление Рессета начального стейта

//
//aria-label={products.length + 'Элементов'} - обрати внимание что мы можем ариа лейбел задавать динамически

//
// <div role='list'>{sortedProducts && sortedProducts.map(p => <Product role='listitem' layout key={p._id} product={p} />)}</div> мы добавили диву роль листа(это тоже самое что мы в меню сделали ul) а Product сделали listitem -> тоже самое что li, и вот этими двумя небольшими навешаными ролями на див -> мы меняем поведение войсОвера
