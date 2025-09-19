import React, { useState } from 'react'
import { Copy, Check, Code2, ExternalLink } from 'lucide-react'
import Modal from './ui/Modal'
import Button from './ui/Button'

const EmbedCode = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false)
  const [embedType, setEmbedType] = useState('iframe') // iframe, script, url

  const baseUrl = window.location.origin
  
  const embedCodes = {
    iframe: `<iframe 
      src="${baseUrl}?embed=true" 
      width="100%" 
      height="600" 
      frameborder="0" 
      title="Espresso World Map">
    </iframe>`,
    script: `<div id="espresso-map"></div>
    <script>
      (function() {
        var iframe = document.createElement('iframe');
        iframe.src = '${baseUrl}?embed=true';
        iframe.width = '100%';
        iframe.height = '600px';
        iframe.frameBorder = '0';
        iframe.title = 'Espresso World Map';
        document.getElementById('espresso-map').appendChild(iframe);
      })();
    </script>`,
    url: `${baseUrl}?embed=true`
  }
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // FIXED: Preview now uses correct embed URL with ?embed=true parameter
  const openPreview = () => {
    window.open(`${baseUrl}?embed=true`, '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Enhanced Header with Professional Design */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-t-xl">
          <div className="flex items-center space-x-4">
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Embed Espresso Map
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Add this interactive map to your website
              </p>
            </div>
          </div>
          <Button
            onClick={openPreview}
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2 bg-white/80 hover:bg-white dark:bg-slate-600 dark:hover:bg-slate-500 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <ExternalLink size={16} />
            <span>Preview</span>
          </Button>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 space-y-6">
          {/* Professional Embed Type Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
              Choose Embed Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  id: 'iframe', 
                  label: 'HTML iframe', 
                  desc: 'Simple and secure',
                  
                },
                { 
                  id: 'script', 
                  label: 'JavaScript', 
                  desc: 'More flexible',
                  
                },
                { 
                  id: 'url', 
                  label: 'Direct URL', 
                  desc: 'Custom implementations',
                  
                }
              ].map((type) => (
                <label 
                  key={type.id} 
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
                    embedType === type.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="embedType"
                    value={type.id}
                    checked={embedType === type.id}
                    onChange={(e) => setEmbedType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      {type.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {type.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Enhanced Code Display */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                Embed Code
              </label>
              <Button
                onClick={() => copyToClipboard(embedCodes[embedType])}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-green-600 dark:text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="relative">
              <pre className="bg-gray-900 dark:bg-gray-950 rounded-xl p-6 text-sm overflow-x-auto border border-gray-200 dark:border-gray-700 font-mono leading-relaxed">
                <code className="text-green-400 dark:text-green-300">
                  {embedCodes[embedType]}
                </code>
              </pre>
              <div className="absolute top-3 right-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Configuration Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Customization Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Width
                </label>
                <input
                  type="text"
                  defaultValue="100%"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           font-mono text-sm transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Height
                </label>
                <input
                  type="text"
                  defaultValue="600px"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           font-mono text-sm transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <input
                type="checkbox"
                id="responsive"
                defaultChecked
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 rounded"
              />
              <label htmlFor="responsive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Make responsive (recommended for all screen sizes)
              </label>
            </div>
          </div>

          
          
          

          
        </div>
      </div>
    </Modal>
  )
}

export default EmbedCode
