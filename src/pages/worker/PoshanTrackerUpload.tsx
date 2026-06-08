import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileUp,
  ListFilter,
  Radar as RadarIcon,
  RefreshCcw,
  Search,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  Users,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,
  Radar as RechartsRadar,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  analyzePoshanRecords,
  getSamplePoshanRecords,
  parsePoshanTrackerFile,
  type PoshanAnalysis,
  type PoshanBeneficiary,
  type PoshanDistributionPoint,
  type PoshanSeverity,
  type StuntingStatus,
  type UnderweightStatus,
  type WastingStatus,
} from '../../utils/poshanTracker';
import { cn } from '../../utils';

type ScreenMode = 'upload' | 'analyzing' | 'results';

const engineSteps = [
  'Parsing beneficiary records',
  'Normalizing AWC and sector metadata',
  'Computing growth screening scores',
  'Classifying stunting / wasting / underweight',
  'Running severity clustering',
  'Detecting high-risk cohorts',
  'Generating intervention priorities',
  'Compiling AI insights report',
];

const radarColors = ['#6edb8f', '#ef4444', '#f5c84b', '#8b6cf6', '#22d3ee', '#d9579a'];
const chartText = '#cbd5e1';
const gridStroke = 'rgba(148, 163, 184, 0.18)';
const panelClass = 'rounded-2xl border border-slate-700/70 bg-slate-900/72 shadow-xl shadow-slate-950/20';

