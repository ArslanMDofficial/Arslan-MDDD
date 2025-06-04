const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const P = require("pino");
const fs = require("fs");
const config = require("./config");
const path = require("path");

const { state, saveState } = useSingleFileAuthState("./session.json");

async function startBot() {
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: P({ level: "silent" }),
        browser: ["Arslan-MD", "Safari", "1.0.0"]
    });

    sock.ev.on("creds.update", saveState);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const type = Object.keys(msg.message)[0];
        const body = msg.message.conversation || msg.message[type]?.text || "";

        if (body.startsWith(config.prefix)) {
            const command = body.slice(config.prefix.length).trim().split(/ +/).shift().toLowerCase();
            if (command === "ping") {
                await sock.sendMessage(from, { text: "🏓 Pong!" });
            }
        }
    });
}

startBot();
                  
