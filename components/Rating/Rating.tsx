import { RatingProps } from './Rating.props';
import styles from './Rating.module.scss';
import cn from 'classnames';
import StarIcon from './star.svg';
import { useEffect, useState, KeyboardEvent, forwardRef, ForwardedRef, useRef } from 'react';

export const Rating = forwardRef(
	(
		{ isEditable = false, error, rating, setRating, tabIndex, ...props }: RatingProps,
		ref: ForwardedRef<HTMLDivElement>
	): JSX.Element => {
		const [ratingArray, setRatingArray] = useState<JSX.Element[]>(new Array(5).fill(<></>));
		const ratingArrayRef = useRef<(HTMLSpanElement | null)[]>([]);

		useEffect(() => {
			constructRating(rating);
		}, [rating, tabIndex]);

		const computeFocus = (r: number, i: number): number => {
			if (!isEditable) {
				return -1;
			}
			if (!rating && i == 0) {
				return tabIndex ?? 0;
			}
			if (r == i + 1) {
				return tabIndex ?? 0;
			}
			return -1;
		};

		const constructRating = (currentRating: number) => {
			const updatedArray = ratingArray.map((r: JSX.Element, i: number) => {
				return (
					<span
						className={cn(styles.star, {
							[styles.filled]: i < currentRating,
							[styles.editable]: isEditable,
						})}
						onMouseEnter={() => changeDispay(i + 1)}
						onMouseLeave={() => changeDispay(rating)}
						onClick={() => onClick(i + 1)}
						tabIndex={computeFocus(rating, i)}
						onKeyDown={handleKey}
						ref={r => ratingArrayRef.current?.push(r)}
						role={isEditable ? 'slider' : ''}
						aria-invalid={error ? true : false}
						aria-valuenow={rating}
						aria-valuemax={5}
						aria-label={
							isEditable ? 'Укажите рейтинг стрелками вверх или вниз' : 'текущий рейтинг' + rating
						}
						aria-valuemin={1}
					>
						<StarIcon />
					</span>
				);
			});
			setRatingArray(updatedArray);
		};

		const changeDispay = (i: number) => {
			if (!isEditable) {
				return;
			}
			constructRating(i);
		};

		const onClick = (i: number) => {
			if (!isEditable || !setRating) {
				return;
			}
			setRating(i);
		};

		const handleKey = (e: KeyboardEvent) => {
			if (!isEditable || !setRating) {
				return;
			}
			if (e.code == 'ArrowRight' || e.code == 'ArrowUp') {
				if (!rating) {
					setRating(1);
				} else {
					e.preventDefault();
					setRating(rating < 5 ? rating + 1 : 5);
				}
				ratingArrayRef.current[rating]?.focus();
			}
			if (e.code == 'ArrowLeft' || e.code == 'ArrowDown') {
				e.preventDefault();
				setRating(rating > 1 ? rating - 1 : 1);
				ratingArrayRef.current[rating - 2]?.focus();
			}
		};

		return (
			<div
				{...props}
				ref={ref}
				className={cn(styles.ratingWrapper, {
					[styles.error]: error,
				})}
			>
				{ratingArray.map((r, i) => (
					<span key={i}>{r}</span>
				))}
				{error && (
					<span role="alert" className={styles.errorMessage}>
						{error.message}
					</span>
				)}
			</div>
		);
	}
);
// const [raitingArray, setRaitingArray] - этот Стейт будет показывать отдельно то как этот рейтинг выглядит(не фактическое значение, а именно как выглядит)
// useState<JSX.Element[]> - для того что бы отображать звездочки, мы будем фактически отображать некоторые jsx элементы
// new Array(5).fill(<></>) - такм образом мы заполним наш массив по-дефолту 5 пустыми фрагментами, 5 - это длина, а в fill помещаем то чем будем заполнять
// const constructRaiting = (currentRaiting) => - это будет фция по заполнению рейтинга. Она принимает в себя нынешний рейтинг currentRaiting, и мы здесь не используем переданный пропс raiting по той приччине что мы можем конструировать этот рейтинг не только при получение этого рейтинга, а например на hover
// updatedArray - массив который будем передавать в стейт нашего raitingArray

