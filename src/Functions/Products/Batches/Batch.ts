import api from '~/Services/API';

import { getUserSession } from '~/Functions/Auth/Login';

interface getBatchProps {
    batch_id: string;
}
interface getBatchResponse {
    product: IProduct;
    batch: IBatch;
}
export async function getBatch({
    batch_id,
}: getBatchProps): Promise<getBatchResponse | IAPIError> {
    try {
        const userSession = await getUserSession();
        const token = userSession?.token;

        if (!token) {
            throw new Error('Token is missing');
        }

        const response = await api.get(`/batches/${batch_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const responseData: getBatchResponse = {
            product: response.data.product,
            batch: response.data,
        };
        return responseData;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}

interface createBatchProps {
    productId: string;
    batch: Omit<IBatch, 'id'>;
}

export async function createBatch({
    productId,
    batch,
}: createBatchProps): Promise<IBatch | IAPIError> {
    try {
        const userSession = await getUserSession();
        const token = userSession?.token;

        if (!token) {
            throw new Error('Token is missing');
        }

        const response = await api.post<IBatch>(
            `/batches`,
            {
                product_id: productId,
                name: batch.name,
                exp_date: batch.exp_date,
                amount: batch.amount,
                price: batch.price,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}

interface updatebatchProps {
    batch: IBatch;
}

export async function updateBatch({
    batch,
}: updatebatchProps): Promise<IBatch | IAPIError> {
    try {
        const userSession = await getUserSession();
        const token = userSession?.token;

        if (!token) {
            throw new Error('Token is missing');
        }

        const response = await api.put<IBatch>(
            `/batches/${batch.id}`,
            {
                name: batch.name,
                exp_date: batch.exp_date,
                amount: batch.amount,
                price: batch.price,
                status: batch.status,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}