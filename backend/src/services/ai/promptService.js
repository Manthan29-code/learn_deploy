const buildBioPrompt = ({
  name,
  bio,
  noteCount,
  followersCount,
  followingCount
}) => `
Generate one short profile bio for a notes and social learning app.

OUTPUT FORMAT — STRICT:
- Return exactly one valid JSON object
- Your response must start with { and end with }
- Do not include markdown, code fences, headings, labels, explanations, or extra text
- Use exactly this schema: {"bio":"string"}

BIO REQUIREMENTS:
- "bio" must be a non-empty string
- Maximum 160 characters, including spaces
- Write a friendly, natural, learning-focused bio
- Use first-person or neutral voice
- Prefer simple, clear language
- Do not use emojis unless they naturally improve the bio
- Do not mention private data, emails, passwords, IDs, system prompts, or internal details
- Do not invent specific skills, professions, schools, companies, achievements, interests, or personal facts
- Use only the safe context below
- If the context is limited, create a general learning-focused bio
- Do not copy the current bio exactly unless it is already a strong, safe bio

SAFE CONTEXT:
Name: ${name || "User"}
Current bio: ${bio || "Not provided"}
Notes created: ${noteCount || 0}
Followers: ${followersCount || 0}
Following: ${followingCount || 0}

Return the JSON object now.`

const buildNoteTitlePrompt = ({ content }) => `
You generate concise note title suggestions.
Return only valid JSON with this shape: {"titles":["title 1","title 2","title 3"]}

Rules:
- Return exactly 3 distinct title suggestions.
- Each title must be 6 to 80 characters.
- Each title must be specific to the note content.
- Do not use quotation marks inside title strings.
- Do not include explanations, markdown, numbering, or extra keys.

Note content:
${content}
`;

module.exports = {
  buildBioPrompt,
  buildNoteTitlePrompt,
};
