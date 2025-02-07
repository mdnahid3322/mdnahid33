document.addEventListener("DOMContentLoaded", function () {
    let selectedAmount = null;
    let selectedPayment = null;
    let withdrawPending = false;

    document.querySelectorAll(".amount").forEach(item => {
        item.addEventListener("click", function () {
            if (!withdrawPending) {
                document.querySelectorAll(".amount").forEach(el => el.classList.remove("selected"));
                this.classList.add("selected");
                selectedAmount = this.textContent.trim();
            }
        });
    });

    document.querySelectorAll(".payment").forEach(item => {
        item.addEventListener("click", function () {
            if (!withdrawPending) {
                document.querySelectorAll(".payment").forEach(el => el.classList.remove("selected"));
                this.classList.add("selected");
                selectedPayment = this.textContent.trim();
            }
        });
    });

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

        withdrawPending = true;

        setTimeout(() => {
            let requestElement = document.createElement("p");
            requestElement.innerHTML = `${username} - ${phone} - ${selectedAmount}৳ - ${selectedPayment} <span class="pending">[Pending]</span> 
                <button class="cancelBtn">বাতিল করুন</button>`;
            document.getElementById("withdrawRequests").appendChild(requestElement);

            requestElement.querySelector(".cancelBtn").addEventListener("click", function () {
                requestElement.querySelector(".pending").classList.replace("pending", "canceled");
                requestElement.querySelector(".canceled").textContent = "[Canceled]";
                this.remove();
                withdrawPending = false;
            });

            alert("✅ আপনার উইথড্র অনুরোধ সফলভাবে পাঠানো হয়েছে!");
        }, 1000);
    });
});
