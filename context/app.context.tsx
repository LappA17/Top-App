import { createContext, PropsWithChildren, ReactNode, useState } from 'react';
import { MenuItem } from '../interfaces/menu.interface';
import { TopLevelCategory } from '../interfaces/page.interface';

export interface IAppContext {
	menu: MenuItem[];
	firstCategory: TopLevelCategory;
	setMenu?: (newMenu: MenuItem[]) => void;
}

export const AppContext = createContext<IAppContext>({ menu: [], firstCategory: TopLevelCategory.Courses });

export const AppContextProvider = ({ menu, firstCategory, children }: PropsWithChildren<IAppContext>): JSX.Element => {
	const [menuState, setMenuState] = useState<MenuItem[]>(menu);

	const setMenu = (newMenu: MenuItem[]) => {
		setMenuState(newMenu);
	};

	return <AppContext.Provider value={{ menu: menuState, firstCategory, setMenu }}>{children}</AppContext.Provider>;
};

//Наш IAppContext будет состоять из первой категории что бы открыть меню и функция, которая позволяет нам обновить меню, к примеру что-то открыть или закрыть
//В фцию setMenu мы передаем фцию нового меню
// AppContextProvider будет принимать в себя какие-то Пропсы и возвращать провайдер от Контекста
// Наш AppContextProvider будет принимать IAppContext и { children: ReactNode} в качестве аргументов

// Посмотрим как будет происходить процесс обновления меню. Чтобы поддерживать стейт меню - нам понадобится стейт
// const [menuState, setMenuState] = useState<MenuItem[]>(menu) - дефолтное меню будет меню которое мы передаем в начале при инициализация Контекста, то-есть первое переданное значение меню вот здесь AppContextProvider = ({ menu, firstCategory, children } - становится его стейтом !
//Передаем в  value={{ menu: menuState, firstCategory }, причем firstCategory у нас не меняется, потому что когда мы будем переходить на другую категорию у нас будет полностью загружаться заново страничка и мы никак не будем управлять и устанавливать эту категорию, в отличие от menu, потому что когда мы будем работать с menu, мы переходя открывая внутрение вкладки(2,3 урвоень меню) должны иметь возможность поменять меню и нам в этом поможет setMenuState
//в const setMenu = (newMenu: MenuItem[]) мы передаем новое меню которые мы уже передадим и потом благодаря новому меню мы будем уже менять стейт setMenuState(newMenu). То-есть теперь когда у нас кто-то будет получать setMenu функцию из контекста куда мы ее передали value={{ menu: menuState, firstCategory, setMenu }} и ее дергать, то у нас будет вызываься вот эта функция setMenu, которая обновляет стейт и все те кто подписался на контекст полчат новое меню !

// Теперь обернем в наш провайдер Layout, потому что мы будем работать в рамках Layout, потому что у нас все страницы обернуты в Layout и это будет хорошой точкой входа в рамках которой мы сможем обернуть и использовать контекст

// В дополнение Антон сказал что это  IAppContext & { children: ReactNode } можно заменить на более красивый код PropsWithChildren<IAppContext>
// PropsWithChildren импортриуется из реакта и позволяет нам указать что передаваемый сюда тип <IAppContext> должен так же содержать и children
