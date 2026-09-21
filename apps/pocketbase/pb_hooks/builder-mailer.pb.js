/// <reference path="../pb_data/types.d.ts" />

// Railway blocks outbound SMTP on non-Pro plans, so mail goes out through the
// Resend HTTPS API. RESEND_FROM must be an address on a domain verified in
// Resend (or "Resolvoja <onboarding@resend.dev>", which only delivers to the
// Resend account owner).
onMailerSend((e) => {
    const apiKey = $os.getenv("RESEND_API_KEY");
    if (!apiKey) {
        return e.next();
    }

    const from = $os.getenv("RESEND_FROM") || "Resolvoja <onboarding@resend.dev>";

    const payload = {
        from,
        to: e.message.to.map((t) => t.address),
        subject: e.message.subject,
    };
    if (e.message.html) {
        payload.html = e.message.html;
    } else {
        payload.text = e.message.text;
    }

    const response = $http.send({
        url: "https://api.resend.com/emails",
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        timeout: 20,
    });

    if (response.statusCode < 200 || response.statusCode >= 300) {
        $app.logger().error("Failed to send email via Resend", "status", response.statusCode, "error", response.json);
        throw new ApiError(500, response.json?.message || "Failed to send email");
    }
})
