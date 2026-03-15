import { useState } from 'react';
import { Copy, Download, Bot, Check, Sparkles } from 'lucide-react';
import { generateQimenPrompt } from '@/lib/prompt-template';

/**
 * 构建导出 JSON — 整合盘面所有信息
 */
function buildExportJSON(qMDJData: any, trueSolarInfo?: { offsetMinutes: number; longitude: number } | null) {
  if (!qMDJData) return {};

  const gongDetails: Record<string, any> = {};
  if (qMDJData.jiuGongAnalysis) {
    for (let i = 1; i <= 9; i++) {
      const g = qMDJData.jiuGongAnalysis[i];
      if (!g) continue;
      gongDetails[`${i}宫_${g.gongName || ''}`] = {
        方位: g.direction,
        九星: g.xing,
        九星别名: g.xingAlias || undefined,
        八门: g.men,
        八神: g.shen,
        天盘干: qMDJData.sanQiLiuYi?.[i] || '',
        吉凶: g.jiXiongText || '平',
      };
    }
  }

  return {
    排盘系统: '奇门遁甲',
    基础信息: {
      公历: qMDJData.basicInfo?.date,
      农历: qMDJData.basicInfo?.lunarDate,
      排盘类型: qMDJData.basicInfo?.type,
      排盘方法: qMDJData.basicInfo?.method,
      排盘目的: qMDJData.basicInfo?.purpose,
      地点: qMDJData.basicInfo?.location,
      ...(trueSolarInfo ? {
        真太阳时: {
          经度: trueSolarInfo.longitude,
          修正量_分钟: trueSolarInfo.offsetMinutes,
        },
      } : {}),
    },
    四柱: {
      年柱: qMDJData.siZhu?.year,
      月柱: qMDJData.siZhu?.month,
      日柱: qMDJData.siZhu?.day,
      时柱: qMDJData.siZhu?.time,
    },
    局数: qMDJData.juShu,
    旬首: qMDJData.xunShou,
    值符: {
      九星: qMDJData.zhiFuXing,
      宫位: qMDJData.zhiFuGong,
    },
    值使: {
      八门: qMDJData.zhiShiMen,
      宫位: qMDJData.zhiShiGong,
    },
    九宫详解: gongDetails,
    综合分析: qMDJData.analysis || {},
  };
}

export function JsonExportPanel({
  qMDJData,
  trueSolarInfo,
}: {
  qMDJData: any;
  trueSolarInfo?: { offsetMinutes: number; longitude: number } | null;
}) {
  const [copied, setCopied] = useState<'json' | 'prompt' | null>(null);

  if (!qMDJData) return null;

  const exportData = buildExportJSON(qMDJData, trueSolarInfo);
  const compactJson = JSON.stringify(exportData);
  const prettyJson = JSON.stringify(exportData, null, 2);

  const showCopied = (type: 'json' | 'prompt') => {
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(compactJson);
      showCopied('json');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = compactJson;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showCopied('json');
    }
  };

  const handleCopyPrompt = async () => {
    try {
      const prompt = generateQimenPrompt(exportData);
      await navigator.clipboard.writeText(prompt);
      showCopied('prompt');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = generateQimenPrompt(exportData);
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showCopied('prompt');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prettyJson], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = qMDJData.basicInfo?.date?.replace(/\s+/g, '_').replace(/[^\w-]/g, '') || 'qmdj';
    a.download = `qimen_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const btnBase =
    'flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer';

  return (
    <div className="space-y-3">
      {/* 状态提示 */}
      <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2.5 py-1.5 rounded-lg">
        <Sparkles className="w-3 h-3" />
        已准备好喂 AI
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-3 gap-2">
        <button onClick={handleDownload} className={`${btnBase} bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40`}>
          <Download className="w-3.5 h-3.5" />
          导出
        </button>
        <button onClick={handleCopyJSON} className={`${btnBase} bg-secondary/70 hover:bg-secondary border border-border/40 ${copied === 'json' ? 'text-green-400 border-green-500/40' : 'text-muted-foreground hover:text-foreground'}`}>
          {copied === 'json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied === 'json' ? '已复制' : '复制 JSON'}
        </button>
        <button onClick={handleCopyPrompt} className={`${btnBase} bg-[var(--color-gold)]/90 hover:bg-[var(--color-gold)] text-black font-semibold shadow-md shadow-amber-900/20 ${copied === 'prompt' ? 'bg-green-500 text-white' : ''}`}>
          {copied === 'prompt' ? <Check className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
          {copied === 'prompt' ? '已复制' : 'AI Prompt'}
        </button>
      </div>

      {/* JSON 预览 */}
      <div className="rounded-lg bg-secondary/30 border border-border/30 p-2.5 max-h-36 overflow-y-auto scrollbar-thin">
        <pre className="text-[10px] text-muted-foreground/70 whitespace-pre-wrap break-all font-mono leading-relaxed select-all">
          {prettyJson.slice(0, 2000)}{prettyJson.length > 2000 ? '\n...' : ''}
        </pre>
      </div>
    </div>
  );
}
