bot.onText(/\/start/, (msg) => {
  // Faccio si che l'utente parta con 100 monete inizializzandolo
  if (!userData[msg.chat.id]) {
    userData[msg.chat.id] = {
      monete: 100
    };
  }
  bot.sendMessage(msg.chat.id, `Benvenuto! Hai ${userData[msg.chat.id].monete} monete. Scegli il numero del dado con cui vuoi giocare seguendo la seguente sintassi "/gioca d3"`);
});

// Gestisce il comando /gioca
bot.onText(/\/gioca (.+)/, (msg, match) => {
  const dado = parseInt(match[1].replace('d', ''));
  if (isNaN(dado) || dado <= 0 || dado > 6) {
    bot.sendMessage(msg.chat.id, 'Inserisci un tipo di dado valido con questa scrittura es. "d3"');
    return;
  }
  bot.sendMessage(msg.chat.id, 'Inserisci la scommessa quanto vuoi scommettere se vinci riceverai il doppio delle monete!!', {
    reply_markup: {
      force_reply: true
    }
  }).then((sent) => {
    bot.onReplyToMessage(sent.chat.id, sent.message_id, (message) => {
      const scommessa = parseInt(message.text.split(' ')[0]);
      if (isNaN(scommessa) || scommessa <= 0) {
        bot.sendMessage(msg.chat.id, 'Inserisci una scommessa valida!!!');
        return;
      }
      const numero_generato = Math.floor(Math.random() * dado) +1;
      const risultato = numero_generato == dado  ? 'VITTORIA' : 'SCONFITTA';
      const guadagno = risultato === 'VITTORIA' ? scommessa * 2 : -scommessa;
      userData[msg.chat.id].monete += guadagno;
      bot.sendMessage(msg.chat.id, `Il numero del dado uscito è ${numero_generato}. ${risultato}! ${guadagno > 0 ? 'Hai guadagnato ' + guadagno + ' monete.' : 'Hai perso ' + (-guadagno) + ' monete.'} Il tuo saldo è ${userData[msg.chat.id].monete} monete.`);

      // Controlla se l'utente ha ancora monete e permette di riniziare il gioco se non ne ha più
      if (userData[msg.chat.id].monete <= 0) {
        bot.sendMessage(msg.chat.id, 'Hai finito le monete! Vuoi riniziare il gioco? Digita /restart per inizare nuovamente con 100 monete.');
      }
    });
  });
});

// Gestisce il comando /restart per far riniziare il gioco all'utente
bot.onText(/\/restart/, (msg) => {
  userData[msg.chat.id].monete = 100;
  bot.sendMessage(msg.chat.id, 'Hai riniziato il gioco! Hai 100 monete. Scegli il numero del dado con cui vuoi giocare seguendo la seguente sintassi "/gioca d3"');
});
