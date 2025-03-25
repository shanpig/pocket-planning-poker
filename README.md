# 🃏 Pocket Planning Poker

<img src="https://github.com/user-attachments/assets/e3a8429b-95ed-44f9-b94a-195bec15fe85" width="100%"/>

<br/><br/>

Planning poker everywhere - this one is a small and concise one.

- We don't need to host it on cloud; it can be run locally with ease.
- We don't need to sign in; planning normally happens within team members.
- We don't need to record past planning data; planning is ephemeral.

Planning Poker is a consensus-based, gamified technique for estimating, commonly used in agile development.

## ▶️ How to Run the Application

It's super easy:

1. Setup [ngrok](https://dashboard.ngrok.com/get-started/setup/macos) (I use ngrok for reverse https proxying to tunnel through localhost. You can skp this in the bin/poker.sh if you have your own method):

   ```bash
   # mac
   brew install ngrok

   # windows
   choco install ngrok
   ```

   rename .env.template to .env and add your own [ngrok auth token](https://dashboard.ngrok.com/get-started/your-authtoken):

   ```bash
   # .env.template -> .env
   NGROK_AUTHTOKEN=<your ngrok authtoken>
   EXPOSED_PORT=6789
   PORT=6789
   ```

2. Run the script:

   ```bash
   bin/poker.sh
   ```

3. Use the ngrok website link in the stdout (`https://<hash>.ngrok-free.app`) to visit the app
   <img src="https://github.com/user-attachments/assets/f3351b16-9ad6-477a-a339-3291d01a6490" />

   and that's it ! 🔥

If you want to close the app, just ctrl-c to close the process 😎

## 💻 Tech Stack

This project utilizes the following technologies:

- **Next.js** : A React framework for building fast web applications.
- **React** : A JavaScript library for building user interfaces.
- **Socket.io** : Enables real-time, bidirectional communication between web clients and servers.
- **Shadcn UI** : A component library for building user interfaces.
- **Tailwind CSS** : A utility-first CSS framework for styling.
- **TypeScript** : A typed superset of JavaScript that compiles to plain JavaScript.

## 🌟 Emotional ~Damage~ Support

If you found this repo useful, please give me a star 🌟 to let me know.