const tooltipStyle = {
  backgroundColor: '#0f1b2d',
  border: '1px solid rgba(148, 163, 184, 0.28)',
  borderRadius: '12px',
  color: '#e2e8f0',
};

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function escapeCsv(value: string | number) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function PoshanTrackerUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ScreenMode>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [analysis, setAnalysis] = useState<PoshanAnalysis | null>(null);
  const [activeFileName, setActiveFileName] = useState('');

  const runAnalysis = async (records: PoshanBeneficiary[], fileName: string) => {
    if (!records.length) {
      toast.error('No beneficiary rows found. Check the sheet headers and try again.');
      return;
    }

    setMode('analyzing');
    setAnalysis(null);
    setActiveFileName(fileName);
    setProgress(0);
    setActiveStep(0);

    for (let index = 0; index < engineSteps.length; index += 1) {
      setActiveStep(index);
      setProgress(Math.round((index / engineSteps.length) * 100));
      await delay(230);
    }

    const nextAnalysis = analyzePoshanRecords(records, fileName);
    setProgress(100);
    setActiveStep(engineSteps.length);
    await delay(360);
    setAnalysis(nextAnalysis);
    setMode('results');
    toast.success(`Loaded ${records.length} beneficiaries from ${fileName}`);
  };

  const handleFile = async (file?: File) => {
    if (!file) return;

    try {
      const records = await parsePoshanTrackerFile(file);
      await runAnalysis(records, file.name);
    } catch (error) {
      toast.error('Could not read that file. Please upload a valid Excel or CSV export.');
      console.error(error);
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    void handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void handleFile(event.dataTransfer.files?.[0]);
  };

  const handleSampleData = () => {
    void runAnalysis(getSamplePoshanRecords(), 'sample-poshan-tracker.xlsx');
  };

  const downloadReport = () => {
    if (!analysis) return;

    const rows: Array<Array<string | number>> = [
      ['Poshan Tracker AI Report', analysis.fileName],
      ['Beneficiaries analyzed', analysis.summary.total],
      ['Children at risk', analysis.summary.atRisk],
      ['SAM cases', analysis.summary.sam],
      ['AWCs covered', analysis.summary.awcs],
      ['District risk index', analysis.summary.riskIndex],
      [],
      ['Insight', 'Metric', 'Recommendation'],
      ...analysis.insights.map((insight) => [insight.title, insight.metric, insight.body]),
      [],
      ['Beneficiary', 'AWC', 'Sector', 'Gender', 'Age months', 'Weight kg', 'Height cm', 'Stunted', 'Wasted', 'Underweight', 'Risk score'],
      ...analysis.records.map((record) => [
        record.beneficiary,
        record.awc,
        record.sector,
        record.gender,
        record.ageMonths,
        record.weightKg,
        record.heightCm,
        record.stunting,
        record.wasting,
        record.underweight,
        record.riskScore,
      ]),
    ];

    const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `poshan-ai-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="-m-4 min-h-[calc(100vh-4rem)] bg-[#06111f] p-4 text-slate-100 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      {mode === 'upload' && (
        <UploadState
          inputRef={inputRef}
          isDragging={isDragging}
          onDragState={setIsDragging}
          onDrop={handleDrop}
          onFileInput={handleFileInput}
          onSampleData={handleSampleData}
        />
      )}

      {mode === 'analyzing' && (
        <AnalysisState fileName={activeFileName} progress={progress} activeStep={activeStep} />
      )}

      {mode === 'results' && analysis && (
        <ResultsState
          analysis={analysis}
          onDownload={downloadReport}
          onNewFile={() => {
            setMode('upload');
            setAnalysis(null);
            setProgress(0);
            setActiveStep(0);
          }}
        />
      )}
    </div>
  );
}

function UploadState({
  inputRef,
  isDragging,
  onDragState,
  onDrop,
  onFileInput,
  onSampleData,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  onDragState: (dragging: boolean) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onFileInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onSampleData: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-center">
      <section className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
          <Sparkles className="h-4 w-4" />
          Worker nutrition intelligence
        </div>
        <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
          Upload your <span className="text-emerald-400">Poshan Tracker data</span>
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm font-semibold leading-6 text-slate-400 md:text-base">
          CSV or Excel export from your AWC. Data stays in your browser while the local AI workflow builds insights, risk groups, and intervention priorities.
        </p>
      </section>

      <section
        onDragOver={(event) => {
          event.preventDefault();
          onDragState(true);
        }}
        onDragLeave={() => onDragState(false)}
        onDrop={onDrop}
        className={cn(
          'mt-8 rounded-2xl border-2 border-dashed p-8 text-center transition-all md:p-12',
          isDragging
            ? 'border-emerald-300 bg-emerald-400/10 shadow-2xl shadow-emerald-950/30'
            : 'border-slate-700 bg-slate-900/70 shadow-xl shadow-slate-950/20'
        )}
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
          <UploadCloud className="h-10 w-10" />
        </div>
        <h3 className="mt-7 text-2xl font-black text-white">Upload beneficiary file</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-400">
          Drop a CSV or Excel file with columns like Beneficiary, AWC, Sector, Gender, Age (mo), Wt (kg), Ht (cm), Stunted, Wasted, Underweight.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.csv"
          className="hidden"
          onChange={onFileInput}
        />

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-300 active:scale-[0.99]"
          >
            <FileSpreadsheet className="h-5 w-5" />
            Choose file
          </button>
          <button
            type="button"
            onClick={onSampleData}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 text-sm font-black text-slate-200 transition hover:border-slate-500 hover:bg-slate-700 active:scale-[0.99]"
          >
            <FileUp className="h-5 w-5" />
            Try sample data
          </button>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left md:grid-cols-3">
          {[
            ['Accepted formats', 'XLSX, CSV'],
            ['Computed outputs', 'Status, risk, clusters'],
            ['Privacy model', 'Browser-only analysis'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="mt-2 text-sm font-bold text-slate-200">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AnalysisState({ fileName, progress, activeStep }: { fileName: string; progress: number; activeStep: number }) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/86 p-6 shadow-2xl shadow-emerald-950/20 md:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
            <BrainCircuit className="h-9 w-9" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Aagan Bari AI engine</h2>
            <p className="mt-1 text-sm font-semibold text-slate-400">Analyzing {fileName || 'beneficiary workbook'} - WHO-2006 aligned screening</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {engineSteps.map((step, index) => {
            const complete = index < activeStep;
            const active = index === activeStep;
            return (
              <div key={step} className={cn('flex items-center gap-4 text-sm font-bold', active ? 'text-emerald-300' : complete ? 'text-slate-200' : 'text-slate-600')}>
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border',
                    complete && 'border-emerald-400 bg-emerald-400/10 text-emerald-300',
                    active && 'border-emerald-300 text-emerald-300',
                    !complete && !active && 'border-slate-700 text-slate-700'
                  )}
                >
                  {complete ? <CheckCircle2 className="h-4 w-4" /> : active ? <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> : null}
                </span>
                <span>{step}</span>
                {active && <span className="ml-auto text-xs font-black uppercase tracking-widest text-emerald-400">running...</span>}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-amber-300 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Confidence model: v4.2</span>
            <span>{progress}%</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResultsState({ analysis, onDownload, onNewFile }: { analysis: PoshanAnalysis; onDownload: () => void; onNewFile: () => void }) {
  return (
    <div className="mx-auto max-w-[1540px] space-y-8 pb-10">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <BrainCircuit className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">AI analysis complete</p>
            <h2 className="mt-1 text-2xl font-black text-white">{analysis.fileName}</h2>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-black text-slate-950 transition hover:bg-emerald-300"
          >
            <Download className="h-5 w-5" />
            Download AI report
          </button>
          <button
            type="button"
            onClick={onNewFile}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 text-sm font-black text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
          >
            <RefreshCcw className="h-5 w-5" />
            New file
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Beneficiaries analyzed" value={analysis.summary.total} tone="emerald" />
        <MetricCard icon={AlertTriangle} label="Children at risk" value={analysis.summary.atRisk} tone="amber" />
        <MetricCard icon={ShieldAlert} label="Severe acute malnutrition" value={analysis.summary.sam} tone="red" />
        <MetricCard icon={Building2} label="AWCs covered" value={analysis.summary.awcs} tone="blue" />
      </section>

      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 shadow-xl shadow-slate-950/20">
        <div className="flex flex-wrap items-center gap-3">
          <Sparkles className="h-5 w-5 text-emerald-300" />
          <h3 className="text-xl font-black text-white">AI-generated insights</h3>
          <span className="text-sm font-bold text-slate-500">model v4.2 - confidence 0.91</span>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {analysis.insights.map((insight) => (
            <InsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </section>

      <SectionTitle icon={BarChart3} title="Overview" />
      <section className="grid gap-5 xl:grid-cols-4">
        <DonutPanel title="Stunting Distribution" data={analysis.distributions.stunting} />
        <DonutPanel title="Wasting Distribution" data={analysis.distributions.wasting} />
        <DonutPanel title="Underweight Distribution" data={analysis.distributions.underweight} />
        <DonutPanel title="Gender Split" data={analysis.distributions.gender} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <ChartPanel title="BMI vs Age - Cluster Analysis" dot="blue">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 18, right: 24, bottom: 18, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis type="number" dataKey="ageMonths" name="Age" unit=" mo" tick={{ fill: chartText }} stroke="#64748b" />
              <YAxis type="number" dataKey="bmi" name="BMI" tick={{ fill: chartText }} stroke="#64748b" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
              {(['normal', 'moderate', 'severe'] as PoshanSeverity[]).map((severity) => (
                <Scatter
                  key={severity}
                  name={severity[0].toUpperCase() + severity.slice(1)}
                  data={analysis.bmiScatter.filter((point) => point.severity === severity)}
                  fill={severity === 'normal' ? '#6edb8f' : severity === 'moderate' ? '#f5c84b' : '#ef4444'}
                />
              ))}
              <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Sector-wise Severity Distribution" dot="emerald">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysis.sectorSeverity} margin={{ top: 18, right: 20, bottom: 38, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="sector" tick={{ fill: chartText }} stroke="#64748b" angle={-18} textAnchor="end" height={56} />
              <YAxis allowDecimals={false} tick={{ fill: chartText }} stroke="#64748b" />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
              <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
              <Bar dataKey="normal" stackId="a" fill="#6edb8f" name="Normal" />
              <Bar dataKey="moderate" stackId="a" fill="#f5c84b" name="Moderate" />
              <Bar dataKey="severe" stackId="a" fill="#ef4444" name="Severe" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartPanel title="Malnutrition Severity Comparison" dot="emerald">
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={analysis.severityComparison} margin={{ top: 18, right: 22, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="band" tick={{ fill: chartText }} stroke="#64748b" />
              <YAxis allowDecimals={false} tick={{ fill: chartText }} stroke="#64748b" />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
              <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
              <Bar dataKey="stunting" fill="#ef4444" radius={[8, 8, 0, 0]} name="Stunting" />
              <Bar dataKey="wasting" fill="#f2ad3d" radius={[8, 8, 0, 0]} name="Wasting" />
              <Bar dataKey="underweight" fill="#8b6cf6" radius={[8, 8, 0, 0]} name="Underweight" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <PriorityActions analysis={analysis} />
      </section>

      <ChartPanel title="AWC-wise Nutritional Load (Top 10)" dot="blue">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={analysis.awcLoad} margin={{ top: 16, right: 24, bottom: 72, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="awc" interval={0} angle={-22} textAnchor="end" height={86} tick={{ fill: chartText, fontSize: 12 }} stroke="#64748b" />
            <YAxis allowDecimals={false} tick={{ fill: chartText }} stroke="#64748b" />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
            <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
            <Bar dataKey="stunted" stackId="risk" fill="#ef4444" name="Stunted" />
            <Bar dataKey="wasted" stackId="risk" fill="#f2ad3d" name="Wasted" />
            <Bar dataKey="underweight" stackId="risk" fill="#8b6cf6" name="Underweight" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>

      <section className="grid gap-5 xl:grid-cols-3">
        <ChartPanel title="Severity Radar" dot="violet">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={analysis.severityRadar}>
              <PolarGrid stroke="#64748b" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: chartText, fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: chartText, fontSize: 11 }} />
              <RechartsRadar dataKey="value" stroke="#6edb8f" fill="#6edb8f" fillOpacity={0.45} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Gender x Stunting" dot="amber">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysis.genderStunting} layout="vertical" margin={{ top: 24, right: 24, left: 16, bottom: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis type="number" allowDecimals={false} tick={{ fill: chartText }} stroke="#64748b" />
              <YAxis dataKey="gender" type="category" tick={{ fill: chartText }} stroke="#64748b" />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
              <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
              <Bar dataKey="normal" stackId="a" fill="#6edb8f" name="Normal" />
              <Bar dataKey="stunted" stackId="a" fill="#ef4444" name="Stunted" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Age Group Impact" dot="blue">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analysis.ageImpact} margin={{ top: 18, right: 24, bottom: 24, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="ageBand" tick={{ fill: chartText }} stroke="#64748b" />
              <YAxis allowDecimals={false} tick={{ fill: chartText }} stroke="#64748b" />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
              <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
              <Line type="monotone" dataKey="stunted" stroke="#ef4444" strokeWidth={3} name="stunted" />
              <Line type="monotone" dataKey="wasted" stroke="#f5c84b" strokeWidth={3} name="wasted" />
              <Line type="monotone" dataKey="underweight" stroke="#22d3ee" strokeWidth={3} name="underweight" />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <RadarSuite analysis={analysis} />

      <section className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <ChartPanel title="District Risk Index" dot="amber">
          <RiskGauge value={analysis.summary.riskIndex} />
        </ChartPanel>

        <ChartPanel title="Projected Recovery (180 days)" dot="emerald">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analysis.recoveryProjection} margin={{ top: 18, right: 24, bottom: 16, left: 0 }}>
              <defs>
                <linearGradient id="affectedArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="recoveredArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#6edb8f" stopOpacity={0.38} />
                  <stop offset="95%" stopColor="#6edb8f" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="day" tick={{ fill: chartText }} stroke="#64748b" />
              <YAxis allowDecimals={false} tick={{ fill: chartText }} stroke="#64748b" />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
              <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
              <Area type="monotone" dataKey="affected" stroke="#ef4444" fill="url(#affectedArea)" name="Affected (projected)" />
              <Area type="monotone" dataKey="recovered" stroke="#6edb8f" fill="url(#recoveredArea)" name="Recovered (projected)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <RecordsTable analysis={analysis} />
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof BarChart3; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-6 w-6 text-emerald-300" />
      <h3 className="text-3xl font-black text-emerald-300">{title}</h3>
      <div className="h-px flex-1 bg-emerald-500/20" />
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: number; tone: 'emerald' | 'amber' | 'red' | 'blue' }) {
  const toneClass = {
    emerald: 'bg-emerald-400/15 text-emerald-300',
    amber: 'bg-amber-400/15 text-amber-300',
    red: 'bg-red-400/15 text-red-300',
    blue: 'bg-blue-400/15 text-blue-300',
  }[tone];

  return (
    <article className={cn(panelClass, 'p-6')}>
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', toneClass)}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-5 text-4xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-400">{label}</p>
    </article>
  );
}

function InsightCard({ insight }: { insight: PoshanAnalysis['insights'][number] }) {
  const toneClass = {
    red: 'border-red-400/30 bg-red-500/10 text-red-300',
    amber: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
    blue: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
    emerald: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
    slate: 'border-slate-600 bg-slate-800/70 text-slate-300',
  }[insight.tone];

  return (
    <article className={cn('rounded-2xl border p-5', toneClass)}>
      <p className="text-sm font-black text-slate-100">{insight.title}</p>
      <p className="mt-2 text-2xl font-black text-white">{insight.metric}</p>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-400">{insight.body}</p>
    </article>
  );
}

function ChartPanel({ title, dot, children, className }: { title: string; dot: 'emerald' | 'amber' | 'red' | 'blue' | 'violet'; children: React.ReactNode; className?: string }) {
  const dotClass = {
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
    blue: 'bg-blue-400',
    violet: 'bg-violet-400',
  }[dot];

  return (
    <section className={cn(panelClass, 'p-5', className)}>
      <div className="mb-4 flex items-center gap-2">
        <span className={cn('h-3 w-3 rounded-full', dotClass)} />
        <h3 className="text-lg font-black text-slate-100">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function DonutPanel({ title, data }: { title: string; data: PoshanDistributionPoint[] }) {
  return (
    <ChartPanel title={title} dot={title.includes('Wasting') ? 'amber' : title.includes('Underweight') ? 'violet' : title.includes('Gender') ? 'blue' : 'red'}>
      <ResponsiveContainer width="100%" height={270}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={64} outerRadius={96} paddingAngle={2}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="#e2e8f0" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
          <Legend verticalAlign="bottom" formatter={(value) => <span className="text-slate-300">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

function PriorityActions({ analysis }: { analysis: PoshanAnalysis }) {
  return (
    <section className={cn(panelClass, 'p-5')}>
      <div className="mb-5 flex items-center gap-2">
        <Zap className="h-5 w-5 text-amber-300" />
        <h3 className="text-lg font-black text-slate-100">AI-recommended Priority Actions</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {analysis.priorityActions.map((action) => {
          const classes = {
            critical: 'border-red-500/40 bg-red-500/10 text-red-300',
            high: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
            medium: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
            routine: 'border-slate-700 bg-slate-800/70 text-slate-400',
          }[action.priority];

          return (
            <article key={action.title} className={cn('rounded-2xl border p-4', classes)}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.18em]">{action.priority}</p>
                <p className="text-xs font-black uppercase tracking-[0.18em]">{action.count} children</p>
              </div>
              <p className="mt-3 text-lg font-black text-slate-100">{action.title}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/30">
                <div className="h-full rounded-full bg-current" style={{ width: `${Math.min(100, action.progress)}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RadarSuite({ analysis }: { analysis: PoshanAnalysis }) {
  return (
    <section className="rounded-2xl border border-violet-500/35 bg-slate-900/72 p-5 shadow-xl shadow-slate-950/20">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <RadarIcon className="h-5 w-5 text-violet-300" />
        <h3 className="text-xl font-black text-white">Radar Intelligence Suite</h3>
        <span className="text-sm font-bold text-slate-500">multi-axis comparative analysis</span>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <RadarPanel title="AWC Comparison Radar (Top 6)" dot="violet" data={analysis.awcRadar} keysList={analysis.awcRadarKeys} />
        <ChartPanel title="Gender Radar - Male vs Female" dot="amber">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={analysis.genderRadar}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: chartText }} />
              <PolarRadiusAxis tick={{ fill: chartText, fontSize: 11 }} />
              <RechartsRadar dataKey="Male" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.2} />
              <RechartsRadar dataKey="Female" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
              <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Age-band Vulnerability Radar" dot="blue">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={analysis.ageRadar}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: chartText }} />
              <PolarRadiusAxis tick={{ fill: chartText, fontSize: 11 }} />
              <RechartsRadar dataKey="stunted" stroke="#ef4444" fill="#ef4444" fillOpacity={0.18} />
              <RechartsRadar dataKey="wasted" stroke="#f5c84b" fill="#f5c84b" fillOpacity={0.16} />
              <RechartsRadar dataKey="underweight" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.18} />
              <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <RadarPanel title="Sector Performance Radar" dot="emerald" data={analysis.sectorRadar} keysList={analysis.sectorRadarKeys} />
      </div>
    </section>
  );
}

