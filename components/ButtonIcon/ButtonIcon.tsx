import styles from './ButtonIcon.module.scss';
import { ButtonIconProps, icons } from './ButtonIcon.props';
import cn from 'classnames';

export const ButtonIcon = ({ appearance, icon, className, ...props }: ButtonIconProps): JSX.Element => {
	const IconComp = icons[icon]; //мы берем наш Объект иконок с Пропсов и берем оттуда нужный up, close или menu
	return (
		<button
			className={cn(styles.button, className, {
				[styles.primary]: appearance == 'primary',
				[styles.white]: appearance == 'white',
			})}
			{...props}
		>
			<IconComp />
		</button>
	);
};
