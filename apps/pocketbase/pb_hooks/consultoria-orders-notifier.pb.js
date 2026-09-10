/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
    e.next();

    const adminEmail = $os.getenv("ADMIN_EMAIL");
    if (!adminEmail) return;

    const o = e.record;

    const subject = `[Resolvo Já] Consultoria contratada: ${o.getString("email")}`;

    const html = `
        <h2 style="color:#6366f1">Nova consultoria contratada</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
            <tr><td style="padding:6px 0;color:#666;width:140px"><strong>Cliente</strong></td><td>${o.getString("email")}</td></tr>
            <tr><td style="padding:6px 0;color:#666"><strong>Produto</strong></td><td>${o.getString("product_title")}</td></tr>
            <tr><td style="padding:6px 0;color:#666"><strong>Valor</strong></td><td>R$${(o.getInt("amount_in_cents") / 100).toFixed(2)}</td></tr>
        </table>
        <p>Entre em contato com o cliente para agendar a conversa.</p>
    `;

    try {
        const message = new MailerMessage({
            from: {
                address: $os.getenv("BUILDER_MAILER_SENDER_ADDRESS") || adminEmail,
                name: "Resolvo Já",
            },
            to: [{ address: adminEmail }],
            subject,
            html,
        });
        e.app.newMailClient().send(message);
    } catch (err) {
        e.app.logger().error("Falha ao enviar notificação de consultoria", "error", `${err}`);
    }
}, "consultoria_orders");
