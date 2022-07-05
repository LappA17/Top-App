export const API = {
	topPage: {
		find: process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/find',
		byAlias: process.env.NEXT_PUBLIC_DOMAIN + '/api/top-page/byAlias/',
	},
	product: {
		find: process.env.NEXT_PUBLIC_DOMAIN + '/api/product/find',
	},
	review: {
		createDemo: process.env.NEXT_PUBLIC_DOMAIN + '/api/review/create-demo',
	},
};
// У нас в каждом файле странички находится за хардкоденный путь, то-есть process.env.NEXT_PUBLIC_DOMAIN + что-то там, это всегда плохо, по-этому мы создадим здесь файл в котором будем динамически выбирать АПИ
