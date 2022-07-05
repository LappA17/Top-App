import { InputProps } from './Input.props';
import styles from './Input.module.scss';
import cn from 'classnames';
import { ForwardedRef, forwardRef } from 'react';

export const Input = forwardRef(
	({ error, className, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
		return (
			<div className={cn(styles.inputWrapper, className)}>
				<input
					className={cn(styles.input, {
						[styles.error]: error, //в случае ошибки добавляет класс, что бы красиво стилизовать ошибку
					})}
					ref={ref}
					{...props}
				/>
				{error && (
					<span role="alert" className={styles.errorMessage}>
						{error.message}
					</span>
				)}
			</div>
		);
	}
);
// У нас forwardRef - оборачиваем всю функцию
// наш аргумент ref - типа ForwardedRef и во внутрь тот элемент на который мы повесим реф, то-есть Инпут, Див и тд
//[styles.error]: error, //в случае ошибки добавляет класс, что бы красиво стилизовать ошибку

//
// Добавим в наш Инпут <span role='alert' нашему еррор инпуту Алерт, что бы когда форма не отправлялась то пользователю говорилось за приччину ошибки
