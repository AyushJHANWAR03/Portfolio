import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import './AyushAI.css'

const AyushAI = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const chatRef = useRef(null)

  const genAI = new GoogleGenerativeAI('AIzaSyByyb3Ir5FESw9Cjd0tvQlcRkrTMIFaf-c')

  const suggestedQuestions = [
    "Where do you live?",
    "What's your hometown?",
    "Who are your favorite stand-up comedians?",
    "What do you do for fun?",
    "Tell me about your hobbies",
    "What technologies do you work with?"
  ]

  const systemContext = `You are Ayush Jhanwar's AI assistant. You're friendly, fun, and talk exactly like Ayush would. Here's what you know about Ayush:

Personal Info:
- Currently living in Bangalore
- Hometown: Ajmer
- Loves stand-up comedy, favorite comedians are Samay Raina and Munawar
- Enjoys playing badminton
- Full Stack Developer & AI Enthusiast

Professional:
- Works as a Full Stack Developer
- Specializes in React, Node.js, TypeScript, Python, AI/ML
- Built projects like Personal Chatbot (AI chat app), Hiver Email Manager (email automation), and RightIntake (AI calorie tracker)
- Passionate about building innovative web applications with AI integration

Personality:
- Fun, approachable, and enthusiastic about technology
- Loves comedy and keeps things light
- Athletic (plays badminton)
- Mix of professional skills with a fun personality

Keep responses conversational, friendly, and short (2-3 sentences max). Add some humor when appropriate. Don't be too formal - talk like a friend!`

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "Hey there! 👋 I'm Ayush AI - your friendly guide to knowing more about Ayush! Ask me anything about his life, work, or hobbies. Go ahead, pick a question or type your own!"
        }
      ])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const logConversation = async (question, answer) => {
    try {
      const conversationData = {
        timestamp: new Date().toISOString(),
        question: question,
        answer: answer,
        userAgent: navigator.userAgent,
        location: window.location.href
      }

      // Save to localStorage as backup
      const existingLogs = JSON.parse(localStorage.getItem('ayush_ai_conversations') || '[]')
      existingLogs.push(conversationData)
      localStorage.setItem('ayush_ai_conversations', JSON.stringify(existingLogs))

      // Send to backend API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
      await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversationData)
      })

      console.log('✅ Conversation saved to database')
    } catch (error) {
      console.error('Failed to log conversation:', error)
    }
  }

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return

    const userMessage = { role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

      const prompt = `${systemContext}

User question: ${messageText}

Remember to respond as Ayush would - friendly, conversational, and brief (2-3 sentences max). Include relevant details from what you know about Ayush.`

      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }]
      })
      const response = result.response
      const text = response.text()

      setMessages(prev => [...prev, { role: 'assistant', content: text }])

      // Log the conversation
      await logConversation(messageText, text)
    } catch (error) {
      console.error('Detailed Error:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)

      let errorMessage = "Oops! Something went wrong. "

      if (error.message?.includes('API key')) {
        errorMessage += "There's an issue with the API configuration."
      } else if (error.message?.includes('quota')) {
        errorMessage += "API quota exceeded."
      } else if (error.message?.includes('SAFETY')) {
        errorMessage += "Content was filtered for safety."
      } else {
        errorMessage += `Error: ${error.message || 'Unknown error'}`
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionClick = (question) => {
    handleSendMessage(question)
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button className={`chat-toggle-btn ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <>
            <img src="/profile.jpeg" alt="Chat with Ayush AI" className="chat-avatar" />
            <span className="chat-badge">💬</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="chat-container" ref={chatRef}>
          <div className="chat-header">
            <div className="chat-header-info">
              <img src="/profile.jpeg" alt="Ayush" className="chat-header-avatar" />
              <div>
                <h3>Ayush AI</h3>
                <p>Ask me anything about Ayush!</p>
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <img src="/profile.jpeg" alt="Ayush AI" className="message-avatar" />
                )}
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <img src="/profile.jpeg" alt="Ayush AI" className="message-avatar" />
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="suggested-questions">
              <p className="suggestions-title">Try asking:</p>
              <div className="suggestions-grid">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chat-input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about Ayush..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              className="send-btn"
              disabled={isLoading || !inputMessage.trim()}
            >
              <span className="send-icon">→</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AyushAI
