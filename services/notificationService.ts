interface NotificationTriggerPayload {
    addProfileNotification: (notification: { type: 'haircut_reminder' | 'product_restock'; message: string; relatedId?: string; }) => void;
    t: (key: string) => string;
    userVisitHistory: any[];
    userPurchaseHistory: any[];
    products: any[];
}

const WEEKS_TO_MILLISECONDS = (weeks: number) => weeks * 7 * 24 * 60 * 60 * 1000;
const HAIRCUT_REMINDER_WEEKS = 6;
const PRODUCT_RESTOCK_WEEKS = 8;

export const checkAndTriggerNotifications = ({ addProfileNotification, t, userVisitHistory, userPurchaseHistory, products }: NotificationTriggerPayload) => {
    const now = new Date().getTime();

    // Check for haircut reminder
    if (userVisitHistory.length > 0) {
        const lastVisit = userVisitHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        const lastVisitTime = new Date(lastVisit.date).getTime();
        
        if (now - lastVisitTime > WEEKS_TO_MILLISECONDS(HAIRCUT_REMINDER_WEEKS)) {
            addProfileNotification({
                type: 'haircut_reminder',
                message: t('profile_notification_haircut')
            });
        }
    }

    // Check for product restock reminder
    if (userPurchaseHistory.length > 0) {
        const lastPurchase = userPurchaseHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        const lastPurchaseTime = new Date(lastPurchase.date).getTime();

        if (now - lastPurchaseTime > WEEKS_TO_MILLISECONDS(PRODUCT_RESTOCK_WEEKS)) {
            const lastPurchasedItem = lastPurchase.items[0];
            const productInfo = products.find(p => p.id === lastPurchasedItem.productId);
            if(productInfo) {
                const productName = t(productInfo.nameId);
                const message = t('profile_notification_product').replace('{productName}', productName);
                addProfileNotification({
                    type: 'product_restock',
                    message: message,
                    relatedId: lastPurchasedItem.productId
                });
            }
        }
    }
};
