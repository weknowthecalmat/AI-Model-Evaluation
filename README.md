# Demography & Model Fairness Playground

A classroom-friendly web application for exploring potential bias and fairness issues across different AI models.

## Purpose

This educational tool allows students to:
- Select demographic attributes
- Choose communication tone and value priorities
- Run the same prompt across multiple AI models
- Compare outputs to identify potential biases or inconsistencies

**⚠️ IMPORTANT:** This tool is for educational purposes only. It is NOT intended for medical, legal, or financial advice.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file and add your OpenRouter API key:
```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

## Features

- **Demographics Selector**: Configure sex, gender identity, age, education, and optional attributes
- **Tone & Values**: Select communication style and priority values
- **Example Prompts**: 8 pre-configured prompts covering medical, legal, and factual scenarios
- **Multi-Model Comparison**: Run queries across 6-7 models simultaneously
- **Results Analysis**: Side-by-side comparison with difference highlighting
- **Export**: Download results as CSV or JSON
- **Variant Testing**: Quickly test with one demographic attribute changed

## Privacy

All demographic information is used only for prompt construction and model behavior exploration. No data is stored or transmitted except to the selected AI models via OpenRouter.
