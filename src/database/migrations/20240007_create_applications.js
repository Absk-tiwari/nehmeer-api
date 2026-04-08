exports.up = function (knex) {
  return knex.schema.createTable('applications', (table) => {
    table.increments('id').primary();
    table.string('uuid', 36).notNullable().unique().defaultTo(knex.raw('(UUID())'));
    table.integer('job_id').unsigned().notNullable().references('id').inTable('jobs').onDelete('CASCADE');
    table.integer('applicant_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('cover_letter').nullable();
    table.string('resume_url').nullable();
    table.enu('status', ['pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn']).defaultTo('pending');
    table.text('employer_notes').nullable();
    table.timestamp('viewed_at').nullable();
    table.timestamps(true, true);

    table.unique(['job_id', 'applicant_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('applications');
};
