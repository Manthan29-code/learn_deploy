const buildBioPrompt = ({ name, bio, noteCount, followersCount, followingCount }) => `
Generate one short profile bio for a notes and social learning app.

Return exactly one valid JSON object with this shape:
{"bio":"string"}

Rules:
- bio must be non-empty
- bio must be 160 characters or less
- write a friendly, natural, learning-focused bio
- use first-person or neutral voice
- do not mention private data, internal details, or invented facts
- use only the safe context below
- if context is limited, keep the bio general and learner-focused

Safe context:
Name: ${name || "User"}
Current bio: ${bio || "Not provided"}
Notes created: ${noteCount || 0}
Followers: ${followersCount || 0}
Following: ${followingCount || 0}
`;

const buildNoteTitlePrompt = ({ content }) => `
Generate concise note title suggestions.

Return exactly one valid JSON object with this shape:
{"titles":["title 1","title 2","title 3"]}

Rules:
- return exactly 3 distinct title suggestions
- each title must be 6 to 80 characters
- each title must fit the note content
- do not include numbering, markdown, or extra keys

Note content:
${content}
`;

const buildNoteSummaryPrompt = ({ title, content }) => `
Summarize this note into a short, clear summary.

Return exactly one valid JSON object with this shape:
{"summary":"string"}

Rules:
- summary must be non-empty
- summary must be 280 characters or less
- keep the core idea accurate
- use simple, direct language
- do not add information that is not in the note
- do not include markdown, bullets, or extra keys

Note title:
${title || "Untitled"}

Note content:
${content}
`;

const buildNoteRewritePrompt = ({ title, content, mode }) => `
Rewrite this note draft to improve its ${mode}.

Return exactly one valid JSON object with this shape:
{"content":"string"}

Rules:
- rewritten content must be non-empty
- rewritten content must stay within 2000 characters
- preserve the original meaning
- improve the writing for the requested mode only
- keep it readable and natural
- do not add new facts, claims, or examples that are not already implied by the note
- do not include markdown, commentary, or extra keys

Requested improvement mode:
${mode}

Note title:
${title || "Untitled"}

Original note content:
${content}
`;

module.exports = {
  buildBioPrompt,
  buildNoteTitlePrompt,
  buildNoteSummaryPrompt,
  buildNoteRewritePrompt,
};
