import { ProductProps } from './Product.props';
import styles from './Product.module.scss';
import cn from 'classnames';
import { Card } from '../Card/Card';
import { Rating } from '../Rating/Rating';
import { Tag } from '../Tag/Tag';
import { Button } from '../Button/Button';
import { declOfNum, priceRu } from '../../helpers/helpers';
import { Divider } from '../Divider/Divider';
import Image from 'next/image';
import { ForwardedRef, forwardRef, useRef, useState } from 'react';
import { Review } from '../Review/Review';
import { ReviewForm } from '../ReviewForm/ReviewForm';
import { motion } from 'framer-motion';

export const Product = motion(
	forwardRef(({ product, className, ...props }: ProductProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
		const [isReviewOpened, setIsReviewOpened] = useState<boolean>(false);
		const reviewRef = useRef<HTMLDivElement>(null);

		const variants = {
			visible: { opacity: 1, height: 'auto' },
			hidden: { opacity: 0, height: 0 },
		};

		const scrollToReview = () => {
			setIsReviewOpened(true);
			reviewRef.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
			reviewRef.current?.focus();
		};

		return (
			<div className={className} {...props} ref={ref}>
				<Card className={styles.product}>
					<div className={styles.logo}>
						<img
							src={process.env.NEXT_PUBLIC_DOMAIN + product.image}
							alt={product.title}
							width={70}
							height={70}
						/>
					</div>
					<div className={styles.title}>{product.title}</div>
					<div className={styles.price}>
						<span>
							<span className="visualyHidden">цена</span>
							{priceRu(product.price)}
						</span>
						{product.oldPrice && (
							<Tag className={styles.oldPrice} color="green">
								<span className="visualyHidden">скидка</span>
								{priceRu(product.price - product.oldPrice)}
							</Tag>
						)}
					</div>
					<div className={styles.credit}>
						<span className="visualyHidden">кредит</span>
						{priceRu(product.credit)}/<span className={styles.month}>мес</span>
					</div>
					<div className={styles.rating}>
						<span className="visualyHidden">
							{'рейтинг' + (product.reviewAvg ?? product.initialRating)}
						</span>
						<Rating rating={product.reviewAvg ?? product.initialRating} />
					</div>
					<div className={styles.tags}>
						{product.categories.map(c => (
							<Tag key={c} className={styles.category} color="ghost">
								{c}
							</Tag>
						))}
					</div>
					<div className={styles.priceTitle} aria-hidden={true}>
						цена
					</div>
					<div className={styles.creditTitle} aria-hidden={true}>
						кредит
					</div>
					<div className={styles.rateTitle}>
						<a href="#ref" onClick={scrollToReview}>
							{product.reviewCount} {declOfNum(product.reviewCount, ['отзыв', 'отзыва', 'отзывов'])}
						</a>
					</div>
					<Divider className={styles.hr} />
					<div className={styles.description}>{product.description}</div>
					<div className={styles.feature}>
						{product.characteristics.map(c => (
							<div className={styles.characteristics} key={c.name}>
								<span className={styles.characteristicsName}>{c.name}</span>
								<span className={styles.characteristicsDots}></span>
								<span className={styles.characteristicsValue}>{c.value}</span>
							</div>
						))}
					</div>
					<div className={styles.advBlock}>
						{product.advantages && (
							<div className={styles.advantages}>
								<div className={styles.advTitle}>Преимущества</div>
								<div>{product.advantages}</div>
							</div>
						)}
						{product.disadvantages && (
							<div className={styles.disadvantages}>
								<div className={styles.advTitle}>Недостатки</div>
								<div>{product.disadvantages}</div>
							</div>
						)}
					</div>
					<Divider className={cn(styles.hr, styles.hr2)} />
					<div className={styles.actions}>
						<Button appearance="primary">Узнать подробнее</Button>
						<Button
							appearance="ghost"
							arrow={isReviewOpened ? 'down' : 'right'}
							className={styles.reviewButton}
							onClick={() => setIsReviewOpened(!isReviewOpened)}
							aria-expanded={isReviewOpened}
						>
							Читать отзывы
						</Button>
					</div>
				</Card>
				<motion.div animate={isReviewOpened ? 'visible' : 'hidden'} variants={variants} initial="hidden">
					<Card color="blue" className={styles.reviews} ref={reviewRef} tabIndex={isReviewOpened ? 0 : -1}>
						{product.reviews.map(r => (
							<div key={r._id}>
								<Review review={r} />
								<Divider />
							</div>
						))}
						<ReviewForm productId={product._id} isOpened={isReviewOpened} />
					</Card>
				</motion.div>
			</div>
		);
	})
);

// <Review key={r._id} review={r} /> мы не можем просто повесит key на Review, потому что из-за того что у нас добавился Devider и мы должны были обернуть все в Фрагмент у нас key навешан не на верхне-уровневый Компонент ! А так нельзя, по-этому вместо фрагмента сделаем div и на него уже навешаем key

