package main

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"
)

func main() {
	// Serve static files from ./public
	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/public/", http.StripPrefix("/public/", fs))

	// Route handlers
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./public/index.html")
	})

	http.HandleFunc("/chatbot", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./public/chatbot.html")
	})

	http.HandleFunc("/config", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./public/config.html")
	})

	http.HandleFunc("/dashboard", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, `
			<div>
				<h2 class="text-2xl font-bold mb-4">Dashboard</h2>
				<p class="text-sm sm:text-base">Welcome to OpenReporting! Start by creating a new report with the Chatbot or editing a YAML configuration.</p>
				<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-lg shadow text-sm sm:text-base">
						<h3 class="text-lg font-semibold">Recent Configs</h3>
						<p class="text-gray-600 dark:text-gray-400">No recent configs. <a href="/config" hx-get="/config" hx-target="#main-content" class="text-indigo-600 dark:text-indigo-400">Create one</a>.</p>
					</div>
					<div class="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-lg shadow text-sm sm:text-base">
						<h3 class="text-lg font-semibold">Recent Reports</h3>
						<p class="text-gray-600 dark:text-gray-400">No recent reports. <a href="/chatbot" hx-get="/chatbot" hx-target="#main-content" class="text-indigo-600 dark:text-indigo-400">Start a chat</a>.</p>
					</div>
				</div>
			</div>
		`)
	})

	http.HandleFunc("/api/configs", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, `[
			{"id": "1", "name": "Financial Report Japan"},
			{"id": "2", "name": "Default Report Config"}
		]`)
	})

	http.HandleFunc("/api/fields", func(w http.ResponseWriter, r *http.Request) {
		// Add a small delay to simulate network latency and show animations
		time.Sleep(300 * time.Millisecond)
		
		// Create a section divider
		fmt.Fprintf(w, `
			<div class="section-divider">Static Fields</div>
			
			<div id="static-fields-form" class="chat-form">
				<h3 class="chat-form-title">Static Fields</h3>
				
				<div class="form-group">
					<label for="client_name" class="form-label">Client Name</label>
					<input type="text" id="client_name" name="client_name" class="form-input" placeholder="Enter client name">
					<span class="text-sm text-muted">Full name of the client</span>
				</div>
				
				<div class="form-group">
					<label for="report_date" class="form-label">Report Date</label>
					<input type="date" id="report_date" name="report_date" value="2025-05-19" class="form-input">
					<span class="text-sm text-muted">Date of the report (YYYY-MM-DD)</span>
				</div>
				
				<div x-data="{ tableData: $root.tableData }" class="form-group">
					<label class="form-label">Items Table</label>
					
					<div class="table-container">
						<table class="editable-table">
							<thead>
								<tr>
									<template x-for="(header, index) in tableData.headers" :key="index">
										<th>
											<input type="text" x-model="tableData.headers[index]" placeholder="Column name">
										</th>
									</template>
									<th style="width: 40px;"></th>
								</tr>
							</thead>
							<tbody>
								<template x-for="(row, rowIndex) in tableData.rows" :key="rowIndex">
									<tr>
										<template x-for="(cell, cellIndex) in row" :key="cellIndex">
											<td>
												<input type="text" x-model="tableData.rows[rowIndex][cellIndex]" placeholder="Enter value">
											</td>
										</template>
										<td>
											<button @click="removeTableRow(rowIndex)" class="btn btn-icon" title="Remove row">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
													<line x1="18" y1="6" x2="6" y2="18"></line>
													<line x1="6" y1="6" x2="18" y2="18"></line>
												</svg>
											</button>
										</td>
									</tr>
								</template>
							</tbody>
						</table>
					</div>
					
					<div class="table-actions">
						<button @click="addTableRow()" class="add-row-btn">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							Add Row
						</button>
						
						<button @click="addTableColumn()" class="add-column-btn">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							Add Column
						</button>
					</div>
				</div>
				
				<div class="chat-form-actions">
					<button @click="submitStaticFields()" class="btn btn-primary">Submit Static Fields</button>
				</div>
			</div>
		`)
	})

	http.HandleFunc("/api/save-static", func(w http.ResponseWriter, r *http.Request) {
		// Add a small delay to simulate network latency and show animations
		time.Sleep(500 * time.Millisecond)
		
		fmt.Fprint(w, `
			<div class="section-divider">Dynamic Fields - Finances</div>
			
			<div class="chat-message">
				<div class="chat-message-content">
					<p>Now, let's gather information about your finances. Please provide details about your financial situation.</p>
				</div>
				<div class="chat-message-time">Now</div>
			</div>
		`)
	})

	http.HandleFunc("/api/chat", func(w http.ResponseWriter, r *http.Request) {
		input := r.FormValue("chat-input")
		
		// Add a small delay to simulate network latency and show animations
		time.Sleep(300 * time.Millisecond)
		
		fmt.Fprintf(w, `
			<div class="chat-message">
				<div class="chat-message-content">
					<p>Got it. I've recorded your financial information: "%s"</p>
					<p>Would you like to continue to the next section?</p>
					<div class="chat-form-actions" style="margin-top: 1rem;">
						<button hx-post="/api/next-section" hx-target="#chat-history" hx-swap="beforeend" class="btn btn-primary">Continue to Next Section</button>
					</div>
				</div>
				<div class="chat-message-time">Now</div>
			</div>
		`, input)
	})
	
	http.HandleFunc("/api/next-section", func(w http.ResponseWriter, r *http.Request) {
		// Add a small delay to simulate network latency and show animations
		time.Sleep(500 * time.Millisecond)
		
		fmt.Fprint(w, `
			<div class="section-divider">Dynamic Fields - Market Analysis</div>
			
			<div class="chat-message">
				<div class="chat-message-content">
					<p>Let's discuss the current market conditions that affect your business. Please describe the market trends you're observing.</p>
				</div>
				<div class="chat-message-time">Now</div>
			</div>
		`)
	})

	http.HandleFunc("/api/previous-report/", func(w http.ResponseWriter, r *http.Request) {
		id := filepath.Base(r.URL.Path)
		
		// Add a small delay to simulate network latency and show animations
		time.Sleep(500 * time.Millisecond)
		
		fmt.Fprintf(w, `
			<div class="section-divider">Static Fields (Copied from Report %s)</div>
			
			<div id="static-fields-form" class="chat-form">
				<h3 class="chat-form-title">Static Fields</h3>
				
				<div class="form-group">
					<label for="client_name" class="form-label">Client Name</label>
					<input type="text" id="client_name" name="client_name" value="Client %s" class="form-input" placeholder="Enter client name">
					<span class="text-sm text-muted">Full name of the client</span>
				</div>
				
				<div class="form-group">
					<label for="report_date" class="form-label">Report Date</label>
					<input type="date" id="report_date" name="report_date" value="2025-05-0%s" class="form-input">
					<span class="text-sm text-muted">Date of the report (YYYY-MM-DD)</span>
				</div>
				
				<div x-data="{ tableData: { 
					headers: ['Item', 'Quantity', 'Price'],
					rows: [
						['Product %s', '10', '$100'],
						['Service %s', '2', '$500']
					]
				} }" class="form-group">
					<label class="form-label">Items Table</label>
					
					<div class="table-container">
						<table class="editable-table">
							<thead>
								<tr>
									<template x-for="(header, index) in tableData.headers" :key="index">
										<th>
											<input type="text" x-model="tableData.headers[index]" placeholder="Column name">
										</th>
									</template>
									<th style="width: 40px;"></th>
								</tr>
							</thead>
							<tbody>
								<template x-for="(row, rowIndex) in tableData.rows" :key="rowIndex">
									<tr>
										<template x-for="(cell, cellIndex) in row" :key="cellIndex">
											<td>
												<input type="text" x-model="tableData.rows[rowIndex][cellIndex]" placeholder="Enter value">
											</td>
										</template>
										<td>
											<button @click="tableData.rows.splice(rowIndex, 1)" class="btn btn-icon" title="Remove row">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
													<line x1="18" y1="6" x2="6" y2="18"></line>
													<line x1="6" y1="6" x2="18" y2="18"></line>
												</svg>
											</button>
										</td>
									</tr>
								</template>
							</tbody>
						</table>
					</div>
					
					<div class="table-actions">
						<button @click="tableData.rows.push(Array(tableData.headers.length).fill(''))" class="add-row-btn">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							Add Row
						</button>
						
						<button @click="tableData.headers.push(''); tableData.rows.forEach(row => row.push(''))" class="add-column-btn">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							Add Column
						</button>
					</div>
				</div>
				
				<div class="chat-form-actions">
					<button @click="$dispatch('submit-static-fields'); document.getElementById('static-fields-form').style.display = 'none';" hx-post="/api/save-static" hx-target="#chat-history" hx-swap="beforeend" class="btn btn-primary">Submit Static Fields</button>
				</div>
			</div>
		`, id, id, id, id, id)
	})

	http.HandleFunc("/api/download-report/", func(w http.ResponseWriter, r *http.Request) {
		id := filepath.Base(r.URL.Path)
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=report_%s.docx", id))
		fmt.Fprint(w, "Mock DOCX content for report "+id)
	})

	fmt.Println("Server running at http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Server error:", err)
	}
}
