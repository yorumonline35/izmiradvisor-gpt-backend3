import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const context = `
IzmirAdvisor provides real estate advisory services in İzmir and Northern Cyprus.
They help with residence permits, health tourism, student housing, and property investment.
They support foreign clients in both English and Turkish.

IzmirAdvisor, İzmir ve Kuzey Kıbrıs'ta gayrimenkul danışmanlığı sunar.
Oturum izni, sağlık turizmi, öğrenci evleri ve yatırım konularında destek verir.
Yabancı müşterilere Türkçe ve İngilizce yardımcı olurlar.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "Aşağıdaki bilgileri temel alarak Türkçe veya İngilizce konuşan kullanıcılara doğal, kısa ve yardımsever yanıtlar ver. Bilgi: " + context },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const botResponse = completion.data.choices[0].message.content;
    res.json({ reply: botResponse });
  } catch (error) {
    console.error('GPT API Hatası:', error.message);
    res.status(500).json({ error: 'Cevap alınamadı, lütfen tekrar deneyin.' });
  }
});

app.listen(port, () => {
  console.log(`Chatbot sunucusu http://localhost:${port} adresinde çalışıyor`);
});