//
// Что бы проскролить мы возьмем наш реф который будет наполнен референсам на див, взять от него current и сделать scrollIntoView reviewRef.current.
// scrollIntoView - принимает два параметра: как скролить, до чего скролить
// behavior: 'smooth' - значит что скролл будет плавный(можно поставить ауто)
// block: 'start' - до какого момнте скролить

// Но прямо сейчас если мы запустим, то ничего работать не будет. Почему? Потому что с рефом нужно обращаться аккуратно, тимболее в Фциональных Компонентах, так как карточка у нас функциональный Компонент, этот реф никуда не пробрасывается. Если мы откроем Компонент Card то мы увидим что он не обёрнут в forwardRef, по-этому референсе не работает !

//
// У нас в TopPageComponent вот здесь происходит получние продукта <div>{sortedProducts && sortedProducts.map(p => <Product key={p._id} product={p} />)}</div> а именно вот это <Product key={p._id} product={p} />, мы могли бы его обернуть в motion.div, но это плохая практика так как мы увеличиваем нагрузку на ДОМдерево, по-этому мы лучше сделаем из нашего обычного Компонента Product motion Компонент
// мы так же импортируем motion, НО УЖЕ ИСПОЛЬЗУЕМ КАК ФЦИЮ И ОБОРАЧИВАЕМ НАШ Product
//Здесь возникает та же проблема что и с Рефами, motion тоже трубет некоторый Референс на элемент, по-этому так как это фциональный Компонент мы не просто оборачиваем его в motion а и предоставляем конкретный ref

// Теперь нам нужно при перестроение нашей сортировки визуально сортировать Продукты, мы это можем достичь очень просто благодаря layout анимации, по-этому нашему Продукту в TopPageComponent <Product layout key={p._id} product={p} /> просто указываем layout - это означает что после изменения layout - он будет анимировать это изменение, а это значит что когда мы перейдет по цене или по рейтинг то все визуально отсортирутся, оно не просто перестроилось, а визуально переезжает, и это достигается благодаря одному просто свойсвту layout, потому что motion видит какие у нас происходит изменение изначального состояние до конечного и анимирует все эти изменения

//
/* Нам нужно создать анимацию после нажатия на Читать Отзывы что бы выпадалась окно с комментариями
//Мы скрываем все что вылазит
.closed {
	overflow: hidden;
	max-height: 0;
	padding: 0;
	//мы задаем так а не через display: none, потому что мы потом не сможем модалку нормально анимировать
}
.opened {
	max-height: auto;
	padding: 30px;
} 
Мы удаляем с css то что выше по той приччине что у нас сейчас opend и closed завязанные на isReviewOpened
[styles.opened]: isReviewOpened,
[styles.closed]: !isReviewOpened,

Создадим класс reviews потому что в этом классе мы должны задать нужные нам свойства

Теперь важно понимать что мы вешаем motion не на саму Card, а создаем отдельный div, туда motion и оборачиваем весь Card, потому что если мы анимацию завяжем под card то у нас из-за паддингов будут скочки 

<motion.div animate={isReviewOpened ? 'visible' : 'hidden'} variants={variants} initial="hidden">
*/

// У нас сейчас Иконка Up, Крестики, Логотип и Бургер захардкожены. Сделаем отдельный Компонент, куда вынесим все эти иконки. Мы будем динамически ее стилизирвоать и самое главное подставлять взависимости от строкового параметра, который мы будем туда передавать

//
//Сейчас если мы будем табами находитсяя на отзыве и потом нажмем ентер,то нас перекинет и проскролит чуть ниже и мы окажется на Узнать Подробнее - это происходит потому что мы не перекидываем фокус на Объект формы. Добавим <Card color="blue" className={styles.reviews} ref={reviewRef} tabIndex={0}> нашему табИндексу
// так же добавим фции scrollToReview вот это reviewRef.current?.focus();

//У нас сейчас такая же проблема что мы начинаем табаться по отзывам или форме даже если она закрыла, по-этому - tabIndex={isReviewOpened ? 0 : -1}
// так же передадим isOpened пропс в ReviewForm.props и говорим что уже не <ReviewForm productId={product._id} /> а <ReviewForm productId={product._id} isOpened={isReviewOpened}/>
// после того как мы прокинули этот пропс вниз на reviewForm мы можем поработать в этом компоненте

//
// <span><span className='visualyHidden'>цена</span>{priceRu(product.price)}</span> - таким образом скрин ридер будет говорить слово цена и потом цифры, но наш спан которомы мы добавили класс visualyHidden не как не видно най сайте и верстку он не ломает
// <div className={styles.priceTitle} aria-hidden={true}>цена</div> а это цене мы скрыли озвучку

//
// повесим aria-expended={isReviewOpened} на читать отзывы, что бы скрин ридер говорил что кнопка свернута или разеврнута, что бы клиент понимал в каком кнопка сейчас положение
