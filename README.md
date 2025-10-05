# Saathi - Your Digital Companion 🤝

**Saathi is an AI-powered assistant designed to help older adults navigate the digital world with confidence, providing simple, step-by-step guidance for everyday online tasks in both English and Hindi.**

### [Link to 2-Minute Demo Video] ---

## 🎯 The Problem

Many older adults find it challenging to keep up with modern technology. Essential tasks like paying bills online, sending an email, or using a messaging app can be confusing and intimidating. Saathi was built to be a patient, friendly companion that bridges this gap.

## ✨ Features

* **Conversational Text Chat:** A fully functional chat interface that remembers the conversation's context and renders formatted Markdown responses for clarity.
* **Advanced Voice Assistant:** A complete voice-to-voice pipeline. Users can speak their query in English or Hindi and receive step-by-step guidance spoken back by the browser's native voice.
* **Hands-Free Voice Commands:** Once the steps are displayed, users can navigate them using voice commands like "next," "previous," and "repeat" in both English and Hindi, providing a true hands-free experience.
* **Purpose-Driven AI:** The assistant is specifically engineered with prompt guard rails. It is an expert on digital tasks and will politely decline off-topic questions (e.g., general knowledge, trivia) to stay focused on its mission.
* **Smart App Recommendations:** Instead of using technical jargon like "email client," Saathi is instructed to recommend common, popular apps like "Gmail" or "Paytm" to make its advice more actionable.
* **Secure Authentication & History:** Built with Google Firebase for secure and easy user login. All chat conversations are saved to a persistent database and are accessible via a slide-out history panel.

## 📸 Screenshots


<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/62e70392-bafe-4edf-9940-baefe504ddc3" />
<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/904dca78-e8cf-4740-8e3f-4bfdfd59b0f4" />
<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/1ea44e6b-577d-414b-a36c-0f9e96028db9" />


## 🛠️ Tech Stack

* **Frontend:** React, Material-UI (MUI), Axios
* **Backend:** Java, Spring Boot, Spring Security, PostgreSQL, Maven
* **AI/ML:**
    * **Text Generation:** Cerebras API (`llama-4-scout-17b-16e-instruct`)
    * **Speech-to-Text:** Groq API (`whisper-large-v3`)
* **Authentication:** Google Firebase

## 🚀 Getting Started

### Prerequisites
* Java 17+
* Node.js & npm
* A running PostgreSQL instance
* API keys for Firebase, Groq, and Cerebras

### Backend Setup
1.  Clone the repository.
2.  Navigate to the `Saathi-Backend` directory.
3.  Set up your environment variables in `src/main/resources/application.properties` with your database credentials and API keys.
4.  Run the application: `./mvnw spring-boot:run`

### Frontend Setup
1.  Navigate to the `Saathi-Frontend` directory.
2.  Install dependencies: `npm install`
3.  Create a `.env.local` file and add your Firebase configuration keys.
4.  Run the application: `npm run dev`

## 🔮 Future Features

* **High-Quality Multilingual TTS:** Integrating a cloud TTS service for more natural-sounding voice responses.
* **Screen Sharing Assistance:** A feature to allow Saathi to guide users visually on their shared screen.
* **Saving and Favoriting Chats:** Allowing users to save and easily access important guides.
