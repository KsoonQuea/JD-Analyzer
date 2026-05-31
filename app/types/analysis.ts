export interface SkillMatch {
  skill: string
  matched: boolean
  relevance: 'required' | 'preferred' | 'bonus'
  note?: string
}

export interface AnalysisResult {
  matchScore: number
  summary: string
  matchedSkills: SkillMatch[]
  missingSkills: SkillMatch[]
  strengths: string[]
  gaps: string[]
  recommendation: string
}
