import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render(): JSX.Element {
		return (
			<Html lang="ru">
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
//Здесь происходит некий рендер структуры, те html структура нашего документа, и при этом нам важно что бы пропсы которые у нас есть в исходном документе тоже прокидывались в наш кастомный документ. Как и любая строничка документ должен экспортироваться дефолтным экспортом и наша индексная страничка export default function Home(): JSX.Element,  и здесь тоже
