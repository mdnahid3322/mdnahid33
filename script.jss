let isWithdrawPending = false; // নতুন উইথড্র ব্লক করার জন্য ভেরিয়েবল

// টাকা সিলেকশন
document.querySelectorAll('.amount').forEach(amount => {
    amount.addEventListener('click', function() {
        document.querySelectorAll('.amount').forEach(a => a.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// পেমেন্ট সিলেকশন
document.querySelectorAll('.payment').forEach(payment => {
    payment.addEventListener('click', function() {
        document.querySelectorAll('.payment').forEach(p => p.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Telegram Bot Info (আপনার Bot Token ও Chat ID এখানে দিন)
const BOT_TOKEN = "YOUR_BOT_TOKEN";
const CHAT_ID = "YOUR_CHAT_ID";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// উইথড্র বাটন
document.getElementById('withdrawBtn').addEventListener('click', function() {
    if (isWithdrawPending) {
        alert("❌ আপনি ইতিমধ্যে একটি উইথড্র দিয়েছেন! পেন্ডিং রিকুয়েস্ট কমপ্লিট না হওয়া পর্যন্ত নতুন উইথড্র দিতে পারবেন না।");
        return;
    }

    let selectedAmount = document.querySelector('.amount.selected')?.textContent || "";
    let selectedPayment = document.querySelector('.payment.selected')?.textContent || "";
    let telegramUsername = document.getElementById('telegramUsername').value;
    let phoneNumber = document.getElementById('phoneNumber').value;

    if (!selectedAmount || !selectedPayment || !telegramUsername || !phoneNumber) {
        alert("সব তথ্য পূরণ করুন!");
        return;
    }

    let message = `📢 *নতুন উইথড্র রিকুয়েস্ট*\n\n💰 পরিমাণ: ${selectedAmount}\n💳 পেমেন্ট: ${selectedPayment}\n📞 ফোন: ${phoneNumber}\n🆔 টেলিগ্রাম: @${telegramUsername}\n🔄 স্ট্যাটাস: *Pending*`;

    // Telegram এ পাঠানো
    fetch(TELEGRAM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" })
    });

    // UI তে দেখানো
    let listItem = document.createElement('li');
    listItem.innerHTML = `${selectedAmount} - ${selectedPayment} <span class="pending"> (Pending) </span> 
        <button class="cancelBtn">❌ বাতিল করুন</button>`;
    document.getElementById('withdrawList').appendChild(listItem);

    isWithdrawPending = true; // নতুন উইথড্র ব্লক করা হলো

    alert("✅ উইথড্র রিকুয়েস্ট পাঠানো হয়েছে!");

    // ক্যান্সেল বাটন হ্যান্ডলিং
    listItem.querySelector('.cancelBtn').addEventListener('click', function() {
        let cancelMessage = `⚠️ *উইথড্র রিকুয়েস্ট বাতিল করা হয়েছে!*\n\n💰 পরিমাণ: ${selectedAmount}\n💳 পেমেন্ট: ${selectedPayment}`;
        
        // Telegram এ পাঠানো
        fetch(TELEGRAM_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: cancelMessage, parse_mode: "Markdown" })
        });

        alert("⚠️ উইথড্র বাতিল করা হয়েছে!");
        listItem.remove();
        isWithdrawPending = false; // নতুন উইথড্র দেওয়া যাবে
    });
});
