const  roleIDs = {
    "Cook": 1,
    "Driver": 2,
    "Babysitter": 3,
    "Dogsitter": 4,
    "Nurse": 5,
    "Home Aide": 11,
    "Maid": 12,
    "All-Rounder" : 13
}

exports.seed = async function (knex) {
    // await knex('job_questions').del();

    const roles = [
        {
            role: "Babysitter",
            requirementDetails: [
                { key: "location", label: "Location", type: "text" },
                {
                    key: "availability",
                    label: "Availability",
                    type: "radio",
                    options: ["Full-time", "Part-time", "On-call"]
                },
                {
                    key: "shift",
                    label: "Shift",
                    type: "radio",
                    options: ["Morning", "Evening", "Night"]
                },
                {
                    key: "experience",
                    label: "Experience",
                    type: "radio",
                    options: ["0-1 yrs", "2-5 yrs", "5+ yrs"]
                }
            ],
            duties: [
                "Baby Massage",
                "Baby Food Preparing",
                "Baby Feeding",
                "Baby Bathing",
                "Pickup for School",
                "Changing Diaper",
                "Cleaning Utensils for baby",
                "Taking baby for walk",
                "Preparing baby for sleep",
                "Baby related all work",
            ]
        },

        {
            role: "Home Aide",
            requirementDetails: [
                { key: "location", label: "Location", type: "text" },
                {
                    key: "work_type",
                    label: "Work Type",
                    type: "radio",
                    options: ["Full-time", "Part-time"]
                },
                {
                    key: "shift",
                    label: "Shift",
                    type: "radio",
                    options: ["Morning", "Evening", "Full Day"]
                },
                {
                    key: "experience",
                    label: "Experience",
                    type: "radio",
                    options: ["0-1 yrs", "2-5 yrs", "5+ yrs"]
                }
            ],
            duties: [
                "Sweeping & mopping",
                "Dusting furniture",
                "Washing utensils",
                "Kitchen cleaning",
                "Bathroom cleaning",
                "Making beds",
                "Laundry washing",
                "Ironing clothes",
                "Organizing home",
                "Garbage disposal",
            ]
        },

        {
            role: "Maid",
            requirementDetails: [
                { key: "location", label: "Location", type: "text" },
                {
                    key: "work_type",
                    label: "Work Type",
                    type: "radio",
                    options: ["Full-time", "Part-time"]
                },
                {
                    key: "shift",
                    label: "Shift",
                    type: "radio",
                    options: ["Morning", "Evening", "Full Day"]
                },
                {
                    key: "experience",
                    label: "Experience",
                    type: "radio",
                    options: ["0-1 yrs", "2-5 yrs", "5+ yrs"]
                }
            ],
            duties: [
                "Floor cleaning",
                "Washing Utensil",
                "Bathroom & toilet cleaning",
                "Kitchen cleaning",
                "Dusting & wiping",
                "Laundry washing",
                "Ironing clothes",
                "Making Beds",
                "Window cleaning",
                "All house cleaning work",
            ]
        },

        {
            role: "Nurse",
            requirementDetails: [
                { key: "location", label: "Location", type: "text" },
                {
                    key: "work_type",
                    label: "Work Type",
                    type: "radio",
                    options: ["Full-time", "Part-time"]
                },
                {
                    key: "shift",
                    label: "Shift",
                    type: "radio",
                    options: ["Morning", "Evening", "Full Day"]
                },
                {
                    key: "experience",
                    label: "Experience",
                    type: "radio",
                    options: ["0-1 yrs", "2-5 yrs", "5+ yrs"]
                }
            ],
            duties: [
                "Patient bathing",
                "Medicine reminder",
                "Feeding patient",
                "Checking vitals",
                "Dressing wounds",
                "Bed care",
                "Mobility support",
                "Doctor visit assistance",
                "Elder companionship",
                "Complete patient care",
            ]
        },
        {
            role: "Cook",
            requirementDetails: [
                {
                    key: "meal_type",
                    label: "Meals Required",
                    type: "radio",
                    options: ["Breakfast", "Lunch", "Dinner", "All"]
                },
                {
                    key: "cuisine",
                    label: "Cuisine Preference",
                    type: "radio",
                    options: ["Veg", "Non-Veg", "Both"]
                },
                {
                    key: "frequency",
                    label: "Frequency",
                    type: "radio",
                    options: ["Daily", "Occasional"]
                },
                {
                    key: "experience",
                    label: "Experience",
                    type: "radio",
                    options: ["Beginner", "Intermediate", "Expert"]
                }
            ],
            duties: [
                "Breakfast preparation",
                "Lunch preparation",
                "Dinner preparation",
                "Veg cooking",
                "Non-Veg cooking",
                "Diet food cooking",
                "Cutting & chopping",
                "Kitchen cleaning after cooking",
                "Grocery planning",
                "Special occasion cooking",
            ]
        },
        {
            role: "Driver",
            requirementDetails: [
                {
                    key: "vehicle_type",
                    label: "Vehicle Type",
                    type: "radio",
                    options: ["Car", "SUV", "Truck"]
                },
                {
                    key: "license",
                    label: "License Type",
                    type: "radio",
                    options: ["LMV", "HMV"]
                },
                {
                    key: "availability",
                    label: "Availability",
                    type: "radio",
                    options: ["Full-time", "Part-time"]
                },
                {
                    key: "experience",
                    label: "Experience",
                    type: "radio",
                    options: ["1-3 yrs", "3-7 yrs", "7+ yrs"]
                }
            ],
            duties: [
                "Office pickup & drop",
                "School pickup & drop",
                "Outstation driving",
                "Night driving",
                "Car cleaning",
                "Fuel management",
                "Vehicle maintenance check",
                "Personal driving",
                "Emergency driving",
                "Full-time driving duty"
            ]
        },

        {
            role: "All-Rounder",
            requirementDetails: [
                {
                    key: "service_type",
                    label: "Service Type",
                    type: "radio",
                    options: ["Repair", "Installation", "Maintenance"]
                },
                {
                    key: "urgency",
                    label: "Urgency",
                    type: "radio",
                    options: ["Immediate", "Scheduled"]
                },
                {
                    key: "experience",
                    label: "Experience",
                    type: "radio",
                    options: ["2+ yrs", "5+ yrs"]
                }
            ],
            duties: [
                "House cleaning",
                "Cooking support",
                "Baby care",
                "Elder care",
                "Washing & Ironing",
                "Pet care",
                "Grocery shopping",
                "Dish washing",
                "Full household support",
                "Complete pet care",
            ]
        },

        {
            role: "Dogsitter",
            requirementDetails: [
                {
                    key: "property_type",
                    label: "Property Type",
                    type: "radio",
                    options: ["Home", "Office"]
                },
                {
                    key: "cleaning_type",
                    label: "Cleaning Type",
                    type: "radio",
                    options: ["Basic", "Deep"]
                },
                {
                    key: "frequency",
                    label: "Frequency",
                    type: "radio",
                    options: ["One-time", "Regular"]
                }
            ],
            duties: [
                "Feeding pet",
                "Taking pet for walk",
                "Cleaing pet area",
                "Bathing pet",
                "Playing with pet",
                "Giving medicines",
                "Training basic commands",
                "Pet visit support",
                "Overnight care",
                "Complete pet care"
            ]
        },

    ];

    let rows = [];

    roles.forEach((roleObj) => {

        // Duties as boolean questions
        roleObj.duties.forEach((duty) => {
            rows.push({
                job_role_id: roleIDs[roleObj.role],
                question_key: duty.toLowerCase().replace(/\s+/g, "_"),
                question_text: duty,
                field_type: "boolean",
                options_json: null,
                is_custom: true,
            });
        });
    });

    // await knex('job_questions').insert(rows);
};