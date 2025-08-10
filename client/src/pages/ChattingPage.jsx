import React, { useState, useRef } from 'react'
import NavBar from '../Components/NavBar'
import run from '../Config/Gemini'
import { FiSidebar } from "react-icons/fi"
import { FiX } from "react-icons/fi"
import { MdDeleteOutline } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";

const ChattingPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const stopTypingRef = useRef(false)

  const handleSend = async () => {
    if (!input.trim()) return

    setMessages([...messages, { sender: 'user', text: input }])
    setHistory(prev => [...prev, { question: input, answer: "" }])
    setSelectedIdx(history.length)
    setIsTyping(true)
    stopTypingRef.current = false

    try {
      const response = await run(input)
      let responseArray = response.split("**")
      let newArray = ""
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newArray += responseArray[i]
        } else {
          newArray += "<b>" + responseArray[i] + "</b>"
        }
      }
      let newResponse = newArray.split("*").join("</br>")
      let plainResponse = newResponse.replace(/<\/?b>/g, '').replace(/<\/?br>/g, '')

      // Typing effect for Gemini response
      let currentAnswer = ""
      let idx = 0

      const typeLetter = () => {
        if (stopTypingRef.current) {
          setHistory(prev => {
            const updated = [...prev]
            updated[history.length] = { question: input, answer: plainResponse }
            return updated
          })
          setIsTyping(false)
          return
        }
        if (idx < plainResponse.length) {
          currentAnswer += plainResponse[idx]
          setHistory(prev => {
            const updated = [...prev]
            updated[history.length] = { question: input, answer: currentAnswer }
            return updated
          })
          idx++
          setTimeout(typeLetter, 30)
        } else {
          setIsTyping(false)
        }
      }
      typeLetter()
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }])
      setHistory(prev => [...prev, { question: input, answer: 'Sorry, something went wrong.' }])
      setSelectedIdx(history.length)
      setIsTyping(false)
    }

    setInput('')
  }

  const handleStopTyping = () => {
    stopTypingRef.current = true
  }

  const handleRemove = idx => {
    setHistory(prev => prev.filter((_, i) => i !== idx))
    if (selectedIdx === idx) setSelectedIdx(null)
    else if (selectedIdx > idx) setSelectedIdx(selectedIdx - 1)
  }

  const selectedQA = history[selectedIdx ?? history.length - 1]

  const Loader = () => (
    <div className="flex items-center justify-center h-6 w-full">
      <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-300 border-t-gray-500"></div>
    </div>
  );

  return (
    <>
      <NavBar />
      {/* Sidebar toggle button - always visible, outside sidebar */}
      <div className="fixed top-[90px] left-4 md:left-8 z-30 mb-6">
        <button
          className="bg-gray-200 rounded-full p-2 flex items-center justify-center shadow"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          style={{ width: '40px', height: '40px' }}
        >
          {sidebarOpen ? (
            <FiX className="h-6 w-6 text-gray-700" />
          ) : (
            <FiSidebar className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>
      <div className="mt-[80px] flex flex-col md:flex-row border border-gray-200 bg-gray-50 min-h-[80vh] relative">
        {/* Sidebar for questions only */}
        <div
          className={`fixed md:static left-0 z-10
            bg-gray-100 p-4 pt-6 md:pt-14 border-r border-gray-200 overflow-y-auto
            transition-all duration-300
            ${sidebarOpen ? 'w-3/4 md:w-1/4 opacity-100' : 'w-0 opacity-0 pointer-events-none'}
          `}
          style={{
            minWidth: sidebarOpen ? undefined : 0,
            position: 'fixed',
            top: '80px',
            bottom: '64px',
            height: 'auto'
          }}
        >
          {/* Add margin-top to Questions header for extra space */}
          <h2 className="text-lg font-semibold mb-4 mt-6 text-gray-700">
            Questions
          </h2>
          <div className="space-y-3">
            {history.length === 0 && (
              <div className="text-gray-400 text-sm">No questions yet.</div>
            )}
            {history.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <button
                  className={`flex-1 text-left bg-white rounded-lg shadow p-2 text-gray-800 font-medium hover:bg-gray-200 ${
                    selectedIdx === idx ? 'border border-gray-400' : ''
                  }`}
                  onClick={() => {
                    setSelectedIdx(idx)
                    if (window.innerWidth < 768) setSidebarOpen(false)
                  }}
                >
                  {item.question}
                </button>
                <span className="ml-2 cursor-pointer" onClick={() => handleRemove(idx)}>
                  <MdDeleteOutline className="h-5 w-5  hover:text-red-700" />
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Main chat area */}
        <div
          className={`flex-1 flex flex-col bg-white rounded-lg shadow-md m-2 p-2 md:m-6 md:p-4 relative min-h-0 transition-all duration-300
            ${sidebarOpen ? 'md:ml-[25%]' : 'md:ml-0'} ml-[56px]
          `}
        >
          {/* Chat content area */}
          <div className="w-full flex-1 overflow-y-auto flex flex-col gap-4" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            {history.length === 0 ? (
              <div className="text-gray-400 text-sm text-center">Start chatting to see Q/A here.</div>
            ) : (
              selectedQA && (
                <div className="flex flex-col w-full gap-2">
                  {/* User question */}
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-lg p-3 max-w-[80%] text-left text-gray-800 font-medium">
                      {selectedQA.question}
                    </div>
                  </div>
                  {/* Gemini answer below */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] text-left text-gray-600 text-sm min-h-[2rem] flex items-center">
                      {isTyping && !selectedQA.answer
                        ? <Loader />
                        : selectedQA.answer}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {/* Input area fixed at bottom */}
          <div className="w-full flex gap-2 items-center sticky bottom-0 bg-white py-2 z-10">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
            />
            {!isTyping ? (
              <button
                className="bg-gray-200 text-gray-800 rounded-full p-2 flex items-center justify-center hover:bg-gray-300"
                onClick={handleSend}
                disabled={isTyping}
                style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
                aria-label="Send"
              >
                <IoSendSharp className="h-5 w-5" />
              </button>
            ) : (
              <button
                className="bg-red-200 text-red-800 rounded-full p-2 flex items-center justify-center hover:bg-red-300"
                style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
                onClick={handleStopTyping}
                aria-label="Stop"
              >
                {/* Stop icon (SVG) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChattingPage