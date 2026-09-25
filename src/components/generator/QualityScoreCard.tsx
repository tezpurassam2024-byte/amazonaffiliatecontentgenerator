import React from 'react';
import { Award, CheckCircle, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { ContentQualityScore } from '../../types';

interface QualityScoreCardProps {
  score: ContentQualityScore;
}

export const QualityScoreCard: React.FC<QualityScoreCardProps> = ({ score }) => {
  const getBadgeColor = (val: number) => {
    if (val >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getBarColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Content Quality & SEO Score</h3>
            <p className="text-xs text-slate-500">
              Evaluated against search engine guidelines & affiliate editorial standards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-bold ${getBadgeColor(
              score.overall_score
            )}`}
          >
            <span>Overall Score:</span>
            <span className="text-base">{score.overall_score} / 100</span>
          </div>
        </div>
      </div>

      {/* 5 Dimension Progress Grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>SEO Score</span>
            <span className="font-bold text-slate-900">{score.seo_score}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                score.seo_score
              )}`}
              style={{ width: `${score.seo_score}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Readability</span>
            <span className="font-bold text-slate-900">{score.readability_score}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                score.readability_score
              )}`}
              style={{ width: `${score.readability_score}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Keywords</span>
            <span className="font-bold text-slate-900">{score.keyword_optimization}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                score.keyword_optimization
              )}`}
              style={{ width: `${score.keyword_optimization}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Completeness</span>
            <span className="font-bold text-slate-900">{score.content_completeness}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                score.content_completeness
              )}`}
              style={{ width: `${score.content_completeness}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Affiliate Ready</span>
            <span className="font-bold text-slate-900">{score.affiliate_readiness}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                score.affiliate_readiness
              )}`}
              style={{ width: `${score.affiliate_readiness}%` }}
            />
          </div>
        </div>
      </div>

      {/* Explanations & Actionable Tips */}
      <div className="mt-5 space-y-2.5">
        {score.explanations.map((exp, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <span className="font-bold text-slate-900">{exp.category}: </span>
              <span className="text-slate-600">{exp.feedback}</span>
            </div>
            <div className="text-[11px] text-slate-400 italic sm:text-right">
              {exp.tips?.[0]}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-400 italic">
        * Note: Quality scores reflect editorial structure and completeness best practices and do
        not guarantee search engine rankings.
      </p>
    </div>
  );
};