/* Мы в обновленном images.d.ts пишем следующий declare
declare module '*.svg' {
	const content: React.FunctionComponent<React.SVGAttributes<SVGAElement>>;
	export default content;
} 
   Дело в том что раньше у нас content был any , и если бы мы пыталсь нашму Компонента StarIcon с svg присвоить класс, мы бы увидели что у него нет className, и эта проблема как раз из-за content:any. Так как это Компонен мы пишем React.FunctionComponent, так как это svg то у нас есть аттрибуты внутри Реакта React.SVGAttributes а дальше указываем элемент*/

// cn(styles.star - стайлсСтар - это будет дефолтный стиль, а все что после {} это уже динамические опциональные классы.
// [styles.fill]: - здесь мы передает информацию что эта звездочка залита, если индекс этого массива меньше чем текущий рейтинг i < currentRaiting, потому что текущий рейтинг который мы передаем  как аргумент в фцию constructRaiting = (currentRaiting: number), он варируется от 1 до 5, i как индексный номер массива варируется от 0 до 4, по-этому условие строго меньше
// setRaitingArray(updatedArray); - обновляем setRatingArray нашим новосконстрированным обновленым массивом

// {raitingArray.map((r, i) => (r))} - во время return нашего Компонента, если мы будем делать return только r мы в консоли увидим ошибку, о том что у updatedArray нет ключей которые бы обозначали ключи элементом списка, те нужно добавить ключи что бы реакт следил какие элементы изменились(обновились) что бы умного рендерить
// {raitingArray.map((r, i) => (<span key={i}>{r}</span>))} - мы используем ключ в качестве индекса, вообще - это плохая практика, потому что индекс не совсем корректно отоброжает реальный ключ какого-то Объекта, если что-то будет менятся то индекс остается на месте, а сам объект может изменится. Но у нас впринципе список не как меняться не будет, а только перестраиваться(сами элементы удалятся или менятся не будут)

// Перед тем как мы посмотрим как наш Объект отображается, нам нужно вызвать этот constructRaiting в useEffect
// }, [raiting]) - мы подписываем на рейтинг что бы следить и рендерится только при его изменение

// У нас ЕСЛинт подсвечивает зависимость [raiting] как React Hook useEffect has a missing dependency: 'constructRaiting'. Either include it or remove the dependency array.eslintreact-hooks/exhaustive-deps. Эта ошибка говорит что мы не совсем корректно передали все зависимости, он говорит что мы использовали здесь кроме raiting еще и фцию constructRaiting. По-этому правильно было бы передать эту фцию constructRaiting во внутрь useEffect, и добавить зависимости от raitingArray(те [raiting, raitingArray]) и ошибка бы ушла, но мы наш constructRaiting будем использовать не только здесь но и на hover, по-этому мы заигноириурем это правило exhaustive-deps

// onMouseEnter - когда мы наводим на наши звездочки - они должны менять отоброжение
// changeDisplay(i + 1) - потому что элементы начинаются с 0
// onMouseLeave={() => changeDisplay(raiting)} - когда мыш ушла от изображение мы возвращаем исходный рейтинг который был
// onClick()  - при клике мы должны изменить не отображение, а сам рейтинг, по-этому мы передаем в фцию onClick нашу созданную фцию, которая то же что и changeDisplay, только в конце вместо того что бы отображать рейтинг constructRaiting, она его устанавливает. Но у нас setRaiting может быть udnefined , по-этому если так получилось что мы его задали editable но не передали не какую фцию которая должны бы тригирится при изменение рейтинга то мы тоже должны ничего не делать, по-этому если у нас нет !setRaiting мы тоже должны ничего не делать

// tabIndex={isEditable ? 0 : -1}//когда мы будем табить по страничке, мы будем табать по нашему рейтингу. isEditable ? 0 если эдитебел то 0, те мы воспользуемся дефолтным 0 индексом что бы он выстраивался друг за другом, а если нет то -1 и это значит он будет вне таба
// при нажатие на пробел - будет устанавливаться рейтинг. KeyboardEvent - это именно реактовское событие
// handleSpace - эта фция должно все игнорировать кроме пробела
// || !setRaiting - это проверка на есть ли у нас setRaiting
// Мы помещаем наш Star в span потому что у нас из-за внутренних марджинов внутри ели ели курсор мыши выходит из-за svg и курсор-поинтер пропадает, при этом самое интересное что мы должны именно оставить табИндекс и онКейДаун, потому что мы будем таботца именно по звездочкам, но клики и все эти события - должны перенсти на спан. Так же в scss мы filled и star добавили приставку svg, что бы у нас был плавный переход по звездочкам именно

