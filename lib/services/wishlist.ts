import { asyncHandler } from "@/utils/errorHandler";
import apiClient from "../api";

interface WishlistProps
{
    userId : string,
    productId : string
}

export async function addToWishlist({userId, productId}:WishlistProps)
{
    // Api call
    const response  = await apiClient.post("/api/wishlist",{
        userId,
        productId
    })

    const data = await response.json();

    if( !response.ok){
        
        throw new Error(data.message || "Failed To add Wishlist")
    }
    return  data
}

export async function getWishlistByUserId(userId : string) {

        const response = await apiClient.get(`/api/wishlist/${userId}`);
        const data = response.json();
     if( !response.ok){
        throw new Error(data.message || "Failed To add Wishlist")
    }
    return  data

}

export async function deleteWishlist({userId , productId}:WishlistProps) {
    console.log("user and product ID",userId, productId);

     const response  = await apiClient.delete(`/api/wishlist/${userId}/${productId}`)
    const data = response.json();
    if ( !response.ok){
        throw new Error(data.mesage || " Failed to delete")
    }
    return data 
}



