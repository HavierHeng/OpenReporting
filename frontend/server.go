package main

import (
	"fmt"
	"net/http"
	"path/filepath"
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
		// configID := r.URL.Query().Get("config-select")
		// configName := "Financial Report Japan"
		// if configID == "2" {
		// 	configName = "Default Report Config"
		// }
		fmt.Fprintf(w, `
			<div class="chat-bubble bg-white dark:bg-gray-800 rounded-lg p-4 mb-2">
				<p class="text-lg font-semibold mb-2">------ Static Fields ------</p>
				<div class="space-y-4">
					<div class="group relative">
						<label for="client_name" class="block text-sm sm:text-base font-medium">Client Name</label>
						<input type="text" id="client_name" name="client_name" value="" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base" placeholder="Enter client name">
						<span class="absolute left-0 top-0 mt-8 ml-2 bg-gray-200 dark:bg-gray-700 text-xs p-1 rounded hidden group-hover:block">Full name of the client</span>
					</div>
					<div class="group relative">
						<label for="report_date" class="block text-sm sm:text-base font-medium">Report Date</label>
						<input type="date" id="report_date" name="report_date" value="2025-05-19" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base">
						<span class="absolute left-0 top-0 mt-8 ml-2 bg-gray-200 dark:bg-gray-700 text-xs p-1 rounded hidden group-hover:block">Date of the report (YYYY-MM-DD)</span>
					</div>
					<div x-data="{ rows: [{ id: 1, item: '', quantity: '' }] }">
						<label class="block text-sm sm:text-base font-medium">Items Table</label>
						<div class="mt-2 space-y-2">
							<template x-for="row in rows" :key="row.id">
								<div class="flex space-x-2">
									<input type="text" x-model="row.item" class="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base" placeholder="Item">
									<input type="number" x-model="row.quantity" class="w-24 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base" placeholder="Quantity">
								</div>
							</template>
						</div>
						<button @click="rows.push({ id: rows.length + 1, item: '', quantity: '' })" class="mt-2 bg-indigo-600 text-white p-1 rounded-md text-sm sm:text-base">+ Add Row</button>
					</div>
					<button hx-post="/api/save-static" hx-include="[name='client_name'],[name='report_date'],[x-model]" hx-target="#chat-history" hx-swap="beforeend" @click="startConversation" class="mt-4 bg-green-600 text-white p-2 rounded-md text-sm sm:text-base">Submit Static Fields</button>
				</div>
			</div>
		`)
	})

	http.HandleFunc("/api/save-static", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, `
			<div class="chat-bubble bg-white dark:bg-gray-800 rounded-lg p-4 mb-2">
				<p class="text-lg font-semibold mb-2">------ Gathering information on "finances" ------</p>
				<p class="text-gray-600 dark:text-gray-400">I will now assist you with filling in finances through a series of questions.</p>
			</div>
		`)
	})

	http.HandleFunc("/api/chat", func(w http.ResponseWriter, r *http.Request) {
		input := r.FormValue("chat-input")
		fmt.Fprintf(w, `
			<div class="chat-bubble bg-gray-100 dark:bg-gray-700 rounded-lg p-2 mb-2 ml-auto">
				<p class="text-gray-800 dark:text-gray-200">%s</p>
			</div>
			<div class="chat-bubble bg-white dark:bg-gray-800 rounded-lg p-4 mb-2">
				<p class="text-gray-600 dark:text-gray-400">Got it. Proposed value: "%s" for finances. Confirm?</p>
				<button hx-post="/api/confirm-field" hx-vals='{"field": "finances", "value": "%s"}' hx-target="#chat-history" hx-swap="beforeend" class="mt-2 bg-green-600 text-white p-1 rounded-md text-sm sm:text-base">Confirm</button>
			</div>
		`, input, input, input)
	})

	http.HandleFunc("/api/confirm-field", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, `
			<div class="chat-bubble bg-white dark:bg-gray-800 rounded-lg p-4 mb-2">
				<p class="text-lg font-semibold mb-2">------ Executive Summary ------</p>
				<p class="text-gray-600 dark:text-gray-400">Summary: The report covers financial performance for Q2 2025 in Japan. Confirm and download?</p>
				<button hx-post="/api/generate-report" hx-target="#chat-history" hx-swap="beforeend" class="mt-2 bg-green-600 text-white p-2 rounded-md text-sm sm:text-base">Confirm & Download</button>
			</div>
		`)
	})

	http.HandleFunc("/api/generate-report", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Disposition", "attachment; filename=report_2025-05-19.docx")
		fmt.Fprint(w, "Mock DOCX content for generated report")
	})

	http.HandleFunc("/api/previous-report/", func(w http.ResponseWriter, r *http.Request) {
		id := filepath.Base(r.URL.Path)
		fmt.Fprintf(w, `
			<div class="chat-bubble bg-white dark:bg-gray-800 rounded-lg p-4 mb-2">
				<p class="text-lg font-semibold mb-2">------ Static Fields (Copied from Report %s) ------</p>
				<div class="space-y-4">
					<div class="group relative">
						<label for="client_name" class="block text-sm sm:text-base font-medium">Client Name</label>
						<input type="text" id="client_name" name="client_name" value="Client %s" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base" placeholder="Enter client name">
						<span class="absolute left-0 top-0 mt-8 ml-2 bg-gray-200 dark:bg-gray-700 text-xs p-1 rounded hidden group-hover:block">Full name of the client</span>
					</div>
					<div class="group relative">
						<label for="report_date" class="block text-sm sm:text-base font-medium">Report Date</label>
						<input type="date" id="report_date" name="report_date" value="2025-05-0%s" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base">
						<span class="absolute left-0 top-0 mt-8 ml-2 bg-gray-200 dark:bg-gray-700 text-xs p-1 rounded hidden group-hover:block">Date of the report (YYYY-MM-DD)</span>
					</div>
					<div x-data="{ rows: [{ id: 1, item: 'Item %s', quantity: '10' }] }">
						<label class="block text-sm sm:text-base font-medium">Items Table</label>
						<div class="mt-2 space-y-2">
							<template x-for="row in rows" :key="row.id">
								<div class="flex space-x-2">
									<input type="text" x-model="row.item" class="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base" placeholder="Item">
									<input type="number" x-model="row.quantity" class="w-24 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base" placeholder="Quantity">
								</div>
							</template>
						</div>
						<button @click="rows.push({ id: rows.length + 1, item: '', quantity: '' })" class="mt-2 bg-indigo-600 text-white p-1 rounded-md text-sm sm:text-base">+ Add Row</button>
					</div>
					<button hx-post="/api/save-static" hx-include="[name='client_name'],[name='report_date'],[x-model]" hx-target="#chat-history" hx-swap="beforeend" @click="startConversation" class="mt-4 bg-green-600 text-white p-2 rounded-md text-sm sm:text-base">Submit Static Fields</button>
				</div>
			</div>
		`, id, id, id, id)
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
