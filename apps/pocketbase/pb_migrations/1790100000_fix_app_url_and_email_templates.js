/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const settings = app.settings()

    // The Horizons preview URL set by the initial migration leaked into every
    // email link after moving to Railway.
    settings.meta.appName = "Resolvoja"
    settings.meta.appURL = "https://resolvoja.com"
    app.save(settings)

    const users = app.findCollectionByNameOrId("users")

    users.resetPasswordTemplate.subject = "Redefinir sua senha na {APP_NAME}"
    users.resetPasswordTemplate.body =
        "<p>Olá,</p>" +
        "<p>Clique no botão abaixo para criar uma nova senha.</p>" +
        "<p><a class=\"btn\" href=\"{APP_URL}/redefinir-senha?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Redefinir senha</a></p>" +
        "<p><i>Se você não pediu isso, pode ignorar este e-mail.</i></p>" +
        "<p>Equipe {APP_NAME}</p>"

    users.verificationTemplate.subject = "Confirme seu e-mail na {APP_NAME}"
    users.verificationTemplate.body =
        "<p>Olá,</p>" +
        "<p>Obrigado por criar sua conta. Clique no botão abaixo para confirmar seu e-mail.</p>" +
        "<p><a class=\"btn\" href=\"{APP_URL}/verificar-email?token={TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirmar e-mail</a></p>" +
        "<p>Equipe {APP_NAME}</p>"

    app.save(users)
}, () => {
    // Intentionally not reverted: the previous values pointed at a dead host.
})
