export interface TeamMember {
  id: string;
  name: string;
  titleId: string;
  bioId: string;
  image: string;
}

export interface Product {
  id: string;
  nameId: string;
  descriptionId: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Visit {
  id: string;
  date: string;
  stylistId: string;
  serviceIds: string[];
}

export interface Purchase {
  orderId: string;
  date: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export interface ChatAction {
  label: string;
  type: 'try-style' | 'book-appointment' | 'view-product';
  payload?: {
    stylePrompt?: string;
    productId?: string;
  };
}

export interface ChatMessage {
  id:string;
  sender: 'user' | 'ai';
  text?: string;
  imageUrl?: string;
  actions?: ChatAction[];
  isLoading?: boolean;
}
// Fix: The AIStudio interface and global Window augmentation are now centralized here.
// By declaring AIStudio inside `declare global`, it becomes a globally available type,
// preventing "Subsequent property declarations must have the same type" errors that can
// occur when multiple modules declare globals.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
