import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import { env } from '../config/env';
import { sequelize } from '../config/database';
import { CourseDocument, DocumentChunk } from '../models';

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 100;
const TOP_K = 5;

function getClient() {
  if (!env.openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey: env.openaiApiKey });
}

export function chunkText(text: string): string[] {
  const clean = text.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
  if (!clean) return [];
  const chunks: string[] = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + CHUNK_SIZE, clean.length);
    chunks.push(clean.slice(start, end).trim());
    if (end === clean.length) break;
    start = end - CHUNK_OVERLAP;
  }
  return chunks.filter(Boolean);
}

export async function extractText(filePath: string, mimeType: string, filename: string): Promise<string> {
  const ext = path.extname(filename).toLowerCase();
  if (mimeType === 'application/pdf' || ext === '.pdf') {
    const buffer = await fs.readFile(filePath);
    const parsed = await pdfParse(buffer);
    return parsed.text || '';
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === '.docx'
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  }
  if (mimeType.startsWith('text/') || ext === '.txt' || ext === '.md') {
    return fs.readFile(filePath, 'utf8');
  }
  throw new Error('Unsupported file type. Upload PDF, DOCX, TXT, or MD.');
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function ingestDocument(documentId: number) {
  const document = await CourseDocument.findByPk(documentId);
  if (!document) return;

  document.ingestStatus = 'processing';
  document.ingestError = null;
  await document.save();

  try {
    const text = await extractText(document.storagePath, document.mimeType, document.originalFilename);
    const chunks = chunkText(text);
    if (chunks.length === 0) {
      throw new Error('No text could be extracted from this file');
    }

    const client = getClient();
    const embeddingResponse = await client.embeddings.create({
      model: env.embedModel,
      input: chunks
    });

    await sequelize.transaction(async (transaction) => {
      await DocumentChunk.destroy({ where: { documentId: document.id }, transaction });
      await DocumentChunk.bulkCreate(
        chunks.map((content, index) => ({
          documentId: document.id,
          courseId: document.courseId,
          chunkIndex: index,
          content,
          embedding: embeddingResponse.data[index].embedding
        })),
        { transaction }
      );
    });

    document.ingestStatus = 'ready';
    document.ingestError = null;
    await document.save();
  } catch (error) {
    document.ingestStatus = 'failed';
    document.ingestError = error instanceof Error ? error.message : 'Ingest failed';
    await document.save();
  }
}

export async function retrieveCourseContext(courseId: number, query: string) {
  const chunks = await DocumentChunk.findAll({ where: { courseId } });
  if (chunks.length === 0) {
    return [];
  }

  const client = getClient();
  const queryEmbedding = await client.embeddings.create({
    model: env.embedModel,
    input: query
  });
  const vector = queryEmbedding.data[0].embedding;

  return chunks
    .map((chunk) => ({
      content: chunk.content,
      score: cosineSimilarity(vector, chunk.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);
}

export async function answerWithRag(courseTitle: string, question: string, contextChunks: { content: string }[]) {
  const client = getClient();
  const context = contextChunks.map((chunk, i) => `[Source ${i + 1}]\n${chunk.content}`).join('\n\n');
  const completion = await client.chat.completions.create({
    model: env.chatModel,
    messages: [
      {
        role: 'system',
        content:
          'You are a campus course assistant. Answer only using the provided course materials. If the materials do not contain the answer, say you do not have that information in the uploaded course resources. Do not invent campus policies or lecture content.'
      },
      {
        role: 'user',
        content: `Course: ${courseTitle}\n\nCourse materials:\n${context}\n\nStudent question:\n${question}`
      }
    ]
  });
  return completion.choices[0]?.message?.content?.trim() || 'I could not generate an answer.';
}
