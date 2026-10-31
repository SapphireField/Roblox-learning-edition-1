# Quest Academy: Night Shift

A browser survival-learning prototype inspired by the user's description of FNATG. Original presentation and monsters; not a verified recreation of the linked video.

Run `python3 -m http.server 8000` from this directory and open the site in a browser. No packages, accounts, or secrets required. Run logic tests with `node tests/survival.cjs`.

## How to play

Survive a 90-second night from midnight to 6 AM. Watch the left door, right door, ceiling vent, and floor vent. When glowing eyes appear, select that entrance and answer its question before the countdown reaches zero. Correct answers close the entrance and repel its monster. Doors reopen automatically after repelling the monster. Vents remain sealed until you click Reopen vent. Closed vents drain airflow; open all vents between attacks to recover it. Running out of airflow or letting any monster reach an open entrance ends the night. Other monsters keep moving while you answer questions. Wrong answers reveal an explanation, cost two seconds of approach time, and give a new question.

Eight difficulties range from 22 to 8 seconds per attack. Higher modes spawn monsters more often and select harder question pools. Choose Chinese, history, philosophy, or mixed subjects. Surviving awards local browser badges, with additional badges for flawless defense, mixed subjects, and harder nights. Existing expedition badges remain stored but the survival badge collection uses new achievement IDs.

This is a small question bank, not a full grades 8–10 curriculum. Badges are browser-local, not Roblox or online-account achievements. Logic tests use a simulated DOM; visual browser testing remains outstanding.

## Custom Chinese focus

In the lobby, paste a Chinese word or passage, or load a UTF-8 `.txt` file (up to 48 KB; 12,000 characters and 150 challenges). Select **Use this practice** to replace Chinese questions. Mixed mode retains history/philosophy alongside your material. Vocabulary format: `学校 | school | xuéxiào` (pinyin optional). Plain passages generate missing-character recall questions; isolated words generate memory recall. Review the material before starting. Answers require typing exact Chinese characters, using your device's Chinese keyboard/IME. No automatic translation is performed. Higher modes remove supplied pinyin hints and reduce reaction time. Material stays in memory locally until reload; **Use built-in questions** clears it. Test parsing with `node tests/practice.cjs`.

### PDF import

Use **Upload practice** to select a text-based PDF (maximum 10 MB, 50 pages, 12,000 extracted characters). Review the extracted Chinese text, correct layout/extraction mistakes, then select **Use this practice**. Previous practice stays active until you apply the replacement. Scanned/image PDFs require OCR elsewhere first; encrypted PDFs require an unlocked copy. There is no automatic translation or OCR.

PDF parsing runs locally with bundled PDF.js 6.4.299 (Apache-2.0, license in `vendor/pdfjs/LICENSE`), including Chinese character maps. No document is sent to an external service. Serve the game over HTTP (`python3 -m http.server 8000`) or use hosting; browser module/worker restrictions prevent PDF import through `file://`. Text paste remains available without a server. Bundled files were obtained from the pinned npm package `pdfjs-dist@6.4.299`.

PDF extraction was verified in Chromium with a generated Chinese PDF, including review/apply, use in the game question pool, and invalid-PDF feedback.
