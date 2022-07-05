import { ReactNode } from 'react';

export interface LayoutProps {
	children: ReactNode;
}

// Нам нужен только Чилдрен потому что layout будет оборачивать наш Компонент, так как это верхнеуровневый Компонент мы будем передавать только Чилдерн, без пропсов по-этому мы можем сразу убрать extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
