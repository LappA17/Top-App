import styles from './Up.module.scss';
import UpIcon from './up.svg';
import { useScrollY } from '../../hooks/useScrollY';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';

export const Up = (): JSX.Element => {
	const controls = useAnimation();
	const y = useScrollY();

	useEffect(() => {
		controls.start({ opacity: y / document.body.scrollHeight });
	}, [y, controls]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0, //скролим до 0
			behavior: 'smooth', //что бы скрол был плавный
		});
	};

	return (
		<motion.div className={styles.up} animate={controls} initial={{ opacity: 0 }}>
			<ButtonIcon appearance="primary" icon="up" aria-label="На верх" onClick={scrollToTop} />
		</motion.div>
	);
};
// В фции scrollToTop мы можем не беспокоится что window может не быть потому что оно может вызываться только по клику
// В scrollTo можно либо передать значения, либо опции в виде Объекта

//Теперь сделаем так что эта кнопка будет появлятся если мы не в самом вверху, что бы найти наше месторосположение на сайте воспользуемся сделанным хуков useScrollY()

//Создадим controls - для анимации и свяжем ее с нашей button сделав её motion + передав атрибут animate={controls}, так мы свяжем их
//теперь нужно затригерить когда у нас меняется y и это лучше делать в Эффекте
//как только менятеся y - триггерим анимацию
//мы будем запускать нашу анимацию(start) и берев наш y и разделим его на всю высоту нашего скролла. То-есть если мы находим внизу то у нас будет полная opacity если нет и мы в самом верху то ничего не будет отображаться, причем переходы между этими состояниями будут анимированы так как это анимации

// initial={{ opacity: 0 }} что бы при первичной загрузки не появлялась стрелочка

//
// После того как мы сделали Иконку динамической мы переносим события клика с Дива на кнопку <ButtonIcon appearance='primary' icon='up' onClick={scrollToTop} />, потому что у нас раньше motion.button была а сейчас div
