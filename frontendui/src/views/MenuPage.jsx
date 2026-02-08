export default function MenuPage() {
   // ... your component code ...
   
   // You can call checkStoreStatus(...) here
}

// 👇 PASTE THIS AT THE VERY BOTTOM OF THE FILE 👇
function checkStoreStatus(openTime, closeTime) {
    if (!openTime || !closeTime) return true; 

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = openTime.split(':').map(Number);
    const [closeH, closeM] = closeTime.split(':').map(Number);
    
    const openTotal = openH * 60 + openM;
    const closeTotal = closeH * 60 + closeM;

    return currentMinutes >= openTotal && currentMinutes < closeTotal;
}