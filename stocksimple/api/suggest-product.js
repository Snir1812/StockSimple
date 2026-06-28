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
    res.status(500).json({ error: 'Server is missing HUGGINGFACE_API_KEY' })
    return
  }

  const categoryList = Array.isArray(categories) ? categories.join(', ') : ''

  const prompt = `אתה עוזר לבעל עסק קטן בישראל לנהל מלאי מזון.
המוצר הוא: ${productName}
הקטגוריות הקיימות: ${categoryList}
החזר JSON בלבד ללא שום טקסט נוסף:
{ "category": string, "unit": string, "minQty": number }`

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 200, return_full_text: false },
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      res.status(502).json({ error: `Hugging Face API error: ${text}` })
      return
    }

    const data = await response.json()
    const text = Array.isArray(data) ? data[0]?.generated_text ?? '' : data.generated_text ?? ''
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
