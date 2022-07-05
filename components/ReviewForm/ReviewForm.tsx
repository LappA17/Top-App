import { ReviewFormProps } from './ReviewForm.props';
import styles from './ReviewForm.module.scss';
import CloseIcon from './close.svg';
import cn from 'classnames';
import { Input } from '../Input/Input';
import { Rating } from '../Rating/Rating';
import { Textarea } from '../Textarea/Textarea';
import { Button } from '../Button/Button';
import { useForm, Controller } from 'react-hook-form';
import { IReviewForm, IReviewSentResponse } from './ReviewForm.interface';
import axios from 'axios';
import { API } from '../../helpers/api';
import { useState } from 'react';

export const ReviewForm = ({ productId, isOpened, className, ...props }: ReviewFormProps): JSX.Element => {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
		reset,
		clearErrors,
	} = useForm<IReviewForm>();
	const [isSuccess, setIsSuccess] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const onSubmit = async (formData: IReviewForm) => {
		try {
			const { data } = await axios.post<IReviewSentResponse>(API.review.createDemo, { ...formData, productId });
			if (data.message) {
				setIsSuccess(true);
				reset();
			} else {
				setError('Что-то пошло не так');
			}
		} catch (e) {
			if (e instanceof Error) {
				setError(e.message);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className={cn(styles.reviewForm, className)} {...props}>
				<Input
					{...register('name', { required: { value: true, message: 'Заполните имя' } })}
					placeholder="Имя"
					error={errors.name}
					tabIndex={isOpened ? 0 : -1}
					aria-invalid={errors.name ? true : false}
				/>
				<Input
					{...register('title', { required: { value: true, message: 'Заполните заголовок' } })}
					placeholder="Заголовок отзыва"
					className={styles.title}
					error={errors.title}
					tabIndex={isOpened ? 0 : -1}
					aria-invalid={errors.title ? true : false}
				/>
				<div className={styles.rating}>
					<span>Оценка:</span>
					<Controller
						control={control}
						name="rating"
						rules={{ required: { value: true, message: 'Укажите рейтинг' } }}
						render={({ field }) => (
							<Rating
								isEditable
								rating={field.value}
								ref={field.ref}
								setRating={field.onChange}
								error={errors.rating}
								tabIndex={isOpened ? 0 : -1}
							/>
						)}
					/>
				</div>
				<Textarea
					{...register('description', { required: { value: true, message: 'Заполните описание' } })}
					placeholder="Текст отзыва"
					className={styles.description}
					error={errors.description}
					tabIndex={isOpened ? 0 : -1}
					aria-label="Текст отзыва"
					aria-invalid={errors.description ? true : false}
				/>
				<div className={styles.submit}>
					<Button appearance="primary" tabIndex={isOpened ? 0 : -1} onClick={() => clearErrors()}>
						Отправить
					</Button>
					<span className={styles.info}>
						* Перед публикацией отзыв пройдет предварительную модерацию и проверку
					</span>
				</div>
			</div>
			{isSuccess && (
				<div className={cn(styles.success, styles.panel)} role="alert">
					<div className={styles.successTitle}>Ваш отзыв отправлен</div>
					<div>Спасибо, ваш отзыв будет опубликован после проверки.</div>
					<button
						onClick={() => setIsSuccess(false)}
						className={styles.close}
						aria-label="Закрыть оповещение"
					>
						<CloseIcon />
					</button>
				</div>
			)}
			{error && (
				<div className={cn(styles.error, styles.panel)} role="alert">
					Что-то пошло не так, попробуйте обновить страницу
					<button
						onClick={() => setError(undefined)}
						className={styles.close}
						aria-label="Закрыть оповещение"
					>
						<CloseIcon />
					</button>
				</div>
			)}
		</form>
	);
};
// handleSubmit() - в этот хенделСабмит мы должно передать функцию которая в результате вызовится после Сабмита, где будут распологаться наши данные
// onSubmit={handleSubmit(onSubmit) все параметры формы у data будут здесь за счет того что фцию onSubmit(в которой эта дейта) обернута в handleSubmit

//наш input - неуправляемый компонент, мы должны использовать синтаксис неуправляемого компонента

//<Controller control={control} /> благодаря такой записи мы говорим что вот этот Хук Форм const { register, control, handleSubmit } = useForm<IReviewForm>(); будет им управлять, потому что форм может быть много и хуков которые ими управляют тоже
// в методе render мы должны вернуть этот Компонент
//field - позвоялет управлять состоянием нашего Рейтинга. Помимо филд еще есть два каких-то аргумента но мы их трогать не будем
// <Rating rating={0} /> - переносим в наш Рейтинг во внурть render. Пока что он неуправляемый
//что бы сделать его управялемый нужно передать значение этого рейтинга <Rating rating={field.value} />. У field так же помимо value есть еще парочку опциональностей
//так же говорим что он изменяемый(это мы задали еще в компонента) isEditable, а с помощью setRating мы можем изменять наш стейт и во внутрь передает field.onChange
//Тем самым наш controller - управляет нашим компонентом, соотвественно его хранени его текущего состояния(стейт) будет осуществляться внутри этого рейтинга и им будет управлять этот Контроллер
//  Рейтинг будет записываться после отправки

//
//<Rating ref={field.ref} - так мы пробросили реф в компонент Рейтинга

//
// <Input {...register('name'), {}} - регистер вторым параметром после имя принимает валидацю ошибок
//  { value: true, message: 'Заполните имя'} - велью в тру означает что пол обязательно и месседж ошибки
// ! Что бы нам получить ошибки - мы с useForm получаем state, именно formState и из него достает состояние ошибок
// Что бы обработать правильно ошибку - нужно немного модифицировать наш компонент инпута, а точнее его пропсы и добавить туда error
// error={errors.name} - это ошибка поля имени

//
// rules в Контроллере - это тоже самое что в неконтролированном компоненте required: { value: true, message: 'Заполните имя' }

//
// const { data } = await axios.post() // это будет дата которая диструктуризируется из Респонса axios
// post принимает Дженериком ответ
// post принимает два параметра - URL и данные которые должны передать
// { ...formData, productId } - мы спредим формДату потому что мы ее будем ОБОГОЩАТЬ productId

// const [isSuccess, setIsSuccess] = useState<boolean>(false); - создадим Стейт для контролирование стейта нашей формы, отправлена она или нет, по-дефолту false потому что не отправлена

//Мы задали tabIndex={isOpened ? 0 : -1} инпутам и текстЕреа, но проблема у нас заключается с Рейтингом, мы тоже можем задать ему tabIndex={isOpened ? 0 : -1} потому что у нас рейтинг наследуется от элемента Дива который соотвественно имеет тамИндекс, но этот табиндекс мы никак не использовали -> перейдем в РЕЙТИНГ и вытащим пропс tabIndex

//для нашей кнопки делаем то же самое с tabIndex={isOpened ? 0 : -1} что бы на нее тоже нельзя было кликнуть когда модалка закрыта

//
// У нас при работе с СкринРидера возникает проблема что если мы отправим не заполеную форму то оно просто перекинет на те данные которые не заполнены при этом никаого оповещания в чем проблема не скажет, по-этому добавим aria-invalid а во внутрь помещаем имя ошибки

//Сделаем так что после того как пользователь ввел что-то неправильно в форме или чего-то не вел то наш скрин ридер должен ему об этом сказать + СБРОСИТЬ ДАННЫЕ которые он вел до этого что бы пользователь понял в чем проблема, для этого с нашего useForm возьмем clearErrors - метод который позволяет очитстишь наши ошибки
//В онСабмит его применить не получится потому что онСабмит срабатывает только когда сабмит успешен
// onClick={() => clearErrors()} повесим на кнопку что бы после того как отправели произошла очистка

//
// <div className={cn(styles.success, styles.panel)} role="alert"> добавим роль алерт для оповещения что форма отправлена или ошибка
// создадим для CloseIcon button что бы было оповещение что это кнопка закрытия
