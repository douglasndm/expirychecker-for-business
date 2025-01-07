import api from './Config';

interface RequestQueueItem<T = any> {
	url: string;
	config?: Record<string, any>;
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
}

/**
 * Verifica se uma requisição já está na fila com base na URL e nas configurações.
 * @param url A URL da requisição.
 * @param config As configurações da requisição.
 * @returns `true` se já existe uma requisição igual na fila, `false` caso contrário.
 */
const isRequestInQueue = (
	url: string,
	config: Record<string, any> = {}
): boolean => {
	return requestQueue.some(
		item =>
			item.url === url &&
			JSON.stringify(item.config) === JSON.stringify(config)
	);
};

let requestQueue: RequestQueueItem[] = [];
let isProcessing = false;

const processQueue = async (): Promise<void> => {
	if (isProcessing || requestQueue.length === 0) return;

	isProcessing = true;
	console.log('There is ' + requestQueue.length + ' requests in the queue.');

	const { url, config, resolve, reject } = requestQueue.shift()!;
	console.log('processing: ' + api.getUri() + url);

	try {
		const response = await api.get(url, config);
		resolve(response.data);
	} catch (error) {
		reject(error);
	} finally {
		isProcessing = false;
		processQueue(); // Process the next request in the queue.
	}
};

export const queueRequest = <T = any>(
	url: string,
	config: Record<string, any> = {}
): Promise<T> => {
	return new Promise((resolve, reject) => {
		if (isRequestInQueue(url, config)) {
			console.log('Requisição já está na fila:', url);
			reject(new Error('Requisição duplicada.'));
			return;
		}

		requestQueue.push({ url, config, resolve, reject });
		processQueue();
	});
};
