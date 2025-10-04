import { useState, useEffect } from 'react'
import './ConversationLogs.css'

const ConversationLogs = () => {
  const [conversations, setConversations] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
      const response = await fetch(`${API_URL}/conversations`)
      const data = await response.json()

      if (data.success) {
        setConversations(data.conversations)
      } else {
        console.error('Failed to load conversations:', data.message)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      // Fallback to localStorage
      const logs = JSON.parse(localStorage.getItem('ayush_ai_conversations') || '[]')
      setConversations(logs.reverse())
    }
  }

  const clearLogs = async () => {
    if (window.confirm('Are you sure you want to clear all conversation logs from the database?')) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const response = await fetch(`${API_URL}/conversations`, {
          method: 'DELETE'
        })
        const data = await response.json()

        if (data.success) {
          setConversations([])
          localStorage.removeItem('ayush_ai_conversations')
          alert(data.message)
        }
      } catch (error) {
        console.error('Error clearing conversations:', error)
        alert('Failed to clear conversations')
      }
    }
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(conversations, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ayush-ai-logs-${new Date().toISOString()}.json`
    link.click()
  }

  const filteredConversations = conversations.filter(conv =>
    conv.question.toLowerCase().includes(filter.toLowerCase()) ||
    conv.answer.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="logs-container">
      <div className="logs-header">
        <h1>💬 Ayush AI Conversation Logs</h1>
        <p className="logs-subtitle">Total conversations: {conversations.length}</p>
      </div>

      <div className="logs-actions">
        <input
          type="text"
          placeholder="Filter conversations..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
        <div className="action-buttons">
          <button onClick={loadConversations} className="btn-refresh">
            🔄 Refresh
          </button>
          <button onClick={exportLogs} className="btn-export">
            📥 Export JSON
          </button>
          <button onClick={clearLogs} className="btn-clear">
            🗑️ Clear All
          </button>
        </div>
      </div>

      <div className="conversations-list">
        {filteredConversations.length === 0 ? (
          <div className="empty-state">
            <p>📭 No conversations yet!</p>
          </div>
        ) : (
          filteredConversations.map((conv, index) => (
            <div key={index} className="conversation-card">
              <div className="conv-header">
                <span className="conv-time">
                  {new Date(conv.timestamp).toLocaleString()}
                </span>
                <span className="conv-number">#{conversations.length - index}</span>
              </div>
              <div className="conv-question">
                <strong>❓ Question:</strong>
                <p>{conv.question}</p>
              </div>
              <div className="conv-answer">
                <strong>💬 Answer:</strong>
                <p>{conv.answer}</p>
              </div>
              {conv.userAgent && (
                <div className="conv-meta">
                  <small>🖥️ {conv.userAgent.substring(0, 100)}...</small>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ConversationLogs
