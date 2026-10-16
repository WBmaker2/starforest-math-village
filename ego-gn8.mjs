const task = await taskSpace("flow-asset");
const page = task.page("p1");
var PROMPT = "Childrens dress-up limited golden costume set: three shiny golden pieces side by side with gaps, golden crown hat, golden royal cape top, golden boots, sparkles, chibi anime style, thick outlines, flat bright colors, front view, solid pure magenta background, no shadow, no ground, no text";
await page.click("css=div[contenteditable='true']");
await page.keyboard.press("Meta+a");
await page.keyboard.paste(PROMPT);
await new Promise(function (res) { setTimeout(res, 3000); });
await page.click("loc=role:button[name='\uc0dd\uc131 \uc2dc\uc791']", { label: "generate golden set" });
console.log("GOLD_CLICKED");
