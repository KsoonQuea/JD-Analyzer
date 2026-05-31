import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are an expert career advisor and technical recruiter. Analyze job descriptions against candidate profiles and provide detailed, actionable match assessments. Always respond with valid JSON only — no markdown fences, no commentary, just the raw JSON object.`

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { jobDescription, skills, resumeText } = body

  if (!jobDescription?.trim()) {
    throw createError({ statusCode: 400, message: 'Job description is required.' })
  }
  if (!skills?.trim() && !resumeText?.trim()) {
    throw createError({ statusCode: 400, message: 'Either skills or a resume is required.' })
  }

  const candidateSection = resumeText?.trim()
    ? [
        'Candidate Resume:',
        resumeText.trim(),
        ...(skills?.trim() ? ['\nAdditional Skills:', skills.trim()] : [])
      ].join('\n')
    : `Candidate Skills:\n${skills.trim()}`

  const client = new Anthropic({ apiKey: config.anthropicApiKey as string })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' }
      }
    ],
    messages: [
      {
        role: 'user',
        content: `Analyze this job description against the candidate's profile.

Job Description:
${jobDescription.trim()}

${candidateSection}

Return ONLY a raw JSON object (no markdown) with this exact structure:
{
  "matchScore": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "matchedSkills": [
    { "skill": "<name>", "matched": true, "relevance": "required|preferred|bonus", "note": "<optional context>" }
  ],
  "missingSkills": [
    { "skill": "<name>", "matched": false, "relevance": "required|preferred|bonus", "note": "<optional context>" }
  ],
  "strengths": ["<strength>"],
  "gaps": ["<gap>"],
  "recommendation": "<2-3 sentences of actionable advice>"
}`
      }
    ]
  })

  const content = response.content[0]
  if (!content || content.type !== 'text') {
    throw createError({ statusCode: 500, message: 'Unexpected API response type.' })
  }

  try {
    return JSON.parse(content.text)
  } catch {
    throw createError({ statusCode: 500, message: 'Failed to parse analysis response.' })
  }
})
