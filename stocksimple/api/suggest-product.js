const HF_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1'
const FETCH_TIMEOUT_MS = 10000

function getFallbackSuggestion(productName) {
  const name = productName.toLowerCase()
  if (/ירק|עגבניה|מלפפון|חסה/.test(name)) return { category: 'ירקות', unit: 'ק"ג', minQty: 5 }
  if (/לחם|פיתה|בגט/.test(name)) return { category: 'לחמניות', unit: 'יח\'', minQty: 10 }
  if (/שמן|רוטב/.test(name)) return { category: 'יבש', unit: 'ליטר', minQty: 3 }
  return { category: 'כללי', unit: 'יח\'', minQty: 5 }
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function callHuggingFace(prompt, apiKey) {
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 200, return_full_text: false },
    }),
  }

  let response = await fetchWithTimeout(HF_URL, options, FETCH_TIMEOUT_MS)

  if (response.status === 503) {
    const loadingBody = await response.text()
    console.error(`[suggest-product] model loading (503), retrying in 3s: ${loadingBody}`)
    await new Promise(resolve => setTimeout(resolve, 3000))
    response = await fetchWithTimeout(HF_URL, options, FETCH_TIMEOUT_MS)
  }

  return response
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { productName, categories } = req.body || {}

  if (!productName || !productName.trim()) {
    res.status(400).json({ error: 'productName is required' })
    return
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY
  if (!apiKey) {
    console.error('[suggest-product] Server is missing HUGGINGFACE_API_KEY')
    res.status(200).json(getFallbackSuggestion(productName))
    return
  }

  const categoryList = Array.isArray(categories) ? categories.join(', ') : ''

  const prompt = `אתה עוזר לבעל עסק קטן בישראל לנהל מלאי מזון.
המוצר הוא: ${productName}
הקטגוריות הקיימות: ${categoryList}
החזר JSON בלבד ללא שום טקסט נוסף:
{ "category": string, "unit": string, "minQty": number }`

  try {
    const response = await callHuggingFace(prompt, apiKey)

    if (!response.ok) {
      const text = await response.text()
      console.error(`[suggest-product] Hugging Face API error: status=${response.status} body=${text}`)
      res.status(200).json(getFallbackSuggestion(productName))
      return
    }

    const data = await response.json()
    const text = Array.isArray(data) ? data[0]?.generated_text ?? '' : data.generated_text ?? ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      console.error(`[suggest-product] No JSON found in AI response: ${text}`)
      res.status(200).json(getFallbackSuggestion(productName))
      return
    }

    const suggestion = JSON.parse(match[0])
    res.status(200).json(suggestion)
  } catch (err) {
    console.error(`[suggest-product] Unexpected error: ${err.name === 'AbortError' ? 'request timed out' : err.message}`)
    res.status(200).json(getFallbackSuggestion(productName))
  }
}
