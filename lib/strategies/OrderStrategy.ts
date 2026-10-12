import apiClient from "@/lib/api";
import toast from "react-hot-toast";

//interface de dados
export interface OrderPayload {
  orderData: any;
  products: any[];
  addOrderProductFn: (orderId: string, productId: string, quantity: number) => Promise<void>;
}

//interface da strategy
export interface OrderCreationStrategy {
  createOrder(payload: OrderPayload): Promise<string>;
}

// strategy
export class RestApiOrderStrategy implements OrderCreationStrategy {
  async createOrder({ orderData, products, addOrderProductFn }: OrderPayload): Promise<string> {
    console.log("starting order creation via RestApiOrderStrategy...");

    const response = await apiClient.post("/api/orders", orderData);

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        if (response.status === 409) {
          toast.error(errorData.details || errorData.error || "Duplicate order detected");
          throw new Error("DUPLICATE_ORDER");
        } else if (errorData.details && Array.isArray(errorData.details)) {
          errorData.details.forEach((detail: any) => {
            toast.error(`${detail.field}: ${detail.message}`);
          });
        } else if (typeof errorData.details === "string") {
          toast.error(errorData.details);
        } else {
          toast.error(errorData.error || "Order creation failed");
        }
      } catch (parseError: any) {
        if (parseError.message === "DUPLICATE_ORDER") throw parseError;
        toast.error("Order creation failed. Please try again.");
      }
      throw new Error("ORDER_CREATION_FAILED");
    }

    const data = await response.json();
    const orderId: string = data.id;

    if (!orderId) {
      throw new Error("Order ID not received from server");
    }

    for (let i = 0; i < products.length; i++) {
      await addOrderProductFn(orderId, products[i].id, products[i].amount);
    }

    return orderId;
  }
}

//context
export class OrderContext {
  private strategy: OrderCreationStrategy;

  constructor(strategy: OrderCreationStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: OrderCreationStrategy) {
    this.strategy = strategy;
  }

  public async executeOrderCreation(payload: OrderPayload): Promise<string> {
    return await this.strategy.createOrder(payload);
  }
}