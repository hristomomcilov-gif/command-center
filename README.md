# Teamulate Command Center

Home is a calm, personal start to the day. Teamulate is the operating dashboard for acquisition, content, and what needs a person.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Weather uses the public Open-Meteo forecast for the signed-in profile location when the network is available. Calendar, priorities, news, and mail currently come from a temporary adapter in `src/lib/home/sources` so each section can be wired to a live integration without rebuilding the page.
