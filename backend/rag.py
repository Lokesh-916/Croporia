from __future__ import annotations

from pathlib import Path
from typing import Optional

from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable

from backend.config import settings


class FarmingRAG:
  """
  RAG pipeline for Croporia's 'Talk to Experts' feature.

  - Loads content from Farming_Data.md
  - Splits into overlapping chunks
  - Builds / loads a FAISS vectorstore
  - Exposes a retrieval QA chain that FastAPI can call
  """

  def __init__(self) -> None:
    self._vectorstore: Optional[FAISS] = None
    self._chain: Optional[Runnable] = None

  @property
  def vectorstore_path(self) -> Path:
    settings.vectorstore_dir.mkdir(parents=True, exist_ok=True)
    return settings.vectorstore_dir / "faiss_index"

  def _load_documents(self) -> list:
    """
    Load the Farming_Data.md file into LangChain documents.

    This assumes the user will eventually fill Farming_Data.md with
    high-quality farming knowledge for the RAG system.
    """
    md_path = settings.farming_markdown_path
    if not md_path.exists():
      raise FileNotFoundError(
        f"Farming data file not found at {md_path}. "
        "Please make sure Farming_Data.md exists and is saved."
      )

    loader = TextLoader(str(md_path), encoding="utf-8")
    return loader.load()

  def _build_vectorstore(self) -> FAISS:
    """
    Build or reload the FAISS vectorstore from the markdown data.
    """
    documents = self._load_documents()

    splitter = RecursiveCharacterTextSplitter(
      chunk_size=settings.chunk_size,
      chunk_overlap=settings.chunk_overlap,
      separators=["\n\n", "\n", ".", " "],
    )
    splits = splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings(model=settings.embedding_model)

    vectorstore = FAISS.from_documents(splits, embeddings)
    vectorstore.save_local(str(self.vectorstore_path))

    self._vectorstore = vectorstore
    return vectorstore

  def load_or_create_vectorstore(self) -> FAISS:
    """
    Try to load a persisted FAISS index, otherwise build a new one.
    """
    if self._vectorstore is not None:
      return self._vectorstore

    if self.vectorstore_path.exists():
      embeddings = OpenAIEmbeddings(model=settings.embedding_model)
      self._vectorstore = FAISS.load_local(
        str(self.vectorstore_path),
        embeddings,
        allow_dangerous_deserialization=True,
      )
      return self._vectorstore

    return self._build_vectorstore()

  @staticmethod
  def _build_prompt() -> ChatPromptTemplate:
    """
    System prompt that keeps answers short but valuable, grounded in context.
    """
    system_prompt = """
You are an agronomy and farm-management expert helping users of the Croporia app.

Your job:
- Use ONLY the information in the provided context to answer.
- If the context does not contain enough detail, say that clearly and suggest what extra field information is needed (e.g., soil type, region, crop stage).
- Focus on practical, field-ready guidance that a real farmer can apply.

Crop coverage:
- You only know about crops, regions and practices that appear in the context.
- If the user asks about a crop, variety, region or practice that is NOT present in the context, explicitly say you do not have information for that and do not try to improvise.

Style:
- Answer **briefly but with real value**: usually 3–6 concise bullet points.
- Prefer clear, step-by-step actions over theory.
- When numbers or doses are in the context, repeat them exactly and do not invent new ones.

Safety:
- Do NOT guess pesticide doses, fertiliser rates, or chemical mixes if they are not explicitly in the context.
- Do NOT rely on your own outside knowledge; if something is not in the context, say you are not sure based on current data.
- If the user asks about something outside the context, say you are not sure based on current data and invite them to share more details or consult a local expert.

Always respond in the same language as the user, using simple words a farmer can understand.

Context:
{context}
"""
    template = ChatPromptTemplate.from_messages(
      [
        ("system", system_prompt),
        ("human", "{question}"),
      ]
    )
    return template

  def build_chain(self) -> Runnable:
    """
    Build the end-to-end RAG chain:
      user question -> retriever -> stuffed docs -> Chat model.
    """
    if self._chain is not None:
      return self._chain

    vectorstore = self.load_or_create_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": settings.top_k})

    llm = ChatOpenAI(
      model=settings.chat_model,
      temperature=0.2,
    )

    prompt = self._build_prompt()
    document_chain = create_stuff_documents_chain(llm=llm, prompt=prompt)
    self._chain = create_retrieval_chain(retriever, document_chain)
    return self._chain

  def ingest(self) -> dict:
    """
    Public method to (re)build the vectorstore from the latest Farming_Data.md.
    """
    vectorstore = self._build_vectorstore()
    return {
      "status": "ok",
      "documents_indexed": vectorstore.index.ntotal,
      "source_path": str(settings.farming_markdown_path),
    }

  def ask(self, question: str) -> dict:
    """
    Run the RAG chain for a given user question.
    """
    chain = self.build_chain()
    result = chain.invoke({"question": question})

    answer = result.get("answer", "")
    context_docs = result.get("context", []) or []

    sources = []
    for doc in context_docs:
      metadata = doc.metadata or {}
      sources.append(
        {
          "source": metadata.get("source", str(settings.farming_markdown_path)),
          "start_index": metadata.get("start_index"),
        }
      )

    return {
      "answer": answer,
      "sources": sources,
    }


rag_pipeline = FarmingRAG()

