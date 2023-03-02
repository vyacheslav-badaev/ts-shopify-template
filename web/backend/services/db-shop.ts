import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createNewShop = async (newShopObject: Prisma.ShopCreateInput) => {
	try {
		return await prisma.shop.create({ data: newShopObject });
	} catch (e) {
		return null;
	}
};

export const getShopByDomain = async (shopDomain: string) => {
	try {
		return await prisma.shop.findUnique({ where: { myshopifyDomain: shopDomain } });
	} catch (e) {
		return null;
	}
};

export const updateShopByDomain = async (shopDomain: string, data: Prisma.ShopUpdateInput) => {
	try {
		return await prisma.shop.update({
			where: {
				myshopifyDomain: shopDomain,
			},
			data,
		});
	} catch (e) {
		return null;
	}
};
