import auth from '@react-native-firebase/auth';

import api from '~/Services/API';

interface getProductProps {
    productId: string;
}

export async function getProduct({
    productId,
}: getProductProps): Promise<IProduct | IAPIError> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        const response = await api.get<IProduct>(`/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token?.token}`,
            },
        });

        return response.data;
    } catch (err) {
        const error: IAPIError = {
            status: err.response.status,
            error: err.response.data.error,
        };

        return error;
    }
}

interface createProductProps {
    team_id: string;
    product: Omit<IProduct, 'id'>;
}

export async function createProduct({
    team_id,
    product,
}: createProductProps): Promise<IProduct | IAPIError> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        const categories = product.categories.map(c => c.id);

        const response = await api.post<IProduct>(
            `/products`,
            {
                team_id,
                name: product.name,
                code: product.code,
                categories,
            },
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
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

interface updateProductProps {
    product: Omit<IProduct, 'batches'>;
}

export async function updateProduct({
    product,
}: updateProductProps): Promise<IProduct | IAPIError> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        const categories = product.categories.map(c => c.id);

        const response = await api.put<IProduct>(
            `/products/${product.id}`,
            {
                name: product.name,
                code: product.code,
                categories,
            },
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
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

interface deleteProductProps {
    product_id: string;
}

export async function deleteProduct({
    product_id,
}: deleteProductProps): Promise<void> {
    throw new Error('Server does not implement this function yet');
}
