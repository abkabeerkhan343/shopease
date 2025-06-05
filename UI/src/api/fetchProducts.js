import axios from "axios";
import { API_BASE_URL, API_URLS } from "./constant";

// ✅ Get All Products (with optional categoryId and typeId)
export const getAllProducts = async (categoryId, typeId) => {
    let url = API_BASE_URL + API_URLS.GET_PRODUCTS;
    const queryParams = [];

    if (categoryId) queryParams.push(`categoryId=${categoryId}`);
    if (typeId) queryParams.push(`typeId=${typeId}`);

    if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
    }

    try {
        const result = await axios.get(url);
        return result?.data;
    } catch (err) {
        console.error("Error fetching products:", err);
        return [];
    }
};

// ✅ Get Single Product by Slug
export const getProductBySlug = async (slug) => {
    if (!slug) return null;

    const url = API_BASE_URL + API_URLS.GET_PRODUCTS + `?slug=${slug}`;

    try {
        const result = await axios.get(url);
        return result?.data?.[0];
    } catch (err) {
        console.error("Error fetching product by slug:", err);
        return null;
    }
};
