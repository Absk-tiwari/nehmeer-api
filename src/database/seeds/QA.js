/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

  // Deletes ALL existing entries
  // await knex('job_questions').del();
  // await knex('job_roles').del();

  // await knex('job_roles').insert([
  //   { name: "Maid" },
  //   { name: "All-Rounder" },
  // ]);

  // await knex('job_questions').insert([

  //   { job_role_id:12, question_text: "Type of Work", field_type: "multi_select", options_json: `["Cleaning", "Utensils", "Laundry", "Cooking Help"]`, is_required: false, order_index: 0 },
  //   { job_role_id:12, question_text: "Experience Level", field_type: "select", options_json: `["1-3 years", "3-5 years", "5+ years"]`, is_required: false, order_index: 0 },
  //   { job_role_id:12, question_text: "Work Frequency", field_type: "select", options_json: `["Part-time", "Full-time"]`, is_required: false, order_index: 0 },
  //   { job_role_id:12, question_text: "Working Hours", field_type: "select", options_json: `["Morning", "Afternoon", "Evening"]`, is_required: false, order_index: 0 },
  //   { job_role_id:12, question_text: "Location", field_type: "text", is_required: false, order_index: 0 },

  //   { job_role_id: 13, question_text: "Skills", field_type: "multi_select", options_json: `["Cooking", "Cleaning", "Driving", "Child Care"]`, is_required: false, order_index: 0 },
  //   { job_role_id: 13, question_text: "Experience Level", field_type: "select", options_json: `["1-3 years", "3-5 years", "5+ years"]`, is_required: false, order_index: 0 },
  //   { job_role_id: 13, question_text: "Work Type", field_type: "select", options_json: `["Part-time", "Full-time", "Live-in"]`, is_required: false, order_index: 0 },
  //   { job_role_id: 13, question_text: "Preferred Duties", field_type: "multi_select", options_json: `["Household Work", "Outdoor Tasks", "Errands"]`, is_required: false, order_index: 0 },
  //   { job_role_id: 13, question_text: "Location", field_type: "text", is_required: false, order_index: 0 },

  //   { job_role_id: 3, question_text: "Experience with Children", field_type: "select", options_json: `["0-1 years", "1-3 years", "3+ years"]`, is_required: false, order_index: 0 },
  //   { job_role_id: 3, question_text: "Age Group Experience", field_type: "select", options_json: `["Infants", "Toddlers", "School-age", "All"]`, is_required: false, order_index: 0 },
  //   { job_role_id: 3, question_text: "Services Required", field_type: "multi_select", options_json: `["Feeding", "Bathing", "Homework Help", "Playtime"]`, is_required: false, order_index: 0 },
  //   { job_role_id: 3, question_text: "Working Hours", field_type: "select", options_json: `["Morning", "Afternoon", "Evening", "Full Day"]`, is_required: false, order_index: 0 },
  //   { job_role_id: 3, question_text: "Location", field_type: "text", is_required: false, order_index: 0 }

  // ]);

};
