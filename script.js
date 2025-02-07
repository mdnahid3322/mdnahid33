document.addEventListener("DOMContentLoaded", function () {
    let selectedAmount = null;
    let selectedPayment = null;
    let withdrawPending = false; // একবার উইথড্র দেওয়া হলে পরবর্তী অনুরোধ বন্ধ করতে

    // টাকার অপশন সিলেক্ট করা
    document.querySelectorAll(".amount").forEach(item => {
        item.addEventListener("click", function () {
            if (!withdrawPending) {
                document.querySelectorAll(".amount").forEach(el => el.classList.remove("selected"));
                this.classList.add("selected");
                selectedAmount = this.textContent.trim();
            }
        });
    });

    // পেমেন্ট অপশন সিলেক্ট করা
    document.querySelectorAll(".payment").forEach(item => {
        item.addEventListener("click", function () {
            if (!withdrawPending) {
                document.querySelectorAll(".payment").forEach(el => el.classList.remove("selected"));
                this.classList.add("selected");
                selectedPayment = this.textContent.trim();
            }
        });
    });

    // উইথড্র বাটন ক্লিক ইভেন্ট
    document.getElementById("withdrawBtn").addEventListener("click", function () {
        if (withdrawPending) {
            alert("আপনি ইতিমধ্যে একটি উইথড্র অনুরোধ পাঠিয়েছেন! অনুগ্রহ করে অপেক্ষা করুন।");
            return;
        }

        let username = document.getElementById("username").value.trim();
        let phone = document.getElementById("phone").value.trim();

        if (!selectedAmount || !selectedPayment || !username || !phone) {
            alert("অনুগ্রহ করে সব তথ্য পূরণ করুন!");
            return;
        }

        withdrawPending = true; // নতুন অনুরোধ বন্ধ করতে

        // **Sparkle Effect যুক্ত করা**
        let button = this;
        for (let i = 0; i < 10; i++) {
            let sparkle = document.createElement("div");
            sparkle.classList.add("sparkle");
            sparkle.style.left = `${Math.random() * button.clientWidth}px`;
            sparkle.style.top = `${Math.random() * button.clientHeight}px`;
            button.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 500); // 0.5 সেকেন্ড পর মুছে যাবে
        }

        // উইথড্র রিকোয়েস্ট কনফার্মেশন
        setTimeout(() => {
            alert("✅ আপনার উইথড্র অনুরোধ সফলভাবে পাঠানো হয়েছে!");
            document.getElementById("withdrawRequests").innerHTML += 
                `<p>${username} - ${phone} - ${selectedAmount}৳ - ${selectedPayment} <span class="pending">[Pending]</span> 
                <button class="cancelBtn">বাতিল করুন</button></p>`;
        }, 1000);

        // **টেলিগ্রামে উইথড্র রিকোয়েস্ট পাঠানো**
        let botToken = "YOUR_BOT_TOKEN"; // আপনার টেলিগ্রাম বট টোকেন
        let chatId = "YOUR_CHAT_ID"; // আপনার টেলিগ্রাম চ্যানেল বা গ্রুপ আইডি
        let message = `📌 নতুন উইথড্র রিকোয়েস্ট:\n\n👤 ইউজার: ${username}\n📞 নাম্বার: ${phone}\n💰 পরিমাণ: ${selectedAmount}৳\n🏦 পেমেন্ট: ${selectedPayment}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`);

        // **উইথড্র বাতিল করার ব্যবস্থা**
        setTimeout(() => {
            document.querySelectorAll(".cancelBtn").forEach(button => {
                button.addEventListener("click", function () {
                    this.parentElement.remove();
                    withdrawPending = false; // নতুন উইথড্র অনুমতি দেওয়া

                    // **টেলিগ্রামে বাতিলের নোটিফিকেশন পাঠানো**
                    let cancelMessage = `❌ উইথড্র বাতিল:\n\n👤 ইউজার: ${username}\n📞 নাম্বার: ${phone}\n💰 পরিমাণ: ${selectedAmount}৳\n🏦 পেমেন্ট: ${selectedPayment}`;
                    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(cancelMessage)}`);
                });
            });
        }, 1000);
    });
});
