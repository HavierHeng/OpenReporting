document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    darkMode:
      localStorage.getItem("darkMode") === "true" ||
      (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches),
    sidebarOpen: window.innerWidth >= 768,
    navCollapsed: localStorage.getItem("navCollapsed") === "true" || false,
    settingsOpen: false,
    historyOpen: false,
    conversationStarted: false,
    showJumpButton: false,
    configSelected: false,
    currentPage:
      window.location.pathname === "/"
        ? "dashboard"
        : window.location.pathname === "/chatbot"
          ? "chatbot"
          : window.location.pathname === "/config"
            ? "config"
            : "dashboard",

    init() {
      // Apply dark mode on page load
      this.applyTheme()

      // Listen for system theme changes
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("darkMode")) {
          this.darkMode = e.matches
          this.applyTheme()
        }
      })

      // Handle resize events
      window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
          this.sidebarOpen = true
        }
      })

      // Set up chat history scroll detection if on chatbot page
      if (this.currentPage === "chatbot") {
        const chatHistory = document.getElementById("chat-history")
        if (chatHistory) {
          this.setupChatScroll(chatHistory)
        }
      }
    },

    applyTheme() {
      document.documentElement.classList.toggle("dark", this.darkMode)
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem("darkMode", this.darkMode)
      this.applyTheme()
    },

    toggleNav() {
      this.navCollapsed = !this.navCollapsed
      localStorage.setItem("navCollapsed", this.navCollapsed)
    },

    checkMobileNav() {
      if (window.innerWidth < 768) {
        this.navCollapsed = false
      }
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    toggleSettings() {
      this.settingsOpen = !this.settingsOpen
      this.historyOpen = false // Close history if open
    },

    toggleHistory() {
      this.historyOpen = !this.historyOpen
      this.settingsOpen = false // Close settings if open
    },

    selectConfig(event) {
      this.configSelected = true

      // Hide config selection with animation
      const configSelection = document.querySelector(".config-selection")
      if (configSelection) {
        configSelection.classList.add("hidden")
      }

      // Scroll chat to bottom after a short delay
      setTimeout(() => {
        const chatHistory = document.getElementById("chat-history")
        if (chatHistory) {
          chatHistory.scrollTop = chatHistory.scrollHeight
        }
      }, 300)
    },

    setupChatScroll(chatHistory) {
      // Add scroll event listener
      chatHistory.addEventListener("scroll", () => {
        const showJumpButton = chatHistory.scrollTop < chatHistory.scrollHeight - chatHistory.clientHeight - 50
        const jumpButton = document.getElementById("jump-button")
        if (jumpButton) {
          jumpButton.style.display = showJumpButton ? "flex" : "none"
        }
      })
    },

    startConversation() {
      this.conversationStarted = true
    },

    scrollToBottom() {
      const chatHistory = document.getElementById("chat-history")
      if (chatHistory) {
        chatHistory.scrollTop = chatHistory.scrollHeight
      }
    },

    sendMessage(event) {
      event.preventDefault()
      const chatInput = document.getElementById("chat-input")
      const chatHistory = document.getElementById("chat-history")

      if (chatInput && chatInput.value.trim() && chatHistory) {
        const message = chatInput.value.trim()

        // Create user message bubble
        const userBubble = document.createElement("div")
        userBubble.className = "chat-bubble user slide-in"
        userBubble.textContent = message
        chatHistory.appendChild(userBubble)

        // Clear input
        chatInput.value = ""

        // Scroll to bottom
        this.scrollToBottom()

        // Send to server via HTMX
        htmx.ajax("POST", "/api/chat", {
          target: "#chat-history",
          swap: "beforeend",
          values: { "chat-input": message },
        })
      }
    },
  }))
})

// Handle HTMX events
document.addEventListener("htmx:afterSwap", (event) => {
  // After content is swapped, scroll chat to bottom if it's a chat message
  if (event.detail.target.id === "chat-history") {
    const chatHistory = document.getElementById("chat-history")
    if (chatHistory) {
      chatHistory.scrollTop = chatHistory.scrollHeight
    }

    // If this is a field submission, mark conversation as started
    if (event.detail.xhr && event.detail.xhr.responseURL && event.detail.xhr.responseURL.includes("/api/save-static")) {
      const app = Alpine.$data(document.querySelector("[x-data]"))
      if (app) {
        app.conversationStarted = true
      }
    }

    // Add animation class to new elements
    const newElements = event.detail.target.querySelectorAll(":scope > div:not(.slide-in)")
    newElements.forEach((el) => {
      el.classList.add("slide-in")
    })
  }
})

// Clear chat input after sending
document.body.addEventListener("htmx:afterRequest", (event) => {
  if (event.detail.xhr && event.detail.xhr.responseURL && event.detail.xhr.responseURL.includes("/api/chat")) {
    const chatInput = document.getElementById("chat-input")
    if (chatInput) {
      chatInput.value = ""
    }
  }
})
