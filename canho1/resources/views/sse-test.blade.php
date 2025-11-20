<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Test SSE Notifications</title>
</head>
<body>
    <h2>🔔 Thông báo realtime (SSE)</h2>
    <button onclick="sendTest()">Gửi thông báo test</button>
    <ul id="noti-list"></ul>

    <script>
        // Kết nối tới SSE endpoint
        const es = new EventSource("/notifications/stream");

        es.addEventListener("notification", (e) => {
            const data = JSON.parse(e.data);
            console.log("🔔 New notification:", data);

            const li = document.createElement("li");
            li.textContent = `${data.time} — ${data.message}`;
            document.getElementById("noti-list").appendChild(li);
        });

        es.addEventListener("heartbeat", () => {
            console.log("💓 heartbeat");
        });

        es.onerror = (err) => {
            console.error("❌ SSE error, reconnecting...", err);
        };

        function sendTest() {
            fetch("/notifications/test")
                .then(r => r.text())
                .then(msg => alert(msg));
        }
    </script>
</body>
</html>
