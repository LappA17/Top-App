import { TextareaProps } from './Textarea.props';
import styles from './Textarea.module.scss';
import cn from 'classnames';
import { ForwardedRef, forwardRef } from 'react';

export const Textarea = forwardRef(
	({ error, className, ...props }: TextareaProps, ref: ForwardedRef<HTMLTextAreaElement>): JSX.Element => {
		return (
			<div className={cn(styles.textareaWrapper, className)}>
				<textarea
					className={cn(styles.textarea, {
						[styles.error]: error,
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

// Добавим в наш ТекстАреа <span role='alert' нашему еррор инпуту Алерт, что бы когда форма не отправлялась то пользователю говорилось за приччину ошибки