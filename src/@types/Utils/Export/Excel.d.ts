interface ExcelRowProps {
    produto: string;
    codigo: string;
    marca: string;
    lote: string;
    vencimento: Date;
    quantidade: number;
    preço: number;
}

interface exportModel {
    product: Omit<IProduct, 'Lotes'>;
    batch: IBatch;
}

interface exportProps {
    sortBy: 'created_date' | 'expire_date';
    brand?: string | null;
    category?: string | null;
    store?: string | null;
}
