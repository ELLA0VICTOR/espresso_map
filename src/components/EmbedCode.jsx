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

  const openPreview = () => {
    window.open(`${baseUrl}/embed`, '_blank', 'width=800,height=600')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Code2 size={24} className="text-espresso-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Embed Espresso Map
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add this interactive map to your website
              </p>
            </div>
          </div>
          <Button
            onClick={openPreview}
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ExternalLink size={16} />
            <span>Preview</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Embed Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Embed Type
            </label>
            <div className="flex space-x-4">
              {[
                { id: 'iframe', label: 'HTML iframe', desc: 'Simple and secure' },
                { id: 'script', label: 'JavaScript', desc: 'More flexible' },
                { id: 'url', label: 'Direct URL', desc: 'For custom implementations' }
              ].map((type) => (
                <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="embedType"
                    value={type.id}
                    checked={embedType === type.id}
                    onChange={(e) => setEmbedType(e.target.value)}
                    className="text-espresso-500 focus:ring-espresso-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
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

          {/* Code Display */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Embed Code
              </label>
              <Button
                onClick={() => copyToClipboard(embedCodes[embedType])}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
            
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto border border-gray-200 dark:border-gray-700">
                <code className="text-gray-800 dark:text-gray-200">
                  {embedCodes[embedType]}
                </code>
              </pre>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customization Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Width
                </label>
                <input
                  type="text"
                  defaultValue="100%"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-espresso-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Height
                </label>
                <input
                  type="text"
                  defaultValue="600px"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-espresso-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="responsive"
                defaultChecked
                className="text-espresso-500 focus:ring-espresso-500"
              />
              <label htmlFor="responsive" className="text-sm text-gray-700 dark:text-gray-300">
                Make responsive (recommended)
              </label>
            </div>
          </div>

          {/* Features List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Included Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Interactive world map',
                'Event timeline strip',
                'Search and filtering',
                'Event details modal',
                'Mobile responsive',
                'Dark mode support',
                'Keyboard navigation',
                'Screen reader friendly'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              How to Use
            </h4>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>1. Copy the embed code above</li>
              <li>2. Paste it into your website's HTML</li>
              <li>3. Adjust width and height as needed</li>
              <li>4. Test on different devices for responsiveness</li>
            </ol>
          </div>

          {/* Support */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Need help with integration?{' '}
              <a href="#" className="text-espresso-600 hover:text-espresso-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default EmbedCode