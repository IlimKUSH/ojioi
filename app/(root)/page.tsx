import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { Product } from "@/types";

const HomePage = async () => {
	const latestProducts = await getLatestProducts();
	
	return (
		<ProductList data={latestProducts as unknown as Product[]} title="Newest arrivals" limit={4} />
	);
};

export default HomePage;