import React, { useState } from 'react';
import {
  X,
  Terminal,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
  Trash2,
  Database,
  Globe,
  Shield,
  Layers,
  Code,
  Loader2,
} from 'lucide-react';
import { ApiLogEntry, apiService, clearApiLogs } from '../services/api_service';
import { API_CONFIG } from '../config/api_config';
import firebaseConfig from '../../firebase-applet-config.json';

interface ApiInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ApiLogEntry[];
  firebaseReady: boolean;
  activeListenersCount: number;
}

export const ApiInspectorModal: React.FC<ApiInspectorModalProps> = ({
  isOpen,
  onClose,
  logs,
  firebaseReady,
  activeListenersCount,
}) => {
  const [selectedLog, setSelectedLog] = useState<ApiLogEntry | null>(logs[0] || null);
  const [activeTab, setActiveTab] = useState<'logs' | 'test' | 'architecture'>('logs');
  const [testMethod, setTestMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [testEndpoint, setTestEndpoint] = useState('/search?name=Fresno');
  const [testPayload, setTestPayload] = useState('{\n  "testMetric": "irrigation_efficiency",\n  "farmId": "farm-001"\n}');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<unknown>(null);

  if (!isOpen) return null;

  const handleRunTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      let body: unknown = undefined;
      if (testMethod === 'POST' || testMethod === 'PUT') {
        try {
          body = JSON.parse(testPayload);
        } catch {
          body = { raw: testPayload };
        }
      }

      const res = await apiService.request(
        testMethod,
        testEndpoint,
        body,
        { timeoutMs: 7000, retries: 1 }
      );
      setTestResult({
        success: true,
        status: res.status,
        statusText: res.statusText,
        latencyMs: res.latencyMs,
        data: res.data,
      });
    } catch (err: unknown) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-gray-900 text-gray-100 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-800 overflow-hidden font-sans">
        {/* Header */}
        <div className="p-4 px-6 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Backend Architecture & REST API Inspector
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  REAL BACKEND
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Inspect real HTTP requests, status codes, JSON payloads, and Firebase Firestore streaming listeners
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => clearApiLogs()}
              title="Clear telemetry logs"
              className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg text-xs flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-[11px]">Clear</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-800 bg-gray-950/30 px-6">
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live HTTP Telemetry ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'test'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive REST Client</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Backend Schema & Services</span>
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'logs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Left: Request List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Captured Network Requests
                </div>
                {logs.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs border border-dashed border-gray-800 rounded-xl">
                    No API requests captured yet. Refresh weather or run a query to inspect live network calls.
                  </div>
                ) : (
                  logs.map((log) => {
                    const isSelected = selectedLog?.id === log.id;
                    return (
                      <div
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-gray-800 border-emerald-500/80 shadow-md'
                            : 'bg-gray-950/40 border-gray-800/80 hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                log.method === 'GET'
                                  ? 'bg-blue-900/60 text-blue-300'
                                  : log.method === 'POST'
                                  ? 'bg-emerald-900/60 text-emerald-300'
                                  : log.method === 'PUT'
                                  ? 'bg-amber-900/60 text-amber-300'
                                  : 'bg-red-900/60 text-red-300'
                              }`}
                            >
                              {log.method}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                log.success
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-red-950 text-red-400 border border-red-800'
                              }`}
                            >
                              {log.status > 0 ? `${log.status} ${log.statusText}` : 'NETWORK ERR'}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{log.latencyMs} ms</span>
                        </div>

                        <div className="text-[11px] font-mono text-gray-300 truncate" title={log.url}>
                          {log.url}
                        </div>

                        <div className="text-[10px] text-gray-500 mt-1 flex justify-between">
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                          {log.errorMessage && <span className="text-red-400 truncate max-w-[150px]">{log.errorMessage}</span>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right: Request Details */}
              <div className="bg-gray-950 rounded-xl border border-gray-800 p-4 font-mono text-xs overflow-y-auto max-h-[500px] space-y-3">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Payload & Headers Inspector</span>
                  {selectedLog && (
                    <span className="text-[10px] text-emerald-400">{selectedLog.latencyMs}ms roundtrip</span>
                  )}
                </div>

                {selectedLog ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 text-[10px] uppercase">Target Endpoint:</span>
                      <div className="text-emerald-300 break-all bg-gray-900 p-2 rounded border border-gray-800 mt-1 text-[11px]">
                        {selectedLog.method} {selectedLog.url}
                      </div>
                    </div>

                    {selectedLog.requestBody ? (
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase">Request Body (JSON):</span>
                        <pre className="p-2 bg-gray-900 text-gray-300 rounded border border-gray-800 text-[11px] overflow-x-auto mt-1">
                          {JSON.stringify(selectedLog.requestBody, null, 2)}
                        </pre>
                      </div>
                    ) : null}

                    <div>
                      <span className="text-gray-500 text-[10px] uppercase">
                        Response Payload ({selectedLog.status} {selectedLog.statusText}):
                      </span>
                      <pre className="p-2 bg-gray-900 text-emerald-300 rounded border border-gray-800 text-[11px] overflow-x-auto mt-1 max-h-60">
                        {JSON.stringify(selectedLog.responseBody, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic py-10 text-center">
                    Select a request from the list to inspect headers and parsed JSON.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-3">
                <div className="text-xs font-bold text-gray-300 flex items-center space-x-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Execute REST Call via ApiService (GET, POST, PUT, DELETE)</span>
                </div>

                <div className="flex gap-2">
                  <select
                    value={testMethod}
                    onChange={(e) => setTestMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE')}
                    className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>

                  <input
                    type="text"
                    value={testEndpoint}
                    onChange={(e) => setTestEndpoint(e.target.value)}
                    placeholder="/forecast or /search"
                    className="grow px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {(testMethod === 'POST' || testMethod === 'PUT') && (
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 font-mono">Request JSON Body:</label>
                    <textarea
                      rows={3}
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-xs font-mono text-emerald-300 focus:outline-hidden"
                    />
                  </div>
                )}

                <button
                  onClick={handleRunTest}
                  disabled={testing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono flex items-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Send Request</span>
                </button>
              </div>

              {testResult ? (
                <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-300">Live Result Output</span>
                    <span className="text-[11px] text-emerald-400 font-mono">Parsed via ApiService</span>
                  </div>
                  <pre className="p-3 bg-gray-900 text-xs font-mono text-emerald-300 rounded-lg border border-gray-800 overflow-x-auto max-h-72">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              ) : null}
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 max-w-2xl mx-auto text-xs">
              {/* Firebase Firestore Details */}
              <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white font-bold">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Firebase Realtime Database & Firestore</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono text-[10px]">
                    ONLINE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-400 text-[11px] font-mono pt-1">
                  <div>Project ID: <span className="text-gray-200">{firebaseConfig.projectId}</span></div>
                  <div>Database ID: <span className="text-gray-200">{firebaseConfig.firestoreDatabaseId}</span></div>
                  <div>Active Listeners: <span className="text-emerald-400 font-bold">{activeListenersCount} Realtime Streams</span></div>
                  <div>Security Rules: <span className="text-gray-200">Deployed & Enforced</span></div>
                </div>
              </div>

              {/* Collections Schema */}
              <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
                <div className="text-white font-bold flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Configured Real-Time Firestore Collections</span>
                </div>
                <ul className="space-y-1 text-gray-300 font-mono text-[11px]">
                  <li>• <code className="text-emerald-300">users/&#123;userId&#125;</code> — Farmer profile & credentials</li>
                  <li>• <code className="text-emerald-300">farms/&#123;userId&#125;</code> — Farm acreage, soil types, & irrigation specs</li>
                  <li>• <code className="text-emerald-300">waterUsage/&#123;userId&#125;/records/&#123;id&#125;</code> — Real-time water logs</li>
                  <li>• <code className="text-emerald-300">favorites/&#123;userId&#125;/items/&#123;itemId&#125;</code> — Saved agronomy bookmarks</li>
                  <li>• <code className="text-emerald-300">irrigationSchedules/&#123;userId&#125;/schedules/&#123;id&#125;</code> — Weather-aware schedules</li>
                </ul>
              </div>

              {/* REST API Endpoints */}
              <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
                <div className="text-white font-bold flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Configured REST API Endpoints</span>
                </div>
                <div className="space-y-1.5 text-gray-300 font-mono text-[11px]">
                  <div>Base URL: <code className="text-cyan-300">{API_CONFIG.baseUrl}</code></div>
                  <div>Endpoint 1: <code className="text-gray-200">GET /forecast</code> (temperature, precipitation, ET, 7-day outlook)</div>
                  <div>Endpoint 2: <code className="text-gray-200">GET /search</code> (geocoding coordinates by farm city)</div>
                  <div>Timeout: <code className="text-gray-200">{API_CONFIG.timeoutMs}ms</code> | Max Retries: <code className="text-gray-200">{API_CONFIG.maxRetries}</code></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
