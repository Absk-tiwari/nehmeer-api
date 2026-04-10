const Joi = require('joi');

// ─── Auth ─────────────────────────────────────────────────────────────────────
const registerSchema = Joi.object({
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required(),
  phone: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('job_seeker', 'employer').default('job_seeker'),
});

const loginSchema = Joi.object({
  phone: Joi.number().min(10).required(),
  password: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

// ─── Profile ──────────────────────────────────────────────────────────────────
const updateWorkerProfileSchema = Joi.object({
  name: Joi.string().max(255).allow('', null),
  whatsapp: Joi.string().max(255).allow('', null),
  email: Joi.string().max(255).allow('', null),
  gender: Joi.string().max(255).allow('', null),
  location: Joi.string().max(255).allow('', null),
  age: Joi.number().integer().min(18).max(80),
  education: Joi.string().max(255).allow('', null),
  language: Joi.string().max(255).allow('', null),
  religion: Joi.string().max(100).allow('', null),
  marital_status: Joi.string()
    .valid('single', 'married', 'divorced', 'widowed')
    .allow('', null),
  description: Joi.string().allow('', null),
  experience: Joi.number().integer().min(0).max(60),
  skills: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim().min(1)).default([]),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          return helpers.error("any.invalid");
        }
        return parsed;
      } catch {
        return helpers.error("any.invalid");
      }
    })
  ),
  part_time_salary: Joi.number().min(0),
  full_time_salary: Joi.number().min(0),
  is_part_time_available: Joi.boolean(),
  is_full_time_available: Joi.boolean(),
  hourly_rate: Joi.number().min(0),
  monthly_rate: Joi.number().min(0),
  is_available: Joi.boolean(),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  city: Joi.string().max(255).allow('', null),
  service_radius_km: Joi.number().min(0).max(100),
  availability: Joi.array().items(
    Joi.object({
      type: Joi.string().trim().required(),
      start_time: Joi.string()
        .required(),
      end_time: Joi.string()
        .required()
    })
  ).min(1).required()
});

const updateEmployerProfileSchema = Joi.object({
  location: Joi.string().max(255).allow('', null),
});

// ─── Jobs ─────────────────────────────────────────────────────────────────────
const createJobSchema = Joi.object({
  path: Joi.string().allow('', null),
  role_id: Joi.number().integer().required(),
  description: Joi.string().min(10).required(),
  police_verification: Joi.boolean().required(),
  qa: Joi.object()
    .pattern(
      Joi.string(),        // keys like "10", "6"
      Joi.string().allow('', null) // values like "Bikapur"
    )
    .required()
});

const updateJobSchema = createJobSchema.fork(
  ['role_id', 'description', 'police_verification', 'qa'],
  (field) => field.optional()
);

// ─── Applications ─────────────────────────────────────────────────────────────
const applySchema = Joi.object({
  cover_letter: Joi.string().allow('', null),
  resume_url: Joi.string().uri().allow('', null),
});

const updateApplicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid('reviewed', 'shortlisted', 'interview', 'offered', 'rejected')
    .required(),
  employer_notes: Joi.string().allow('', null),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
const createReviewSchema = Joi.object({
  reviewee_id: Joi.number().integer().required(),
  job_id: Joi.number().integer().allow(null),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(2000).allow('', null),
  reviewer_role: Joi.string().valid('job_seeker', 'employer').required(),
});


// ─── Locations ────────────────────────────────────────────────────────────────
const addLocationSchema = Joi.object({
  label: Joi.string().max(100).required(),
  address_line1: Joi.string().max(255).required(),
  address_line2: Joi.string().max(255).allow('', null),
  city: Joi.string().max(100).required(),
  state: Joi.string().max(100).allow('', null),
  country: Joi.string().max(100).required(),
  postal_code: Joi.string().max(20).allow('', null),
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
  is_primary: Joi.boolean().default(false),
});

const updateLocationSchema = addLocationSchema.fork(
  ['label', 'address_line1', 'city', 'country'],
  (field) => field.optional()
);

// ─── Hire Requests ────────────────────────────────────────────────────────────
const sendHireRequestSchema = Joi.object({
  job_seeker_id: Joi.number().integer().required(),
  job_id: Joi.number().integer().allow(null),
  title: Joi.string().max(255).required(),
  message: Joi.string().min(10).required(),
  job_type: Joi.string()
    .valid('full_time', 'part_time', 'contract', 'freelance', 'internship')
    .required(),
  offered_salary_min: Joi.number().min(0).allow(null),
  offered_salary_max: Joi.number().min(0).allow(null),
  offered_salary_currency: Joi.string().length(3).default('USD'),
  is_remote: Joi.boolean().default(false),
  location: Joi.string().max(255).allow('', null),
  expires_at: Joi.date().iso().greater('now').allow(null),
});

const respondHireRequestSchema = Joi.object({
  status: Joi.string().valid('accepted', 'declined').required(),
  response: Joi.string().max(2000).allow('', null),
});

// ─── Job Custom Requirements ──────────────────────────────────────────────────
const customRequirementSchema = Joi.object({
  label: Joi.string().max(255).required(),
  field_type: Joi.string()
    .valid('text', 'textarea', 'boolean', 'select', 'multi_select', 'number', 'date', 'file')
    .required(),
  options: Joi.when('field_type', {
    is: Joi.valid('select', 'multi_select'),
    then: Joi.array().items(Joi.string()).min(1).required(),
    otherwise: Joi.array().allow(null),
  }),
  is_required: Joi.boolean().default(true),
  sort_order: Joi.number().integer().min(0).default(0),
  placeholder: Joi.string().max(255).allow('', null),
  helper_text: Joi.string().max(500).allow('', null),
});

const bulkReplaceRequirementsSchema = Joi.object({
  requirements: Joi.array().items(customRequirementSchema).required(),
});

const reorderRequirementsSchema = Joi.object({
  ordered_ids: Joi.array().items(Joi.number().integer()).min(1).required(),
});

const applyWithAnswersSchema = Joi.object({
  cover_letter: Joi.string().allow('', null),
  resume_url: Joi.string().uri().allow('', null),
  custom_answers: Joi.array()
    .items(
      Joi.object({
        requirement_id: Joi.number().integer().required(),
        answer: Joi.alternatives()
          .try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array())
          .allow(null),
      })
    )
    .default([]),
});


module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  updateWorkerProfileSchema,
  updateEmployerProfileSchema,
  createJobSchema,
  updateJobSchema,
  applySchema,
  updateApplicationStatusSchema,
  createReviewSchema,
  bulkReplaceRequirementsSchema,
  reorderRequirementsSchema,
  applyWithAnswersSchema,
};