function RadarPanel({ title, dot, data, keysList }: { title: string; dot: 'emerald' | 'violet'; data: Array<Record<string, string | number>>; keysList: string[] }) {
  return (
    <ChartPanel title={title} dot={dot}>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: chartText, fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: chartText, fontSize: 11 }} />
          {keysList.map((key, index) => (
            <RechartsRadar
              key={key}
              dataKey={key}
              stroke={radarColors[index % radarColors.length]}
              fill={radarColors[index % radarColors.length]}
              fillOpacity={0.1}
            />
          ))}
          <Legend formatter={(value) => <span className="text-slate-300">{value}</span>} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e2e8f0' }} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

function RiskGauge({ value }: { value: number }) {
  const riskLabel = value >= 70 ? 'High risk' : value >= 40 ? 'Moderate risk' : 'Low risk';
  return (
    <div className="relative flex h-[300px] items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart data={[{ value }]} startAngle={180} endAngle={0} innerRadius="72%" outerRadius="100%">
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" fill={value >= 70 ? '#ef4444' : value >= 40 ? '#f5c84b' : '#6edb8f'} background={{ fill: '#1f2d42' }} cornerRadius={18} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-x-0 top-[42%] text-center">
        <p className="text-5xl font-black text-white">{value}</p>
        <p className="mt-2 text-sm font-bold text-slate-400">{riskLabel}</p>
      </div>
    </div>
  );
}

