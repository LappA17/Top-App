import { SortEnum, SortProps } from './Sort.props';
import styles from './Sort.module.scss';
import SortIcon from './sort.svg';
import cn from 'classnames';

export const Sort = ({ sort, setSort, className, ...props }: SortProps): JSX.Element => {
	return (
		<div className={cn(styles.sort, className)} {...props}>
			<div className={styles.sortName} id="sort">
				Сортировка
			</div>
			<button
				id="rating"
				onClick={() => setSort(SortEnum.Rating)}
				className={cn({
					[styles.active]: sort == SortEnum.Rating,
				})}
				tabIndex={1}
				aria-selected={sort == SortEnum.Rating}
				aria-labelledby="sort rating"
			>
				<SortIcon className={styles.sortIcon} />
				По рейтингу
			</button>
			<button
				id="price"
				onClick={() => setSort(SortEnum.Price)}
				className={cn({
					[styles.active]: sort == SortEnum.Price,
				})}
				tabIndex={1}
				aria-selected={sort == SortEnum.Price}
				aria-labelledby="sort price"
			>
				<SortIcon className={styles.sortIcon} />
				По цене
			</button>
		</div>
	);
};

// Вместо seniorSalary, джун и мидр мы вставляем нашу регулярку и во внутрь уже селери
// [styles.active]: sort === SortEnum.Rating - у нас добавляется класс активности когда переданная сортировка ровна рейтингу
//  <SortIcon className={styles.sortIcon}/> добавили иконке класс что бы отодвигать ее от текста

// У нас 'по цене' развозится на две разные строки, что бы они стояли друг возле друга сделаем их нерарывным пробелом &nbsp;

//
//уберём &nbsp, и проблема в том что происходит перенос что наш грид видит что там колона 20 px и он пытаеся впихнуть туда
//нам нужно сказать если у нас есть неактивный див спан тогда перестроить ему сетку, сделаем это благодаря not - .sort span:not(.active)

// Тепреь решим проблему что после клика и получение класса активности у нам происходят прыжки. Если мы посмотрим на грид то они у нас grid-template-columns: 1fr 1fr;, те занимают равно число, по-этому длиное слово выделено - обе колонки длиные, те как только один элемент становится больше - второй его подхватывает и сам становится больше, по-этому заменим на auto auto

//
// прям сейчас наш скрин-ридер когда натыкается на сортировку по цене или рейтингу говорит то что там написана и что это кнопка, но клиент скорее всего не поймет о чем тут идет дело и нам нужно дать более точную информацию
// и вот здесь aria-selected={} как раз таки стейт, потому что он меняется в течение жизни приложения
// aria-selected={sort == SortEnum.Price} - теперь оно будет говорить что кнопка либо выбрано либо нет

// <div className={styles.sortName}>Сортировка</div> - создадим этот див что бы он НЕ БЫЛ виден обычным пользователям, а только тем у кого ограниченные возможности. Когда мы скрыли то мы никак на него не попадем, но благодаря тому что в можем в рамках aria-labelledby обратиться по Айдишнику то мы можем получить оттуда текст
//aria-labelledby='sort' если мы так и оставим то у нас пропадет контекст что это по рейтингу, но мы можем сослаться на самих себя, добавим нашему же баттону на котором задан аттрибут aria-labelledby и уже ему зададим id='rating'. Таким образом aria-labelledby позволяет нам ссылаться на несколько айдишников что бы он брал контент того дива сортировка и за ним ставил контент нашей кнопки, а в нашей кнопки написано ПО РЕЙТИНГУ !
//
