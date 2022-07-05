import { SidebarProps } from './Sidebar.props';
import styles from './Sidebar.module.scss';
import cn from 'classnames';
import { Menu } from '../Menu/Menu';
import Logo from '../logo.svg';
import { Search } from '../../components';

export const Sidebar = ({ className, ...props }: SidebarProps): JSX.Element => {
	return (
		<div className={cn(className, styles.sidebar)} {...props}>
			<Logo className={styles.logo} />
			<Search />
			<Menu />
		</div>
	);
};

//Теперь меню отрисовалось и если мы нажмем код страницы то в прирендеровой версии он тоже будет наше меню!

//Подсумируем работу Контекст: на главной странице в index.tsx мы получили Пропсы -> среди этих изначальных Пропсов в getStaticProps есть menu и firstCategory -> мы их передали в качестве пропрсов в Компонент Home -> наш Home обернут в НОС withLayout - это означает что все пропсы которые мы передаем в этот Компонент будут проходить через Компонент высшего порядка, по-этому эти пропсы попадают у нас вот сюда function withLayoutComponent(props: T) в props: T -> отсюда мы сразу же передаем ее в Контекст в AppContextProvider -> после того как мы передали в стейт эти начальные значения(перейдем в файл app.context) - эти данные у нас помещаются в Стейт useState<MenuItem[]>(menu) и передаются в AppContext.Provider value={{ menu: menuState, firstCategory, setMenu } как сами данные нашего контекста -> после этого мы можем извлечь их путем использование useContext в нашем Menu, где мы из контекста достаем то что нам нужно const { menu, setMenu, firstCategory } = useContext(AppContext)
