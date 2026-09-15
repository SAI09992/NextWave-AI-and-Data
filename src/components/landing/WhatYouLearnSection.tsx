'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Database,
  FileText,
  Workflow,
  Search,
  Settings,
  Bot,
  Terminal,
} from 'lucide-react';

const learningModules = [
  {
    icon: Brain,
    title: 'LLM FUNDAMENTALS',
    desc: 'Deep dive into transformer architectures, tokenization, context windows, and foundational AI models.',
  },
  {
    icon: Database,
    title: 'VECTOR DATABASES',
    desc: 'Understanding embeddings, similarity search, and deploying databases like Pinecone or ChromaDB.',
  },
  {
    icon: FileText,
    title: 'PROMPT ENGINEERING',
    desc: 'Advanced techniques for few-shot prompting, chain-of-thought, and mitigating model hallucinations.',
  },
  {
    icon: Workflow,
    title: 'DATA PIPELINES',
    desc: 'Building robust ETL pipelines, data cleaning, and processing vast amounts of structured/unstructured data.',
  },
  {
    icon: Search,
    title: 'RAG ARCHITECTURE',
    desc: 'Retrieval-Augmented Generation: linking LLMs to private data for highly accurate, domain-specific outputs.',
  },
  {
    icon: Settings,
    title: 'MODEL FINE-TUNING',
    desc: 'Parameter-efficient fine-tuning (PEFT), LoRA, and adapting open-source models to specific use-cases.',
  },
  {
    icon: Bot,
    title: 'AGENTIC WORKFLOWS',
    desc: 'Creating autonomous AI agents that can use tools, plan tasks, and execute complex multi-step instructions.',
  },
  {
    icon: Terminal,
    title: 'CAPSTONE PROJECT',
    desc: 'A hands-on hackathon-style build where you will deploy a full-stack AI application from scratch.',
  },
];

export default function AboutSection() {
  return (
    <section id="experience" className="py-16 sm:py-24 relative border-t border-gray-800/60 bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono shadow-[0_0_10px_rgba(0,229,255,0.1)]">
            <Terminal className="w-3.5 h-3.5" />
            <span>// 05. WHAT YOU WILL LEARN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-sans text-white tracking-tight">
            8-MODULE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI SYLLABUS</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 font-sans max-w-2xl mx-auto">
            Eight core tactical domains engineered to transform students into job-ready AI & Data engineers.
          </p>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {learningModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 space-y-4 flex flex-col justify-between group font-sans shadow-lg"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300 shadow-[0_0_15px_rgba(0,229,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-auto text-[10px] text-cyan-500 flex items-center gap-2 font-mono font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                  <span>MODULE 0{idx + 1}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
