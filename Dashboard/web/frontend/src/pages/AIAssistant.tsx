import { useMemo, useState } from 'react';
import { BrainCircuit, Image, MessageCircle, SendHorizontal, Sparkles } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Page } from '../components/Page';
import { Panel } from '../components/Panel';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import type { PageProps } from '../services/types';

const prompts = [
  'What should I do today for this crop?',
  'How should irrigation be adjusted this week?',
  'What is the current market advice?',
  'Summarize the image diagnosis.',
];

export function AIAssistant({ data }: PageProps) {
  const [activePrompt, setActivePrompt] = useState(prompts[0]);
  const recommendations = useMemo(() => data.aiRecommendations.slice(0, 8), [data.aiRecommendations]);
  const activeRecommendation =
    recommendations.find((row) => row.FarmerQuestion === activePrompt)?.RecommendationText ??
    recommendations[0]?.RecommendationText ??
    'Smart Agriculture Intelligence is ready.';
  const available = recommendations.filter((row) => row.AssistantAvailability === 'Available').length;
  const busy = recommendations.filter((row) => row.AssistantAvailability === 'Busy').length;

  return (
    <Page title="AI Assistant" eyebrow="AgriNova AI Assistant" signal="Smart Agriculture Intelligence online">
      <section className="dashboard-grid">
        <div className="col-span-2"><StatCard label="AI Engine" value="Online" detail="Smart Agriculture Intelligence" icon={BrainCircuit} tone="cyan" /></div>
        <div className="col-span-2"><StatCard label="Responses" value={recommendations.length} detail="Recommendation records" icon={MessageCircle} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Available" value={available} detail={`${busy} busy channels`} icon={SendHorizontal} tone="violet" /></div>
        <div className="col-span-2"><StatCard label="Vision Module" value="Ready" detail="Image diagnosis" icon={Image} tone="amber" /></div>
        <div className="col-span-2"><StatCard label="Crop Advice" value="Live" detail="Crop guidance" icon={Sparkles} tone="emerald" /></div>
        <div className="col-span-2"><StatCard label="Market Advice" value="Live" detail="Price guidance" icon={MessageCircle} tone="cyan" /></div>

        <Panel title="Assistant Console" subtitle="Crop, irrigation, market, and vision guidance" className="col-span-8 assistant-panel">
          <div className="assistant-console">
            <div className="assistant-orbit">
              <Sparkles className="h-6 w-6" />
              <span>AI</span>
            </div>
            <div className="chat-box">
              <div className="chat-message assistant-message">
                <div className="mb-3 flex flex-wrap gap-2">
                  <StatusBadge label="AgriNova AI Assistant" status="Online" />
                  <StatusBadge label="AI Engine" status="Online" />
                </div>
                {activeRecommendation}
              </div>
              <div className="prompt-dock">
                <input className="chat-input" value={activePrompt} onChange={(event) => setActivePrompt(event.target.value)} aria-label="Assistant prompt" />
                <button className="action-button" type="button" aria-label="Send prompt">
                  <SendHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Suggested Questions" subtitle="Operational decision prompts" className="col-span-4">
          <div className="prompt-list">
            {prompts.map((prompt) => (
              <button key={prompt} type="button" className="prompt-chip" onClick={() => setActivePrompt(prompt)}>
                <MessageCircle className="h-4 w-4" />
                {prompt}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Recommendation Feed" subtitle="Latest Smart Agriculture Intelligence records" className="col-span-12">
          <DataTable
            rows={recommendations}
            columns={[
              { key: 'RecommendationID', label: 'ID' },
              { key: 'FarmID', label: 'Farm' },
              { key: 'InteractionType', label: 'Type' },
              { key: 'FarmerQuestion', label: 'Question' },
              { key: 'RecommendationText', label: 'Response' },
              { key: 'AssistantAvailability', label: 'Availability' },
            ]}
          />
        </Panel>
      </section>
    </Page>
  );
}