function RecordsTable({ analysis }: { analysis: PoshanAnalysis }) {
  const [search, setSearch] = useState('');
  const [stuntingFilter, setStuntingFilter] = useState<'all' | StuntingStatus>('all');
  const [wastingFilter, setWastingFilter] = useState<'all' | WastingStatus>('all');
  const [underweightFilter, setUnderweightFilter] = useState<'all' | UnderweightStatus>('all');

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return analysis.records.filter((record) => {
      const matchesSearch = !query || [record.beneficiary, record.caregiver, record.awc, record.sector, record.gender].some((value) => value.toLowerCase().includes(query));
      const matchesStunting = stuntingFilter === 'all' || record.stunting === stuntingFilter;
      const matchesWasting = wastingFilter === 'all' || record.wasting === wastingFilter;
      const matchesUnderweight = underweightFilter === 'all' || record.underweight === underweightFilter;
      return matchesSearch && matchesStunting && matchesWasting && matchesUnderweight;
    });
  }, [analysis.records, search, stuntingFilter, wastingFilter, underweightFilter]);

  return (
    <section className={cn(panelClass, 'p-5')}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <ListFilter className="h-6 w-6 text-emerald-300" />
          <h3 className="text-2xl font-black text-emerald-300">Beneficiary Records</h3>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-black text-slate-400">{filteredRecords.length}/{analysis.records.length}</span>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_180px_180px_210px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, AWC, sector..."
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-12 pr-4 text-sm font-semibold text-slate-100 outline-none transition focus:border-emerald-400"
            />
          </div>
          <FilterSelect value={stuntingFilter} onChange={(value) => setStuntingFilter(value as 'all' | StuntingStatus)} options={['all', 'normal', 'moderately stunted', 'severely stunted']} />
          <FilterSelect value={wastingFilter} onChange={(value) => setWastingFilter(value as 'all' | WastingStatus)} options={['all', 'normal', 'MAM', 'SAM', 'overweight', 'obese']} />
          <FilterSelect value={underweightFilter} onChange={(value) => setUnderweightFilter(value as 'all' | UnderweightStatus)} options={['all', 'normal', 'moderately underweight', 'severely underweight']} />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-700">
        <table className="min-w-[1120px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-emerald-500/55 text-sm font-black uppercase tracking-[0.08em] text-white">
              <th className="px-4 py-4">#</th>
              <th className="px-4 py-4">Beneficiary</th>
              <th className="px-4 py-4">AWC</th>
              <th className="px-4 py-4">Sector</th>
              <th className="px-4 py-4">Gender</th>
              <th className="px-4 py-4">Age (mo)</th>
              <th className="px-4 py-4">Wt (kg)</th>
              <th className="px-4 py-4">Ht (cm)</th>
              <th className="px-4 py-4">Stunted</th>
              <th className="px-4 py-4">Wasted</th>
              <th className="px-4 py-4">Underweight</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={record.id} className="border-t border-slate-800 text-sm font-semibold text-slate-200">
                <td className="px-4 py-4 text-slate-500">{index + 1}</td>
                <td className="px-4 py-4">
                  <p className="font-black text-slate-100">{record.beneficiary}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{record.caregiver}</p>
                </td>
                <td className="px-4 py-4">{record.awc}</td>
                <td className="px-4 py-4">{record.sector}</td>
                <td className="px-4 py-4">{record.gender[0]}</td>
                <td className="px-4 py-4">{record.ageMonths}</td>
                <td className="px-4 py-4">{record.weightKg}</td>
                <td className="px-4 py-4">{record.heightCm}</td>
                <td className="px-4 py-4"><StatusPill value={record.stunting} /></td>
                <td className="px-4 py-4"><StatusPill value={record.wasting} /></td>
                <td className="px-4 py-4"><StatusPill value={record.underweight} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative block">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/70 px-4 pr-10 text-sm font-bold capitalize text-slate-200 outline-none transition focus:border-emerald-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 'all' ? 'All' : option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
    </label>
  );
}

function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const classes = normalized === 'normal'
    ? 'bg-emerald-500/18 text-emerald-300'
    : normalized.includes('severe') || normalized === 'sam'
      ? 'bg-red-500/18 text-red-300'
      : normalized.includes('moderate') || normalized === 'mam'
        ? 'bg-amber-500/18 text-amber-300'
        : 'bg-violet-500/18 text-violet-300';

  return (
    <span className={cn('inline-flex min-h-8 items-center rounded-full px-3 py-1 text-xs font-black capitalize', classes)}>
      {value}
    </span>
  );
}
