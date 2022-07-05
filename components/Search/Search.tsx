import { SearchProps } from './Search.props';
import styles from './Search.module.scss';
import GlassIcon from './glass.svg';
import cn from 'classnames';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/router';

export const Search = ({ className, ...props }: SearchProps): JSX.Element => {
	const [search, setSearch] = useState<string>('');
	const router = useRouter();

	const goToSearch = () => {
		router.push({
			pathname: '/search',
			query: {
				q: search,
			},
		});
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key == 'Enter') {
			goToSearch();
		}
	};

	return (
		<form className={cn(className, styles.search)} {...props} role="search">
			<Input
				className={styles.input}
				placeholder="Поиск..."
				value={search}
				onChange={e => setSearch(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<Button appearance="primary" className={styles.button} onClick={goToSearch} aria-label="Искать по сайту">
				<GlassIcon />
			</Button>
		</form>
	);
};

// В нашем инпуте должно быть какое-то значение, значением мы будет управлять через Стейт, потому что нам нужно иметь понимание что у нас сейчас находится в Поиске
// onChange - если у нас стейт меняется то мы должны в наш стейт записать новое значение

//Мы зададим нашей кнопки className что бы запозиционировать ее, она сейчас лежит вповерх нашего поиска

//Обрати внимание что наш Компонент Инпут ведет себя как обычный инпут который мы уже дополняем в нашем Компоненте Search к тем уже созданным свойствам и стилям которые мы задали в самом Компоненте Инпут - это значит что мы можем задать нашему input уже свои классы className которые нам понадобятся уже в Компоненте Search, то-есть мы этими классами никак не изменяем исходный Компонент Инпута, а просто дополням стилизацию в нужном нам Компоненте, в данном случае Search

// Теперь нам нужно после ввода в search и после нажатие кнопки перейти на страницу search с какими-то параметрами. Создадим фцию goToSearch
// мы сможем перейты с помощью router. В рамках руотера есть методы push(пуш принимает либо объект либо url)
//Мы сказали что на нужно перейти на путь /search и добавить квери параметры со значением который у нас в стейте search

//Добавим обработчик событие клавиатуры onKeyDown и в нее поместим фцию handleKeyDown, что бы только после нажатие на Ентер у нас переходило к поиску, потому что пока что у нас кнопка реагировала и на пробел и на ентер

//Мы с нашего серча который был дивом сделали form потому что так скринлидеру понятней что это за участок сайта
