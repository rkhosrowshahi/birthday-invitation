# Birthday invitation
A responsive, playful birthday invitation. Click No to shrink and relocate it while Yes grows. Click Yes to reveal the party details and directions with Google Maps, Apple Maps, or Waze.

## Personalize
Edit `party.js` with the host name, date/time, full address, and optional venue. Missing details show honest placeholders; directions appear only when an address is configured.

## Preview
Run `python3 -m http.server 3000` in this folder and open http://localhost:3000.

## Deploy
Upload this folder to a GitHub repository. Import the repository at https://vercel.com/new, select Other as the framework, leave the build command empty, and use `.` as the output directory. No dependencies or secrets are needed. Future pushes will deploy automatically when the repository is connected to Vercel.

The Yes interaction displays details only; it does not collect or send RSVPs.