//
// У нас сейчас табИндекс подставляется взависимости от tabIndex={isEditable ? 0 : -1}, хотя нужно подставлять взависимости от того на каком элементе мы сейчас находимся

//if (!rating) setRating(1) - если мы уже на 5 звездочке и нажмем вправо то оно перекинется на 1 звездочку

// tabIndex={isEditable ? 0 : -1} onKeyDown={handleKey} перенесем эти два события с СВГ на span что бы решить проблему с фокусом(у нас фокус спадает с звездочки)
//Теперь нам нужно решить проблему с управлением фокуса, нам нужно теперь в useRef хранить не один элемент, а массив элементов, благодаря этому массиву элементов мы сможем по нему ходить и делать фокус на нужном элементе - создадим ratingArrayRef
// <(HTMLSpanElement | null) []> - такая запись означает что это может быть либо массив спанов либо null(потому что они могут быть налами)
// В спане ref={r => } - где r и есть наш ref
// ref={r => ratingArrayRef.current?.push(r)} - в данном случае мы взяли референс этого элемента - то-есть наш r и запушили в наш массив ratingArrayRef, теперь здесь содержится массив референсов на все наши спаны, благодаря этому мы сможем немного поработать с фокусом, нам нужно когда мы увеличиваем элемент - нам нужно перемещать фокус на тот элемент, на котором сейчас находимся
// const computeFocus = (r: number, i: number): number - принимает ТЕКУЩИЙ рейтинг и индекс элемента, а возвращает число в виде ИНДЕКСА элемента
// tabIndex={isEditable ? 0 : -1} заменяем с этого на tabIndex={computeFocus(rating, i)}
// if (!rating && i == 0) - если нет рейтинга и индекс текущего элемента 0
// if (r == i+1) - если есть текущий рейтинг и он равен индекс+1(потому что индекс начинается с 0), те мы находимся на индексе того же элемента чему сейчас равен рейтинг

// теперь нам необходимо еще смещать фокус на тот элемент который имеет возможность табаться, для этого у нас есть рефы - наши элементы в массиве
// ratingArrayRef.current[rating]?.focus() так мы сможем сфокусировать этот элемент
// ratingArrayRef.current[rating - 2]?.focus() - -2 потому что он еще не будет применен когда мы будем вычитать

// return tabIndex ?? 0; - возвращаем ЛИБО ТАБИНДЕКС ЛИБО 0, это  tabIndex который мы передали в качестве пропсов из ReviewForm, так мы говорим что если есть тамИндекс то использовать его, тем самым если мы передадим  tabIndex - 1, то во всех 4 случаях в фции computeFocus мы получим -1, это означает что не один из элементов Спанов, который будет формироваться  в рамках формирования нашего рейтинга не будет иметь возможность зафокуситься

//Добавим в useEffect зависмость [rating, tabIndex], потому что если мы открыли потом закрыли модалку, то у нас рейтинг больше не попадает в табИндекс, но если мы выберем какой-то рейтинг то он снова у нас будет в индексе. Почему ? Если мы посмотрим как происходит конструкция нашего рейтинга, то она сейчас происходит только после изменения рейтинга, а если поменялся табИндекс то она не происходит. После того как мы добавили зависимость от tabIndex, то после смены табиндекса будет переструктурироваться наш рейтинг и в рамках переструктурироания нашего рейтинга будут пересчитываться фокусы - это означает что после открытия мы снова сможем зафокусится

//
// У нас когда мы сейчас открываем форму и наведение по табу на оценку - появляется проблема, а именно то что скринридер не как не озвучивает что это нужно выставить оценку и что это звездочки по выставлению оценки. Антон хочет назначить роль этому рейтинг как Слайдер потому что там тоже можно двигать влево вправо
/*
role={isEditable ? 'slider' : '' }
aria-valuenow={rating}
aria-valuemax={5}
aria-valuemin={1} 
Это все мы прописали что бы если рейтинги изменяемый то он был как слайдер для скрин ридера, если нет то пустая строка
вельюНоу говорит какой сейчас рейтинг, макс и мин соотвественно максимум и минимум*/

//  Добавим в наш Ratin <span role='alert' нашему еррор инпуту Алерт, что бы когда форма не отправлялась то пользователю говорилось за приччину ошибки
