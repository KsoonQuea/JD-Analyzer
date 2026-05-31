export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)

  if (!parts?.length) {
    throw createError({ statusCode: 400, message: 'No file uploaded.' })
  }

  const filePart = parts.find(part => part.name === 'resume')
  if (!filePart?.data) {
    throw createError({ statusCode: 400, message: 'No resume file found in request.' })
  }

  const filename = filePart.filename ?? ''
  const buffer = filePart.data
  let text = ''

  if (filename.toLowerCase().endsWith('.pdf')) {
    const pdfParse = (await import('pdf-parse')).default
    const result = await pdfParse(buffer)
    text = result.text
  } else if (filename.toLowerCase().endsWith('.docx')) {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    text = result.value
  } else {
    throw createError({ statusCode: 400, message: 'Only PDF and DOCX files are supported.' })
  }

  if (!text.trim()) {
    throw createError({ statusCode: 422, message: 'Could not extract text from the file. Try a different format.' })
  }

  return { text: text.trim(), filename }
})
