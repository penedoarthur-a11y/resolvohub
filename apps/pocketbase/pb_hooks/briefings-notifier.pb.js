/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
    e.next();

    const adminEmail = $os.getenv("ADMIN_EMAIL");
    if (!adminEmail) return;

    const b = e.record;

    const subject = `[ResolvoHub] Novo briefing: ${b.getString("subdivisao")} — ${b.getString("empresa") || "empresa não informada"}`;

    const html = `
        <h2 style="color:#6366f1">Novo briefing recebido no ResolvoHub</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
            <tr><td style="padding:6px 0;color:#666;width:140px"><strong>Área</strong></td><td>${b.getString("area_nome")}</td></tr>
            <tr><td style="padding:6px 0;color:#666"><strong>Subdivisão</strong></td><td>${b.getString("subdivisao")}</td></tr>
            <tr><td style="padding:6px 0;color:#666"><strong>Empresa</strong></td><td>${b.getString("empresa") || "—"}</td></tr>
            <tr><td style="padding:6px 0;color:#666"><strong>Setor</strong></td><td>${b.getString("setor") || "—"}</td></tr>
            <tr><td style="padding:6px 0;color:#666"><strong>Porte</strong></td><td>${b.getString("porte") || "—"}</td></tr>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb">
        <p><strong>Problema descrito:</strong></p>
        <p style="background:#f9fafb;padding:12px;border-radius:8px">${b.getString("problema")}</p>
        <p><strong>Já tentou:</strong> ${b.getString("tentativas") || "—"}</p>
        <p><strong>Objetivo em 90 dias:</strong> ${b.getString("objetivo") || "—"}</p>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb">
        <p><strong>Prévia gerada pela IA:</strong></p>
        <pre style="background:#f9fafb;padding:12px;border-radius:8px;white-space:pre-wrap;font-family:sans-serif">${b.getString("preview")}</pre>
    `;

    try {
        const message = new MailerMessage({
            from: {
                address: $os.getenv("BUILDER_MAILER_SENDER_ADDRESS") || adminEmail,
                name: "ResolvoHub",
            },
            to: [{ address: adminEmail }],
            subject,
            html,
        });
        e.app.newMailClient().send(message);
    } catch (err) {
        e.app.logger().error("Falha ao enviar notificação de briefing", "error", `${err}`);
    }
}, "briefings");
