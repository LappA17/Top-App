import { HtagProps } from './Htag.props';
import styles from './Htag.module.scss'; //Нам с помощью className={styles.h1} будет генерироваться некий уникальный класс, преимущество css-модулей в том что мы можем не мучатся с наимонваниями классов, нам не нужно постоянно думать о названиях стилей, все наши модули которые мы зададим в компоненте - будут строга изоилрованы в компоненте

export const Htag = ({ tag, children }: HtagProps): JSX.Element => {
	switch (tag) {
		case 'h1':
			return <h1 className={styles.h1}>{children}</h1>;
		case 'h2':
			return <h2 className={styles.h2}>{children}</h2>;
		case 'h3':
			return <h3 className={styles.h3}>{children}</h3>;
		default:
			return <></>;
	}
};
