const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];

function getProducts(productIds, productsCatalog) {
	return productsCatalog.filter( product => productIds.includes(product.id) );
}

function simplifyProductList(productList) {
	return productList.map(product => {
		return { name: product.name, category: product.category };
	});
}

function definePromotion(productList) {
	let promotion = '';

	const categoryCounter = productList.reduce((accObj, product) => {
		const cat = product.category;
		accObj[cat] === undefined ? accObj[cat] = 1 : accObj[cat]++;

		return accObj;
	}, {});

	const amountList = Object.values(categoryCounter);
	const parts = amountList.length;

	switch (parts) {
		case 1:
			promotion = 'SINGLE LOOK';
			break;
		case 2:
			promotion = 'DOUBLE LOOK';
			break;
		case 3:
			promotion = 'TRIPLE LOOK';
			break;
		case 4:
			promotion = 'FULL LOOK';
			break;
		default:
			break;
	}

	return promotion;
}

function calculatePrices(productList, promotion) {
	const totals = productList.reduce((prices, product) => {
		prices.fullPrice += product.regularPrice;

		let hasNoPromotion = true;
		product.promotions.forEach(promo => {
			if (promo.looks.includes(promotion)) {
				prices.discountPrice += promo.price;
				hasNoPromotion = false;
			}
		});

		if (hasNoPromotion) prices.discountPrice += product.regularPrice;

		return prices;
	}, { fullPrice: 0, discountPrice: 0 });

	const pricingData = {
		totalPrice: totals.discountPrice.toFixed(2),
		discountValue: (totals.fullPrice - totals.discountPrice).toFixed(2),
		discount: (100 - ((totals.discountPrice / totals.fullPrice) * 100)).toFixed(2) + '%'
	};

	return pricingData;
}

function getShoppingCart(productIds, productsCatalog) {
	const cart = {};

	const cartProducts = getProducts(productIds, productsCatalog);

	cart.products = simplifyProductList(cartProducts);
	cart.promotion = definePromotion(cart.products);

	const pricingData = calculatePrices(cartProducts, cart.promotion);

	cart.totalPrice = pricingData.totalPrice;
	cart.discountValue = pricingData.discountValue;
	cart.discount = pricingData.discount;

	return cart;
}

module.exports = { getShoppingCart };
