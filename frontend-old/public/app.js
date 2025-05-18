document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    darkMode:
      localStorage.getItem("darkMode") === "true" ||
      (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches),
    sidebarOpen: window.innerWidth >= 768,
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
      if (!event.target.value) return

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

        // Create user message
        const userMessageDiv = document.createElement("div")
        userMessageDiv.className = "chat-message user"

        const messageContent = document.createElement("div")
        messageContent.className = "chat-message-content"
        messageContent.textContent = message

        const messageTime = document.createElement("div")
        messageTime.className = "chat-message-time"
        const now = new Date()
        messageTime.textContent = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`

        userMessageDiv.appendChild(messageContent)
        userMessageDiv.appendChild(messageTime)
        chatHistory.appendChild(userMessageDiv)

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

    // Table functionality
    tableData: {
      headers: ["Item", "Quantity", "Price"],
      rows: [["", "", ""]],
    },

    addTableRow() {
      this.tableData.rows.push(Array(this.tableData.headers.length).fill(""))
    },

    addTableColumn() {
      this.tableData.headers.push("")
      this.tableData.rows.forEach((row) => row.push(""))
    },

    removeTableRow(index) {
      if (this.tableData.rows.length > 1) {
        this.tableData.rows.splice(index, 1)
      }
    },

    removeTableColumn(index) {
      if (this.tableData.headers.length > 1) {
        this.tableData.headers.splice(index, 1)
        this.tableData.rows.forEach((row) => row.splice(index, 1))
      }
    },

    submitStaticFields() {
      const chatHistory = document.getElementById("chat-history")

      // Create a section divider
      const divider = document.createElement("div")
      divider.className = "section-divider"
      divider.textContent = "Static Fields Submitted"
      chatHistory.appendChild(divider)

      // Create a confirmation message
      const confirmMessage = document.createElement("div")
      confirmMessage.className = "chat-message"

      const messageContent = document.createElement("div")
      messageContent.className = "chat-message-content"
      messageContent.innerHTML = `
        <p>Thank you for submitting the static fields. Let's continue with the dynamic fields.</p>
        <div class="status status-success" style="margin-top: 0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.25rem;">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
          Fields saved successfully
        </div>
      `

      const messageTime = document.createElement("div")
      messageTime.className = "chat-message-time"
      const now = new Date()
      messageTime.textContent = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`

      confirmMessage.appendChild(messageContent)
      confirmMessage.appendChild(messageTime)
      chatHistory.appendChild(confirmMessage)

      // Hide the form
      const staticForm = document.getElementById("static-fields-form")
      if (staticForm) {
        staticForm.style.display = "none"
      }

      // Scroll to bottom
      this.scrollToBottom()

      // Send to server via HTMX to get the next step
      htmx.ajax("POST", "/api/save-static", {
        target: "#chat-history",
        swap: "beforeend",
      })
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
    const newElements = event.detail.target.querySelectorAll(
      ":scope > div:not(.fade-in):not(.slide-in):not(.section-divider)",
    )
    newElements.forEach((el) => {
      el.classList.add("fade-in")
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
