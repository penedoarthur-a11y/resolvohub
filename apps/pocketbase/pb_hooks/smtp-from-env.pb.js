/// <reference path="../pb_data/types.d.ts" />

// Applies SMTP settings from env vars on every boot, so mail config lives in
// Railway variables instead of the (volume-stored) PocketBase settings.
onBootstrap((e) => {
    e.next();

    const host = $os.getenv("SMTP_HOST");
    const user = $os.getenv("SMTP_USER");
    const pass = $os.getenv("SMTP_PASS");
    if (!host || !user || !pass) return;

    try {
        const settings = e.app.settings();
        const port = parseInt($os.getenv("SMTP_PORT") || "465", 10);

        settings.smtp.enabled = true;
        settings.smtp.host = host;
        settings.smtp.port = port;
        settings.smtp.username = user;
        settings.smtp.password = pass;
        settings.smtp.tls = port === 465;

        settings.meta.senderAddress = $os.getenv("SMTP_FROM") || user;
        settings.meta.senderName = $os.getenv("SMTP_FROM_NAME") || "Resolvoja";

        e.app.save(settings);
    } catch (err) {
        e.app.logger().error("Falha ao aplicar SMTP do ambiente", "error", `${err}`);
    }
});
