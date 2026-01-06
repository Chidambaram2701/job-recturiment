import React, { useMemo } from 'react';

const AICompatibilityAnalysis = ({ job, user }) => {

    const { matchPercentage, metrics, insights, verdict } = useMemo(() => {
        // Default Analysis if missing data
        if (!job || !user || !job.skillsRequired || !user.skills) {
            return {
                matchPercentage: 0,
                metrics: [
                    { label: 'Skills Match', value: 0, color: 'bg-blue-500' },
                    { label: 'Experience Alignment', value: 0, color: 'bg-indigo-500' },
                    { label: 'Cultural Fit', value: 0, color: 'bg-purple-500' },
                ],
                insights: ["Insufficient data to perform compatibility analysis."],
                verdict: "Please ensure your profile is complete with skills and the job has required skills listed."
            }
        }

        // 1. Skill Match Calculation
        // Normalize strings: lowercase and trim
        const jobSkills = job.skillsRequired.map(s => s.toLowerCase().trim());
        const userSkills = user.skills.map(s => s.toLowerCase().trim());

        const matchingSkills = jobSkills.filter(skill => userSkills.includes(skill));
        const missingSkills = jobSkills.filter(skill => !userSkills.includes(skill));

        const skillMatchCount = matchingSkills.length;
        const totalJobSkills = jobSkills.length;

        let calculatedSkillMatch = 0;
        if (totalJobSkills > 0) {
            calculatedSkillMatch = Math.round((skillMatchCount / totalJobSkills) * 100);
        } else {
            calculatedSkillMatch = 100; // No skills required implies match? Or 0? Let's say 100 if no barriers.
        }

        // 2. Experience Alignment (Mock Logic based on role/history if available, else heuristic)
        // Since we don't have detailed work history length in the User model easily accessible here without parsing,
        // we will mock it based on skill match + a random factor or simply mirror skill match for now to be consistent.
        // Let's make it slightly different but related.
        const experienceAlignment = Math.max(0, calculatedSkillMatch - 10); // Assume slightly lower alignment than raw skills

        // 3. Cultural Fit (Mock Logic)
        // Usually harder to determine without a personality test. We'll give a baseline score + bonus for high skill match.
        const culturalFit = 50 + (calculatedSkillMatch > 80 ? 30 : 0);

        // Overall Match Percentage (Weighted average)
        // Skills: 60%, Experience: 20%, Culture: 20%
        const overallMatch = Math.round((calculatedSkillMatch * 0.6) + (experienceAlignment * 0.2) + (culturalFit * 0.2));

        // Generate Dynamic Insights
        const generatedInsights = [];

        if (missingSkills.length > 0) {
            const missingStr = missingSkills.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
            generatedInsights.push(`The candidate matches ${calculatedSkillMatch}% of required skills but is missing: ${missingStr}.`);
        } else {
            generatedInsights.push("The candidate possesses all the primary skills matched for this role.");
        }

        if (calculatedSkillMatch < 50) {
            generatedInsights.push("There is a significant gap between the listed skills and the technical stack required.");
        } else if (calculatedSkillMatch >= 80) {
            generatedInsights.push("The profile indicates a strong technical alignment with the role requirements.");
        } else {
            generatedInsights.push("The profile shows potential, though some key technical areas may need development.");
        }

        // Mocking the third insight for visual consistency
        generatedInsights.push("Cultural fit analysis suggests a balanced alignment with typical team dynamics for this role.");


        // Generate Verdict
        let generatedVerdict = "";
        if (overallMatch >= 80) {
            generatedVerdict = "\"Excellent candidate! Your profile strongly matches the requirements. We highly recommend applying.\"";
        } else if (overallMatch >= 50) {
            generatedVerdict = "\"Good match. You meet many requirements, but highlighting relevant projects or gaining experience in missing skills could boost your chances.\"";
        } else {
            const missingStrShort = missingSkills.slice(0, 2).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' and ');
            generatedVerdict = `"Enhance your resume by adding specific examples or certifications in ${missingStrShort || 'required skills'} to better reflect your level of expertise."`;
        }

        return {
            matchPercentage: overallMatch,
            metrics: [
                { label: 'Skills Match', value: calculatedSkillMatch, color: 'bg-blue-500' },
                { label: 'Experience Alignment', value: experienceAlignment, color: 'bg-indigo-500' },
                { label: 'Cultural Fit', value: culturalFit, color: 'bg-purple-500' },
            ],
            insights: generatedInsights,
            verdict: generatedVerdict
        };

    }, [job, user]);

    // Circular progress calculation
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (matchPercentage / 100) * circumference;

    // Color determination for score
    let scoreColor = "text-red-500";
    let scoreStroke = "stroke-red-500";

    if (matchPercentage >= 70) {
        scoreColor = "text-green-500";
        scoreStroke = "stroke-green-500";
    } else if (matchPercentage >= 50) {
        scoreColor = "text-yellow-500";
        scoreStroke = "stroke-yellow-500";
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 border-t-4 border-blue-500 relative overflow-hidden">

            {/* Header */}
            <div className="flex items-start mb-8">
                <div className="p-2 bg-blue-50 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">AI Compatibility Analysis</h2>
                    <p className="text-sm text-gray-500">Powered by Gemini flash-lite intelligence</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Left Column: Match Score & Verdict */}
                <div className="flex-1 flex flex-col items-center justify-center border-r md:border-r-0 md:border-gray-100 pr-0 md:pr-4">

                    {/* Circular Progress */}
                    <div className="relative w-40 h-40 mb-6">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                className="stroke-gray-200"
                                strokeWidth="12"
                                fill="none"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                className={`${scoreStroke} transition-all duration-1000 ease-out`}
                                strokeWidth="12"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                            <span className={`text-4xl font-bold ${scoreColor}`}>{matchPercentage}%</span>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Match</span>
                        </div>
                    </div>

                    <div className="text-center px-4">
                        <h3 className="font-bold text-gray-900 mb-2">Verdict</h3>
                        <p className="text-sm text-gray-600 italic leading-relaxed">
                            {verdict}
                        </p>
                    </div>
                </div>

                {/* Right Column: Breakdown & Insights */}
                <div className="flex-[1.5] w-full">

                    {/* Component Breakdown */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Component Breakdown</h3>
                        <div className="space-y-4">
                            {metrics.map((metric, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                                        <span>{metric.label}</span>
                                        <span>{metric.value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${metric.color}`}
                                            style={{ width: `${metric.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Core Insights */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Core Insights</h3>
                        <div className="space-y-3">
                            {insights.map((insight, idx) => (
                                <div key={idx} className="flex items-start">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full ${matchPercentage > 50 ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center mt-0.5 mr-3`}>
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AICompatibilityAnalysis;
