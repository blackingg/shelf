"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiLock, FiGlobe, FiFolder } from "react-icons/fi";

export default function EditFolderPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Mock Fetch Data
  useEffect(() => {    
    // Simulating data fetch
    setName("Summer Reading List");
    setDescription("A collection of books I want to read this summer, focusing on self-improvement and fiction.");
    setIsPublic(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Updating folder:", {
      id: params.id,
      name,
      description,
      isPublic,
    });

    setIsLoading(false);
    router.push(`/app/folders/${params.id}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => router.back()}
          className="group group-hover:underline flex items-center space-x-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Folder</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <FiFolder className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Folder</h1>
                <p className="text-gray-500">Update your folder details and settings</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Folder Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none text-gray-900 font-medium placeholder-gray-400"
                placeholder="e.g. Summer Reading List"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none text-gray-900 font-medium placeholder-gray-400 resize-none"
                placeholder="What's this folder about?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4">
                Visibility
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex items-start space-x-4 p-4 rounded-xl border-2 transition-all text-left ${
                    !isPublic
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`mt-1 p-2 rounded-lg ${!isPublic ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-500"}`}>
                    <FiLock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-bold ${!isPublic ? "text-gray-900" : "text-gray-700"}`}>Private</p>
                    <p className="text-sm text-gray-500 mt-1">Only you can see this folder. It won&apos;t appear on your public profile.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex items-start space-x-4 p-4 rounded-xl border-2 transition-all text-left ${
                    isPublic
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`mt-1 p-2 rounded-lg ${isPublic ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                    <FiGlobe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-bold ${isPublic ? "text-emerald-900" : "text-gray-700"}`}>Public</p>
                    <p className="text-sm text-gray-500 mt-1">Anyone can see this folder. It will be visible on your public profile.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="flex items-center space-x-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-emerald-200"
              >
                {isLoading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
