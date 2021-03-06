import styles from './Button.module.scss';
import { ButtonProps } from './Button.props';
import ArrowIcon from './arrow.svg';
import cn from 'classnames';
import { motion, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

export const Button = ({ appearance, arrow = 'none', children, className, ...props }: ButtonProps): JSX.Element => {
	const scale = useMotionValue(1);

	//Button будет возвращать понятное дело button, не нужно никогда делать баттаны дивами, потому что мы сразу теряем все преимущества нативного баттона(фокус, нормальная доступность)
	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			className={cn(styles.button, className, {
				[styles.primary]: appearance == 'primary',
				[styles.ghost]: appearance == 'ghost',
			})}
			style={{ scale }}
			{...props}
		>
			{children}
			{arrow != 'none' && (
				<span
					className={cn(styles.arrow, {
						[styles.down]: arrow == 'down',
					})}
				>
					<ArrowIcon />
				</span>
			)}
		</motion.button>
	);
};

// Что бы сделать так что наш Button поддерживал бы все свойства что есть и у обычного button нужно зайти в button.props и написать что он будет экстендить extends DetailedHTMLProps который в Реакте и в рамках Дженерика <> мы должны передать что это у нас за DetailedHTMLProps, и это ButtonHTMLAttributes который в свою очередь принимать HTMLButtonElement и вторым параметром он принимает тоже HTMLButtonElement. Вот так описываются пропсы, те мы взяли наши пропсы и экстендили от детальных пропсов HTML. И теперь у нашего Компонента Button появилось свойство onClick, у нас появился className, но работать это не будет, потому что не смотря на то что мы описали их в качестве пропсов нашего Баттона - мы их никак не описали в самом Button. Во-первых className, мы уже в нашем button объявили className и туда поместили фцию cn и нам нужно в него еще перемешать className который приходит из-вне(className из пропсов) по-этому через запятую передаем className. Так же на самом деле кроме всех этих пропсов appearance, children, className у нас есть куча разных других событий типа onCLick и тд, но все эти вещи мы не будет по одному вытаскивать, а воспользуемся фцией js а именно ...props и назовем их props - те спред оставшихся пропсов, таким образом мы говорим что мы явно вытаскиваем appearance, children, className а все остальные помещаем в массивв props. И мы передаем {...props} после нашего классНейма, таким образом мы передаем абсолютно все пропсы который мы вытащили, те вот только теперь наш Button будет иметь все свойства обычной кнопки. Так прокидывать пропсы в качестве свойств нашего компонента нужно делать всегда, будь-то не только кнопка, а к примеру заголовок или обычный див

// Что бы поместить svg на страничку можно или <img src="/arrow.svg" alt="" />, но тогда все наши svg должны лежать в папке public
// Второй вариант - наш Некст под собой использует webpack, и мы можем добавить возможность использовать svg как Компоненты Реакта. Создадим файл next.config.js. Мы там скажем что если мы видим svg в файлах js или ts то его нужно понимать как отдельный Компонент. Нам в этом помогает svgr/webpack.
// Теперь нам нужно сказать ТС что наш Компонент ArrowIcon - это валидный модуль, мы в файле next-env.d.ts(но это все работало на next 10 версии, на 11 и позже уже весь declare который мы записывали уже не работает и просто очищается после npm run dev, по-этому нужно создать svg.d.ts и уже туда перенести declare) напишем declare module '*.svg'. И вот теперь мы можем использовать ArrowIcon как полноценный компонент. Так же нужно не забыть npm i -D @svgr/webpack. Так же связи с обновление до next 11 и выше нужно в ТСконфиге в блоке include где мы указываем что м инклюдим в качестве компиляции мы добавялем новую строку с нашим нужным файлом
// Теперь решим проблему с цветом. У нашей svg в поле path есть fill="#3B434E" , мы его оттуда удаляем и переносим в тег svg, и вместо fill="none" делаем fill="#3B434E", таким образом мы сделали глобальный фил

//Что бы у нашего svg появился свой АвтоКомплит(те мы могли задавать ему свойства className или другие нужные нам аттрибуты) мы создадим свой собственный next-env-custom.d.ts, и туда коппируем все но самое главное без <reference types="next/image-types/global" /> и в ТС конфги в includes меняем путь с того next-env.d.ts на наш Кастомный. Антон в видео объясняет в чем проблема. Но таким образом мы потеряем часть определений типа *.bmp *.webp и так далее. И что бы решить эту проблема мы заходим в  node_modules -> next -> images -> global.d.ts(сейчас такого пути больше нет), копируем все оттуда, создаем новый файл images.d.ts удаялем svg.d.ts и туда все копируем с gloval.d.ts и в ТСконфиге вместо "svg.d.ts" ставим "images.d.ts"

//
//Если мы сейчас сделаем motion.button нашей кнопке то получим ошибку, потому что ТайпСкрипт конфликтует из-за наших пропсов, что бы решить эту проблему нужно написать Omit который поможет нам сказать какие свойства нужно не типизировать
// 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref' после исключение этих 5 свой ошибка тс уходит
// Нам нужно в Эффекте подисаться на изменения этого scale
// Когда мы наводим на кнопку у нас в консоли происходит кучу изменений от 1 - 1.05
