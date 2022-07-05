import { useEffect, useState } from 'react';

export const useScrollY = (): number => {
	const isBrowser = typeof window !== 'undefined';

	const [scrollY, setScrollY] = useState<number>(0);

	const handleScroll = () => {
		const currentScrollY = isBrowser ? window.scrollY : 0;
		setScrollY(currentScrollY);
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true }); // подписываемся на скролл

		return () => window.removeEventListener('scroll', handleScroll); // отписываемся от скролла
	}, []);

	return scrollY;
};
//Когда наш хук в самом начале инициализируется - мы должны подписаться на Скролл и в случае изменение выполнить фцию которая поменяет внутренний стейт нашего хука и отдать этот стейт внаружу по-этому создадим useEffect window.addEventListener('scroll', handleScroll, { passive: true }),
// handleScroll - это передаваема фция которая отработает после подписки

//для того что бы ОТПИСАТЬСЯ нужно сначало что-то с useEffect что-то вернуть
//мы создадим стрелочную функцию, которая будет делать отписку

//мы этот Эффект должны выполнить только один раз при выполнения нашего Хука, по-этому оставляет пустые скобки

//мы используем window - что не очень хорошо, потому что сначала наша фцию будет выполнятся на Сервере Сайде, с точки зрения useEffetct - ничего страшного нет, потому что useEffect будет выполнятся только в Браузере, но если мы дальше будем использовать window что бы получить скролл Y, нам необходимо будет понимать более четко где мы находимся, в браузере или на СерверСайде. По-этому сделаем конст isBrowser
// typeof window !== 'undefined' -  то это браузер, если undefined - то мы на сервере

// isBrowser ? window.scrollY - если мы в браузеер то получаем Y, если все таки сервер то возвращаем 0
//после получение текущего скролла Y мы должны создать стейт и туда его сохранить

// После подписки на скролл если происходить событие 'scroll' мы получаем текущее положение Y в currentScrollY -> устанавливаем его в стейт и наш хук его возвращает
