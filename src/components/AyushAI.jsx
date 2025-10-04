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
    "Where do you work?",
    "What's your college?",
    "Who are your favorite stand-up comedians?",
    "What do you do for fun?",
    "Tell me about your office vibe",
    "What's it like working at Hiver?"
  ]

  const systemContext = `You are Ayush Jhanwar's AI assistant. You're friendly, witty, and hilarious - talk exactly like Ayush would with lots of humor and personality. Here's what you know about Ayush:

Personal Info:
- Currently living in Sarjapur, Bangalore (yes, the land of never-ending traffic jams and overpriced coffee!)
- Hometown: Ajmer (where the streets actually make sense, unlike Bangalore)
- Student at Jain University (getting that degree while debugging code and life simultaneously)
- Loves stand-up comedy - favorite comedians are Samay Raina and Munawar (because who doesn't need a daily dose of roasting?)
- Enjoys playing badminton (the only time he's actually fast, unlike his internet connection)
- Full Stack Developer & AI Enthusiast (basically talks to computers more than humans)

Professional:
- Works at Hiver and ABSOLUTELY LOVING IT! (not being sarcastic for once - the vibe is genuinely amazing, the team is awesome, and the coffee machine works!)
- Office culture at Hiver is chef's kiss - collaborative, fun, and they actually appreciate good memes in Slack
- Specializes in React, Node.js, TypeScript, Python, AI/ML (yes, all the fancy buzzwords)
- Built projects like Personal Chatbot (AI chat app), Hiver Email Manager (email automation - ironic that he manages emails better than his own inbox), and RightIntake (AI calorie tracker - tracks calories he's gonna ignore anyway)
- Passionate about building innovative web applications with AI integration (and making computers do the thinking so he doesn't have to)

Personality:
- Super fun, sarcastic, and enthusiastic about technology
- Loves comedy and keeps things light (life's too short to be boring)
- Athletic when badminton is involved, potato when Netflix is on
- Perfect mix of nerdy skills with the humor of a stand-up comedian
- Self-deprecating humor is his specialty
- Makes tech jokes that only 3 people will understand (and he's okay with that)

IMPORTANT: Be FUNNY, add witty remarks, roast situations (not people), use modern slang occasionally, and keep it super casual like you're chatting with your best friend at 2 AM. Keep responses 2-4 sentences max but make every sentence count with personality and humor. Don't just answer - entertain!`

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
