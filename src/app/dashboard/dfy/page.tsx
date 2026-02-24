'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function DFYPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    productCategories: '',
    brandDescription: '',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getDFYProjects();
      setProjects(data);
    } catch (error: any) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDFYProject({
        ...newProject,
        productCategories: newProject.productCategories.split(',').map(c => c.trim()),
      });
      setShowCreateModal(false);
      setNewProject({
        businessName: '',
        industry: '',
        targetAudience: '',
        productCategories: '',
        brandDescription: '',
      });
      alert('DFY Store Builder project created! AI is generating your complete store...');
      loadProjects();
    } catch (error: any) {
      alert('Failed to create project: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Done-For-You Store Builder</h1>
          <p className="text-gray-600 mt-2">AI-powered complete store generation</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          + Create New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold mb-4">Build Your Store with AI</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Let AI create a complete e-commerce store for you - branding, products, content, and marketing materials. 
            Just provide your business details and watch the magic happen!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-semibold"
          >
            Start Building Your Store
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{project.businessName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.industry}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Target:</strong> {project.targetAudience}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>

              {project.status === 'COMPLETED' && project.data && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded mb-4">
                  <div className="text-sm text-gray-600 mb-2">Generated Assets:</div>
                  <div className="space-y-1">
                    {project.data.branding && (
                      <div className="text-xs">✅ Branding & Logo</div>
                    )}
                    {project.data.products && (
                      <div className="text-xs">✅ Product Catalog ({project.data.products.length} items)</div>
                    )}
                    {project.data.content && (
                      <div className="text-xs">✅ Content & Copy</div>
                    )}
                    {project.data.marketing && (
                      <div className="text-xs">✅ Marketing Materials</div>
                    )}
                  </div>
                </div>
              )}

              {project.status === 'IN_PROGRESS' && (
                <div className="bg-blue-50 p-4 rounded mb-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    <span className="text-sm text-blue-700">AI is building your store...</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => window.location.href = `/dashboard/dfy/${project.id}`}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm font-semibold"
              >
                View Project Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create DFY Store Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={newProject.businessName}
                    onChange={(e) => setNewProject({ ...newProject, businessName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., EcoLuxe Home"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <input
                    type="text"
                    value={newProject.industry}
                    onChange={(e) => setNewProject({ ...newProject, industry: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Home Decor, Fashion, Tech"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <input
                    type="text"
                    value={newProject.targetAudience}
                    onChange={(e) => setNewProject({ ...newProject, targetAudience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Eco-conscious millennials, age 25-40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Categories (comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={newProject.productCategories}
                    onChange={(e) => setNewProject({ ...newProject, productCategories: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Furniture, Lighting, Textiles"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Description
                  </label>
                  <textarea
                    value={newProject.brandDescription}
                    onChange={(e) => setNewProject({ ...newProject, brandDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe your brand vision, values, and unique selling proposition..."
                  />
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <strong>AI will generate:</strong> Complete branding, logo concepts, product catalog with descriptions and pricing, 
                  website content, email templates, and social media marketing materials.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  🚀 Start Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
