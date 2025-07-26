# React + Typescript + Firebase + ShadcnUI + TailwindCSS + EmailJS

## How to setup and start the project?

- First, you need two things, an EmailJS account, and a Firebase Project (With Firestore Database, Storage and Authentication through email + password and google account)

```env
# EMAILJS CONFIGURATION
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# FIREBASE CONFIGURATION
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

- Second, you just need to run **npm install**, then **npm run dev** to start the application on development environment


This is a full client web application, with no backend. The application goal is to manage the employees

- First, the company owner needs to register through his google account or just email and password.
<img width="1920" height="1080" alt="Captura de Tela (67)" src="https://github.com/user-attachments/assets/1c7a5a85-87d6-470f-bc58-69725dd90745" />

  
- Second, add all his employees, informations like name, email, phonenumber, and photo are required.
<img width="1920" height="1080" alt="Captura de Tela (71)" src="https://github.com/user-attachments/assets/b0d3447f-ee96-4292-a879-a5462dc60167" />

## How the application works ?

After adding the employees, there is a feature of *"Generate face recognition link"*. Here you will send an email to all employees with a link
The link will redirect to the application face recognition, where the employee will be recognized and after that, the employee is able to clock in or clock out

<img width="1920" height="1080" alt="Captura de Tela (72)" src="https://github.com/user-attachments/assets/f485153e-c655-4838-944a-59beaf1278c2" />

 

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
