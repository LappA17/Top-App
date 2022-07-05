import { PProps } from './P.props';
import styles from './P.module.scss';
import cn from 'classnames';

export const P = ({ size = 'm', children, className, ...props }: PProps): JSX.Element => {
	return (
		<p
			className={cn(styles.p, className, {
				[styles.s]: size == 's',
				[styles.m]: size == 'm',
				[styles.l]: size == 'l',
			})}
			{...props}
		>
			{children}
		</p>
	);
};

//cn(styles.p, className, - эта запись значит что наш классНейм будет формироваться из самих стилей П из класснейма
