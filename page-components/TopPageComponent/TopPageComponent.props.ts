import { TopLevelCategory, TopPageModel } from '../../interfaces/page.interface';
import { ProductModel } from '../../interfaces/product.interface';

export interface TopPageComponentProps {
	firstCategory: TopLevelCategory;
	page: TopPageModel;
	products: ProductModel[];
}

//Что у нас будет в Пропсах. Когда мы передаем с [alias].tsx некоторые данные, нам необходимо будет иметь так же страничку, продукты, меню необязательно потому что оно уедет в SideBar и нам необходимо будет firstCategory потому что по ней мы можем показывать либо скрывать какие-то блоки, например блок только по для курсов
