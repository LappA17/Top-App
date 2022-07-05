import { HeaderProps } from './Header.props';
import styles from './Header.module.scss';
import Logo from '../logo.svg';
import cn from 'classnames';
import { ButtonIcon } from '../../components/ButtonIcon/ButtonIcon';
import { motion, useReducedMotion } from 'framer-motion';
import { Sidebar } from '../Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const Header = ({ className, ...props }: HeaderProps): JSX.Element => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	const shouldReduceMotion = useReducedMotion();
	const router = useRouter();

	useEffect(() => {
		setIsOpened(false); //как только будет меняться Роутер, мы закрываем Меню
	}, [router]);

	const variants = {
		opened: {
			opacity: 1,
			x: 0,
			transition: {
				stiffness: 20,
			},
		},
		closed: {
			opacity: shouldReduceMotion ? 1 : 0,
			x: '100%',
		},
	};

	return (
		<header className={cn(className, styles.header)} {...props}>
			<Logo />
			<ButtonIcon appearance="white" icon="menu" onClick={() => setIsOpened(true)} />
			<motion.div
				className={styles.mobileMenu}
				variants={variants}
				initial={'closed'}
				animate={isOpened ? 'opened' : 'closed'}
			>
				<Sidebar />
				<ButtonIcon
					className={styles.menuClose}
					appearance="white"
					icon="close"
					onClick={() => setIsOpened(false)}
				/>
			</motion.div>
		</header>
	);
};

// Когда мы уже сделали анимацию меню и оно появляется после нажатие , то-есть мы уже закончили писать motion.div и variants у нас возникла проблема, что после нажатия на финансовую аналитику к примеру - у нас не появлятеся и ничего не открывается, по приччине того что у нас проблемы с Роутингом

//После того как мы создали router нам нужно на него Подписаться и сделаем мы это в Эффекте, и если наш роутер меняется то мы должны скрыть меню после его перехода

//Теперь если мы перейдём из мобильного разрешение в Десктопный, то у нас будет Два меню, потому что display: grid передобивает наш display: none, который задан на layout. У нас сейчас в layout находится .header{display: none}(и на мобилке тоже), мы его перенесем во внутрь Header - это озничает что когда мы в layout -> mobile достигаем этого мобильного разрешение где у нас финально все перестраивается - мы должны в header.module поменять header при мобильном разшерение на display: grid, а в немобильном разрешение иметь display: none !
