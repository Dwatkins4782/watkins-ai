'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function StoreDetailsPage() {
  const params = useParams();
  const storeId = params.id as string;
  const [store, setStore] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    try {
      const [storeData, reportsData] = await Promise.all([
        api.getStore(storeId),
        api.getCrawlReports(storeId),
      ]);
      setStore(storeData);
      setReports(reportsData);
    } catch (error: any) {
      console.error('Failed to load store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrawl = async () => {
    try {
      await api.crawlWebsite(storeId);
      alert('Website crawl started! This may take a few minutes.');
      setTimeout(loadStoreData, 2000);
    } catch (error: any) {
      alert('Failed to start crawl: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleGenerateInsights = async () => {
    try {
      await api.generateInsights(storeId);
      alert('Generating AI insights! Check back in a moment.');
      setTimeout(loadStoreData, 2000);
    } catch (error: any) {
      alert('Failed to generate insights: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading store data...</div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Store not found</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Store Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{store.name}</h1>
            <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
              {store.url} ↗
            </a>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            store.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            store.status === 'SYNCING' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {store.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Products</div>
            <div className="text-3xl font-bold text-blue-600">{store._count?.products || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Orders</div>
            <div className="text-3xl font-bold text-green-600">{store._count?.orders || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Customers</div>
            <div className="text-3xl font-bold text-purple-600">{store._count?.customers || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
            <div className="text-sm opacity-90 mb-1">Profit Score</div>
            <div className="text-3xl font-bold">{store.profitScore || 'N/A'}/100</div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCrawl}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            🔍 Run Website Audit
          </button>
          <button
            onClick={handleGenerateInsights}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
          >
            ✨ Generate AI Insights
          </button>
        </div>
      </div>

      {/* Crawl Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold mb-4">Website Audit Reports</h2>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No audit reports yet</p>
            <p className="text-sm text-gray-500">Run your first website audit to get SEO analysis, brand voice extraction, and UX recommendations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Audit Report - {new Date(report.createdAt).toLocaleDateString()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    report.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    report.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </div>

                {report.status === 'COMPLETED' && report.data && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="text-sm text-gray-600">SEO Score</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {report.data.seoScore || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Pages Crawled</div>
                      <div className="text-2xl font-bold text-green-600">
                        {report.pagesCrawled || 0}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Issues Found</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {report.data.issuesFound || 0}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Audit Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {selectedReport.data ? (
                <div className="space-y-6">
                  {/* SEO Analysis */}
                  {selectedReport.data.seo && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">SEO Analysis</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(selectedReport.data.seo, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Brand Voice */}
                  {selectedReport.data.brandVoice && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Brand Voice</h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <p>{selectedReport.data.brandVoice}</p>
                      </div>
                    </div>
                  )}

                  {/* UX Issues */}
                  {selectedReport.data.uxIssues && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">UX Issues</h3>
                      <div className="space-y-2">
                        {selectedReport.data.uxIssues.map((issue: any, index: number) => (
                          <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p className="font-medium">{issue.title || issue}</p>
                            {issue.description && (
                              <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Data */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Complete Report Data</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <pre className="text-xs whitespace-pre-wrap overflow-auto">
                        {JSON.stringify(selectedReport.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No data available for this report</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
