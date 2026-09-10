/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const usersCollection = app.findCollectionByNameOrId("users")

    usersCollection.fields.add(new Field({
        hidden: false,
        name: "stripe_customer_id",
        presentable: false,
        required: false,
        system: false,
        type: "text",
        max: 0,
        min: 0,
        pattern: "",
    }))

    app.save(usersCollection)
}, (app) => {
    const usersCollection = app.findCollectionByNameOrId("users")

    usersCollection.fields.removeByName("stripe_customer_id")

    app.save(usersCollection)
})
