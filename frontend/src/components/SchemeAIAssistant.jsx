import React, { useState } from 'react';
import api from '../services/api';

const SchemeAIAssistant = ({ scheme, onClose }) => {
  const [activeTab, setActiveTab] = useState('eligibility');
  const [loading, setLoading] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userInfo, setUserInfo] = useState({
    age: '',
    state: '',
    income: '',
    occupation: '',
    maritalStatus: '',
  });

  const checkEligibility = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/schemes/ai/eligibility', {
        schemeId: scheme._id,
        userInfo,
      });
      setEligibilityResult(response.data.eligibility);
    } catch (error) {
      console.error('Error checking eligibility:', error);
      alert('Failed to check eligibility');
    } finally {
      setLoading(false);
    }
  };

  const getDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/schemes/ai/documents/${scheme._id}`);
      setDocuments(response.data.guidance);
    } catch (error) {
      console.error('Error getting documents:', error);
      alert('Failed to get document guidance');
    } finally {
      setLoading(false);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/api/schemes/ai/ask', {
        schemeId: scheme._id,
        question,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Likely Eligible') return 'text-green-600 bg-green-50';
    if (status === 'May Be Eligible') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">🤖 AI Assistant</h2>
            <p className="text-sm text-gray-600">{scheme.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`flex-1 py-3 px-4 font-medium ${
              activeTab === 'eligibility'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ✅ Check Eligibility
          </button>
          <button
            onClick={() => {
              setActiveTab('documents');
              if (!documents) getDocuments();
            }}
            className={`flex-1 py-3 px-4 font-medium ${
              activeTab === 'documents'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📄 Documents
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`flex-1 py-3 px-4 font-medium ${
              activeTab === 'ask'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            💬 Ask AI
          </button>
        </div>

        <div className="p-6">
          {/* Eligibility Tab */}
          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                Tell us about yourself to check if you're eligible for this scheme:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={userInfo.age}
                    onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your age"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={userInfo.state}
                    onChange={(e) => setUserInfo({ ...userInfo, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                  <input
                    type="text"
                    value={userInfo.income}
                    onChange={(e) => setUserInfo({ ...userInfo, income: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Below 3 lakhs"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={userInfo.occupation}
                    onChange={(e) => setUserInfo({ ...userInfo, occupation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Farmer, Student"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    value={userInfo.maritalStatus}
                    onChange={(e) => setUserInfo({ ...userInfo, maritalStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widow">Widow</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
              </div>

              <button
                onClick={checkEligibility}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Checking...' : '🔍 Check Eligibility'}
              </button>

              {eligibilityResult && (
                <div className={`mt-4 p-4 rounded-lg ${getStatusColor(eligibilityResult.status)}`}>
                  <h3 className="font-bold text-lg mb-2">{eligibilityResult.status}</h3>
                  <p className="mb-3">{eligibilityResult.explanation}</p>
                  {eligibilityResult.missingInfo && eligibilityResult.missingInfo.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">Additional information needed:</p>
                      <ul className="list-disc list-inside">
                        {eligibilityResult.missingInfo.map((info, idx) => (
                          <li key={idx}>{info}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-gray-600">Getting document requirements...</p>
                </div>
              ) : documents ? (
                <>
                  <h3 className="font-bold text-lg mb-3">Required Documents</h3>
                  <div className="space-y-3">
                    {documents.documents.map((doc, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-1">📎 {doc.name}</h4>
                        <p className="text-sm text-gray-600 mb-2"><strong>Purpose:</strong> {doc.purpose}</p>
                        <p className="text-sm text-gray-600"><strong>How to obtain:</strong> {doc.howToObtain}</p>
                      </div>
                    ))}
                  </div>
                  
                  {documents.generalTips && documents.generalTips.length > 0 && (
                    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">💡 General Tips</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                        {documents.generalTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-600">Click the Documents tab to load requirements.</p>
              )}
            </div>
          )}

          {/* Ask AI Tab */}
          {activeTab === 'ask' && (
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                Ask any question about this scheme and our AI will help you:
              </p>
              
              <div>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
                  placeholder="e.g., How do I apply for this scheme? What are the benefits?"
                />
              </div>

              <button
                onClick={askAI}
                disabled={loading || !question.trim()}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Thinking...' : '💬 Ask AI'}
              </button>

              {answer && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">AI Answer:</h4>
                  <p className="text-green-800">{answer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemeAIAssistant;
