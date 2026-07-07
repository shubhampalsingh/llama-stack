/* BotVill embed widget — <script src="https://botvill.com/widget.js" data-bot="KEY" async></script> */
(function () {
  var script = document.currentScript;
  if (!script) return;
  var botKey = script.getAttribute("data-bot");
  if (!botKey) return;
  var color = script.getAttribute("data-color") || "#5a67d8";
  var origin = new URL(script.src).origin;

  if (document.getElementById("botvill-widget-btn")) return;

  // Floating button
  var btn = document.createElement("button");
  btn.id = "botvill-widget-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML = "💬";
  btn.style.cssText =
    "position:fixed;bottom:20px;right:20px;z-index:2147483646;width:60px;height:60px;" +
    "border-radius:50%;border:none;cursor:pointer;font-size:26px;background:" + color + ";" +
    "box-shadow:0 4px 16px rgba(0,0,0,.25);transition:transform .15s ease;";
  btn.onmouseenter = function () { btn.style.transform = "scale(1.08)"; };
  btn.onmouseleave = function () { btn.style.transform = "scale(1)"; };

  // Chat iframe (hidden until opened)
  var frame = document.createElement("iframe");
  frame.id = "botvill-widget-frame";
  frame.src = origin + "/embed/" + encodeURIComponent(botKey);
  frame.title = "Chat";
  frame.style.cssText =
    "position:fixed;bottom:92px;right:20px;z-index:2147483647;width:min(380px,calc(100vw - 32px));" +
    "height:min(560px,calc(100vh - 120px));border:none;border-radius:16px;" +
    "box-shadow:0 12px 40px rgba(0,0,0,.3);display:none;background:#fff;";

  var open = false;
  btn.onclick = function () {
    open = !open;
    frame.style.display = open ? "block" : "none";
    btn.innerHTML = open ? "✕" : "💬";
  };

  document.body.appendChild(btn);
  document.body.appendChild(frame);
})();
