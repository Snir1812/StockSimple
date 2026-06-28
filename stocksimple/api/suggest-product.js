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

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' })
    return
  }

  const categoryList = Array.isArray(categories) ? categories.join(', ') : ''

  const prompt = `אתה עוזר לבעל עסק קטן בישראל לנהל מלאי מזון.
המוצר הוא: ${productName}
הקטגוריות הקיימות: ${categoryList}
החזר JSON בלבד ללא שום טקסט נוסף:
{ "category": string, "unit": string, "minQty": number }`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      res.status(502).json({ error: `Anthropic API error: ${text}` })
      return
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      res.status(502).json({ error: 'No JSON found in AI response' })
      return
    }

    const suggestion = JSON.parse(match[0])
    res.status(200).json(suggestion)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
