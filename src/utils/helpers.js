exports.generateRandomString = (length = 16) => {
    return Math.random().toString(36).substring(2, length + 2);
};

exports.requirementDetails =  [
    {
        id: "location",
        label: "Location",
        type: "text",
        default: "Boni, Nayek Para, Birbhum",
    },
    {
        id: "availability",
        label: "Availability",
        type: "option",
        options: ["Full-time", "Part-time"], // , "On-call/Occasional"
    },
    {
        id: "shift",
        label: "Shift Divisions",
        type: "radio",
        options: [
            "Morning Shift: 6 AM - 10 AM",
            "Midday Shift: 11 AM - 2 PM",
            "Evening Shift: 5 PM - 9 PM",
            "Night Shift: 9 PM - 12 AM",
        ],
    },
    {
        id: "experience of work",
        label: "Experience of work",
        type: "radio",
        options: [
            "Beginner (0-1 years)",
            "Intermediate (2-5 years)",
            "Experienced (5+ years)",
        ],
    },
]
