/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async function (knex) {
    await knex("subscriptions").del();

    await knex("subscriptions").insert([
        {
            name: "Basic Plan",
            price: 299,
            custom_posts: 0,
            custom_requests: 0,
            hire_requests_per_month: 1,
            unlimited_profile_checking: true,
        },
        {
            name: "Standard Plan",
            price: 499,
            custom_posts: 20,
            custom_requests: 10,
            hire_requests_per_month: 10,
            unlimited_profile_checking: true,
        },
        {
            name: "Premium Plan",
            price: 899,
            custom_posts: 40,
            custom_requests: 20,
            hire_requests_per_month: 20,
            unlimited_profile_checking: true,
        },
    ]);
};
