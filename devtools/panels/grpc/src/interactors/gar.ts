import { RequestRow } from "@/entities/request-row";

export function downloadGar(requestRows: RequestRow[]) {
  const filename = new Date().toISOString().replace(/[^\d]/g, "").slice(0, -5) + ".gar";
  const text = JSON.stringify({ version: "v1", requestRows });
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function uploadGar(onUpload: (requestRows: RequestRow[]) => void) {
  const input =
    document.querySelector<HTMLInputElement>("input[data-upload]") ??
    (() => {
      const input = document.createElement("input");
      input.dataset["upload"] = "true";
      return input;
    })();
  input.type = "file";
  input.accept = ".gar";
  input.addEventListener("change", async () => {
    const files = input.files;
    if (files === null) {
      removeInput();
      return;
    }

    const text = await files[0]?.text();
    if (text === void 0) {
      removeInput();
      return;
    }

    onUpload(JSON.parse(text).requestRows);
    removeInput();
  });
  function removeInput() {
    if (document.body.contains(input)) {
      document.body.removeChild(input);
    }
  }
  document.body.appendChild(input);
  input.dispatchEvent(new MouseEvent("click"));
}
