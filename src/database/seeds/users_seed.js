/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex('users').del()
  // await knex('users').insert([
  //   { 
  //     name: "Admin User",
  //     phone: "+919999999999",
  //     email: "admin@example.com",
  //     password: "test123",
  //     role: "admin",
  //     is_verified: true,
  //     is_phone_verified: true
  //   },
  //   { 
  //     name: "Antara Sahu",
  //     phone: "+913999999999",
  //     email: "worker@example.com",
  //     password: "test123",
  //     role: "worker",
  //     is_verified: true,
  //     is_phone_verified: true
  //   },
  //   { 
  //     name: "Isika Prajapati",
  //     phone: "+914999999999",
  //     email: "employer@example.com",
  //     password: "test123",
  //     role: "employer",
  //     is_verified: true,
  //     is_phone_verified: true
  //   }
  // ]);
};
