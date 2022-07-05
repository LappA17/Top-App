import { LayoutProps } from './Layout.props';
import styles from './Layout.module.scss';
import cn from 'classnames';
import { Header } from './Header/Header';
import React, { FunctionComponent, useState, KeyboardEvent, useRef } from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { Footer } from './Footer/Footer';
import { AppContextProvider, IAppContext } from '../context/app.context';
import { Up } from '../components';

const Layout = ({ children }: LayoutProps): JSX.Element => {
	const [isSkipLinkDisplayed, setIsSkipLinkDisplayed] = useState<boolean>(false);
	const bodyRef = useRef<HTMLDivElement>(null);

	const skipContentAction = (key: KeyboardEvent) => {
		if (key.code === 'Space' || key.code === 'Enter') {
			key.preventDefault();
			bodyRef.current?.focus();
		}
		//Если не нажали то мы переходим к след элементу и снимаем наш фокус и элемент должен исчезнуть
		setIsSkipLinkDisplayed(false);
	};

	return (
		<div className={styles.wrapper}>
			<a
				onFocus={() => setIsSkipLinkDisplayed(true)}
				tabIndex={1}
				className={cn(styles.skipLink, {
					[styles.displayed]: isSkipLinkDisplayed,
				})}
				onKeyDown={skipContentAction}
			>
				Сразу к содержанию
			</a>
			<Header className={styles.header} />
			<Sidebar className={styles.sidebar} />
			<main className={styles.body} ref={bodyRef} tabIndex={0} role="main">
				{children}
			</main>
			<Footer className={styles.footer} />
			<Up />
		</div>
	);
};

export const withLayout = <T extends Record<string, unknown> & IAppContext>(Component: FunctionComponent<T>) => {
	return function withLayoutComponent(props: T): JSX.Element {
		return (
			<AppContextProvider menu={props.menu} firstCategory={props.firstCategory}>
				<Layout>
					<Component {...props} />
				</Layout>
			</AppContextProvider>
		);
	};
};
// withLayout - это наш компонент вышего порядка, который принимает на вход компонент и возвращает тоже компонент. Наш withLayout возвращает функция, а как мы помним Компонент и есть фунция. У нас НОС лежит здесь вместо с Layout потому что мы с ним неразрывно связанны , но желательно НОС выносить в отдельные файлы, кроме того мы можем убрать экспорт Layout а использовать его только в НОС

//Мы наш Layout сделаем div потому что вверху будет использовать в качестве wrapper - это и будет наш корневой див

//У нас верстка может разъежатся в зависимости от длины монитора пользователя, по-этому контент должен подстраиваться под маштаб экрана, по-этому колонки у нас будет не две как мы бы предпологали(одна для сайдбар другая по больше для бади), а колонки будет 4. Это колонка которая будет СЛЕВА от Сайдбара, сам Сайдбар, центральная(контентная колонка) и самая правая колонка которая нам позволяет разежаться. По-этому для первой колонки задаем авто, для сайдбара на глаз 230px и самое интересное начинается с контентной колонкой, потому что мы не можем задать ей фиксированую колонку, но мы можем воспользоваться css фцией minmax которой мы можем задать что мы получаем от и до, а последнюю колонку тоже auto
// Что бы grid-template-areas заработал - нужно сделать привязку к grid-areas всех тех header, сайдбар, бади и футеров что мы задали

//Мы сделали слева и справа колонки авто что бы когда мы расстягиваем на весь экран они появлялись, а когда экран будет чуть меньше то они схлопываются ведь наш сайдбар и body имееют фиксированую ширину

//Так же footer при небольшом контенте всегда должен быть прибит к низу, для этого создадим минимальную высоту  min-height:100vh нашего контейнера, то-есть 100 визуальных частей нашего браузера

// grid-template-rows. Нам важно что бы контент максимально все расстягивал, те остальный footer и header могут занимать столько места сколько у них контент, а центральная должна максимально отталкивать от себя и хедер и футер. auto 1fr auto где auto нам позвоялет задать ему место столько сколько ему позволино его контентом и другими элементами.

// header нет на разрешение десктопа, мы делаем display: none; но при этом она как грид-кологка не пропадает !
//на адаптиве мы скрываем сайдбар и показываем хеддер
// нашему wrapper в адаптиве сделаем grid-template-columns: minmax(320p, 1fr), что бы когда ширина никогда не была меньше 320, и на всю страницу

//
// В AppContextProvider нужно задать дефолтное значение - это важно потому что когда мы будем передавать, потому что когда мы будем передавать наше изначально значение во время SSR мы хотим что бы в контекст были переданы эти стартовые значения. По-этому мы передаем menu и firstCategory. Мы их возьмем из Layout потому что наш лейаут принимает любой объект Record<string, unknown>.
// Дотипизиурем наш Layout, мы скажем что по-умолчанию мы всегда хотим что бы на любой странице было меню и первая категория Record<string, unknown> & IAppContext> - тем самым мы передаем соотвествующий контекст в рамках инициализации.
//И теперь у нас в этом Компоненте Component: FunctionComponent<T> в его пропсах доступна props.menu и props.firstCtegory

//Теперь используем хук useContext который мы передали через context.provider в наше меню. Создадим пока что наше меню внутри sidebar. Создадим Menu в корни для того что бы мы могли ссылаться из обоих Компонентов

//
// <a>Сразу к содержанию</a> создадим этот элемент что бы когда мы сразу заходим на страничку после первого нажатия на таб попадали не на search а сразу на него. Что бы это реализовать зададим ей табИндекс больше 0(это один из крайне редких случаев)
// что бы менять наш скиплинк мы это будем делать тогда когда мы фокусимся, по-этому обработаем событие онФокус

// Что бы в skipContentAction там где у нас if ентер или спейс, нам нужнно после клика перейти к контенту, но перед тем как перейти нам нужно для начала зафокусить какой-то блок внутри контента, но мы не знаем какой это блок, потому что children - <div className={styles.body}>{children}</div> может быть разный, единственное что мы можем здесь зафокусировать - это сам body, по-этому мы создадим Референс на наш body
//потом обратимся к фокусу нашего Рефа + добавим табИндекс на боди
// Сделаем body outline: none потому что аутлайн всему нашему контенту не нужен потому что после этого мы пойдем уже по конкретным элементам и сам этот элемент уже не нужен. Это единсивенный случай когда нам нужно задать аутлайн нан

//
//<main className={styles.body} ref={bodyRef} tabIndex={0}> сделали main вместо дива для лучшей работы скринридера
