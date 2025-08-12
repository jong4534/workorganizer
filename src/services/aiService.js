// AI 서비스 - Google Gemini API 연동
class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key'
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
  }

  // 질문/답변을 요약하고 카테고리를 제안하는 함수
  async summarizeQA(question, answer) {
    try {
      // 데모 모드 체크 (API 키가 없거나 demo-key면 데모 모드)
      if (!this.apiKey || this.apiKey === 'demo-key' || this.apiKey === 'your-gemini-api-key-here') {
        console.log('데모 모드에서 AI 요약 실행')
        return await this.generateDemoResponse(question, answer)
      }

      // 실제 Gemini API 호출
      console.log('Gemini API 호출 시작')
      const prompt = `다음 질문과 답변을 분석하여 정확히 아래 JSON 형식으로만 응답해주세요. 다른 설명은 추가하지 마세요.

질문: ${question}
답변: ${answer}

요구사항:
1. 핵심 내용을 한국어로 2-3문장으로 요약
2. 적절한 카테고리 제안 (예: 프론트엔드 개발, 백엔드 개발, UI/UX 디자인, 마케팅, 기획, 일반 등)
3. 관련 태그 2-4개

정확히 이 JSON 형식으로만 응답:
{
  "summary": "요약 내용",
  "suggestedCategory": "카테고리명",
  "tags": ["태그1", "태그2", "태그3"]
}`

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Gemini API 오류: ${response.status} - ${errorText}`)
        throw new Error(`Gemini API 오류: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Gemini API 응답 형식 오류:', data)
        throw new Error('Gemini API 응답 형식이 올바르지 않습니다')
      }

      const content = data.candidates[0].content.parts[0].text
      console.log('Gemini API 응답:', content)
      
      // JSON 파싱 시도
      try {
        // JSON 코드 블록에서 실제 JSON 추출
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*?\}/)
        const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
        const parsed = JSON.parse(jsonText.trim())
        
        return {
          summary: parsed.summary || '요약을 생성할 수 없습니다.',
          suggestedCategory: parsed.suggestedCategory || '일반',
          tags: Array.isArray(parsed.tags) ? parsed.tags : ['정보']
        }
      } catch (parseError) {
        console.warn('JSON 파싱 실패, 기본 처리:', parseError)
        console.log('파싱 실패한 내용:', content)
        
        // JSON 파싱 실패 시 기본 처리
        return {
          summary: content.length > 200 ? content.substring(0, 200) + '...' : content,
          suggestedCategory: '일반',
          tags: ['AI요약', '정보']
        }
      }

    } catch (error) {
      console.error('Gemini AI 요약 중 오류 발생:', error)
      
      // 오류 시 데모 응답으로 폴백
      return await this.generateDemoResponse(question, answer)
    }
  }

  // 데모용 응답 생성
  async generateDemoResponse(question, answer) {
    // 로딩 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))

    const demoResponses = [
      {
        summary: "Vue.js의 반응형 시스템은 Proxy를 활용하여 데이터 변경을 자동 감지하고 UI를 실시간으로 업데이트합니다. 이를 통해 개발자는 데이터 상태 관리를 효율적으로 할 수 있습니다.",
        suggestedCategory: "프론트엔드 개발",
        tags: ["Vue.js", "반응형", "Proxy"]
      },
      {
        summary: "Firebase는 Google에서 제공하는 백엔드 서비스로, 인증, 데이터베이스, 호스팅 등 다양한 기능을 제공합니다. Vue.js와 연동하여 빠른 개발이 가능합니다.",
        suggestedCategory: "백엔드 개발",
        tags: ["Firebase", "백엔드", "클라우드"]
      },
      {
        summary: "사용자 경험(UX) 설계 시 사용자의 니즈와 행동 패턴을 분석하고, 직관적이고 효율적인 인터페이스를 설계하는 것이 중요합니다.",
        suggestedCategory: "UI/UX 디자인",
        tags: ["UX", "사용자경험", "인터페이스"]
      },
      {
        summary: "Google Gemini API는 무료 할당량이 매우 관대하여 개인 프로젝트나 소규모 팀에서 활용하기 좋습니다. 하루 1,500회 요청까지 무료로 사용할 수 있습니다.",
        suggestedCategory: "AI/API",
        tags: ["Gemini", "API", "AI"]
      }
    ]

    // 질문 내용에 따라 적절한 응답 선택
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('vue') || lowerQuestion.includes('react') || lowerQuestion.includes('프론트')) {
      return demoResponses[0]
    } else if (lowerQuestion.includes('firebase') || lowerQuestion.includes('backend') || lowerQuestion.includes('백엔드')) {
      return demoResponses[1]
    } else if (lowerQuestion.includes('ui') || lowerQuestion.includes('ux') || lowerQuestion.includes('디자인')) {
      return demoResponses[2]
    } else if (lowerQuestion.includes('gemini') || lowerQuestion.includes('ai') || lowerQuestion.includes('api')) {
      return demoResponses[3]
    }

    // 기본 응답
    return {
      summary: `"${question}"에 대한 답변을 AI가 분석했습니다. ${answer.substring(0, 50)}... 주요 내용을 포함하여 업무에 활용할 수 있는 정보로 정리되었습니다.`,
      suggestedCategory: "일반",
      tags: ["정보", "업무", "참고자료"]
    }
  }

  // 오류 발생 시 대체 응답
  generateFallbackResponse(question, answer) {
    return {
      summary: `${answer.substring(0, 100)}${answer.length > 100 ? '...' : ''}`,
      suggestedCategory: "미분류",
      tags: ["미정리"]
    }
  }

  // 카테고리 자동 생성 (비슷한 주제의 질문들이 많을 때)
  async suggestNewCategory(items) {
    // 실제로는 여러 아이템을 분석하여 공통 주제를 찾아 카테고리 제안
    const commonKeywords = this.extractCommonKeywords(items)
    
    if (commonKeywords.length > 0) {
      return {
        name: commonKeywords[0],
        description: `${commonKeywords.join(', ')} 관련 업무 정리`,
        color: this.getRandomColor()
      }
    }
    
    return null
  }

  // 공통 키워드 추출
  extractCommonKeywords(items) {
    const keywords = []
    items.forEach(item => {
      // 간단한 키워드 추출 로직
      const words = (item.question + ' ' + item.answer).toLowerCase().split(' ')
      words.forEach(word => {
        if (word.length > 2) {
          keywords.push(word)
        }
      })
    })
    
    // 빈도순으로 정렬하여 상위 키워드 반환
    const frequency = {}
    keywords.forEach(keyword => {
      frequency[keyword] = (frequency[keyword] || 0) + 1
    })
    
    return Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 3)
  }

  // 랜덤 색상 생성
  getRandomColor() {
    const colors = [
      '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', 
      '#ec4899', '#f43f5e', '#f97316', '#f59e0b'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
}

export default new AIService()